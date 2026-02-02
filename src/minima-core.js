/* MinimaJS Core v1.0.0 - Modern Virtual DOM Framework */

// Global state management
let currentComponent = null;
let hookIndex = 0;

// Cached constants
const CHILDREN = 'children', KEY = 'key';
const ERR_OUTSIDE = 'outside component';

const depsEqual = (a, b) => {
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
};

// Hook initialization helper
const initHook = (name) => {
  if (!currentComponent) throw new Error(`${name}: ${ERR_OUTSIDE}`);
  const comp = currentComponent;
  const idx = hookIndex++;
  if (!comp.hooks) comp.hooks = [];
  if (!comp.hooks[idx]) comp.hooks[idx] = {};
  return [comp, idx, comp.hooks[idx]];
};

// Concurrent rendering state
let renderQueue = new Set();
let isRendering = false;
const PRIORITIES = { IMMEDIATE: 0, NORMAL: 1, IDLE: 2 };

// Transition tracking
let currentTransition = null;
let pendingTransitions = new Set();

// Suspense state management
let suspenseCache = new Map();
let currentSuspenseHandler = null;

// Post-commit effect queue
let effectQueue = new Set();
const flushEffects = () => {
  if (!effectQueue.size) return;
  effectQueue.forEach(comp => {
    (comp.hooks || []).forEach(h => {
      if (!h || !h._e) return;
      h._e = 0;
      if (h.cleanup) h.cleanup();
      const c = h.effect && h.effect();
      h.cleanup = typeof c === 'function' ? c : null;
    });
  });
  effectQueue.clear();
};

// Deep-flatten children
const flat = (a, r = []) => (a.forEach(v => Array.isArray(v) ? flat(v, r) : r.push(v)), r);

// Virtual Node creation
const createElement = (type, props = {}, ...children) => {
  const isVNode = (v) => v && typeof v === 'object' && 'type' in v && 'props' in v;
  if (props == null) props = {};
  else if (typeof props !== 'object' || Array.isArray(props) || isVNode(props)) (children = [props, ...children], props = {});
  const flatChildren = flat(children);

  // Create props object only if needed
  const vnodeProps = props && Object.keys(props).length > 0
    ? { ...props, [CHILDREN]: flatChildren }
    : { [CHILDREN]: flatChildren };

  const vnode = { type, props: vnodeProps, key: props?.key ?? null };

  // Validate keys in children for duplicates
  if (flatChildren.length > 1) {
    const keys = new Set();
    for (let i = 0; i < flatChildren.length; i++) {
      const child = flatChildren[i];
      if (child?.key) {
        if (keys.has(child.key)) {
          console.warn('createElement: Duplicate keys detected in children. This may cause rendering issues.');
          break;
        }
        keys.add(child.key);
      }
    }
  }

  return vnode;
};

// Component state hook
const useState = (initial) => {
  const [comp, idx, hook] = initHook('useState');
  const owner = currentComponent;
  if (hook.state === undefined) hook.state = typeof initial === 'function' ? initial() : initial;
  
  const setState = (newState) => {
    const value = typeof newState === 'function' ? newState(hook.state) : newState;
    if (hook.state !== value) {
      hook.state = value;
      scheduleRender(owner);
    }
  };
  
  return [hook.state, setState];
};

// Effect hook with dependency tracking
const useEffect = (effect, deps) => {
  const [comp, idx, hook] = initHook('useEffect');
  
  if (!depsEqual(hook.deps, deps)) (hook.deps = deps, hook.effect = effect, hook._e = 1, effectQueue.add(comp));
  if (!comp.cleanup) comp.cleanup = () => comp.hooks?.forEach(h => h.cleanup?.());
};

// Memo hook for expensive computations
const useMemo = (factory, deps) => {
  const [, , hook] = initHook('useMemo');
  if (!depsEqual(hook.deps, deps)) {
    hook.value = factory();
    hook.deps = deps;
  }
  return hook.value;
};

// Callback hook for stable function references
const useCallback = (callback, deps) => {
  const [, , hook] = initHook('useCallback');
  if (!depsEqual(hook.deps, deps)) {
    hook.callback = callback;
    hook.deps = deps;
  }
  return hook.callback;
};

// Transition hook for concurrent updates
const useTransition = () => {
  const [, , hook] = initHook('useTransition');
  if (hook.isPending === undefined) hook.isPending = false;

  const startTransition = (callback) => {
    const transition = {
      id: Math.random().toString(36).substr(2, 9),
      priority: PRIORITIES.NORMAL,
      callback,
      startTime: performance.now()
    };

    currentTransition = transition;
    pendingTransitions.add(transition);
    hook.isPending = true;

    try {
      callback();
    } finally {
      pendingTransitions.delete(transition);
      if (pendingTransitions.size === 0) currentTransition = null;
      hook.isPending = false;
    }
  };

  return [hook.isPending, startTransition];
};

// Deferred value hook for concurrent updates
const useDeferredValue = (value) => {
  const [, , hook] = initHook('useDeferredValue');
  const owner = currentComponent;
  if (hook.deferredValue !== value) {
    hook.deferredValue = value;
    scheduleRender(owner);
  }
  return hook.deferredValue;
};

// Resource hook for async data fetching
const useResource = (resourceFactory) => {
  const [, , hook] = initHook('useResource');
  if (!hook.result) hook.result = resourceFactory();
  return hook.result;
};

// Suspense component
const Suspense = ({ children, fallback }) => {
  const prevSuspenseHandler = currentSuspenseHandler;
  currentSuspenseHandler = () => fallback;

  try {
    return children;
  } catch (promise) {
    if (promise && typeof promise.then === 'function') {
      return fallback; // Render fallback while promise is pending
    }
    throw promise;
  } finally {
    currentSuspenseHandler = prevSuspenseHandler;
  }
};

// Rendering queue
const scheduleRender = (component) => {
  if (!component || !component._m) return;
  renderQueue.add(component);
  if (!isRendering) {
    isRendering = true;
    // Use requestIdleCallback if available, fallback to setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        renderQueue.forEach(comp => renderComponent(comp));
        renderQueue.clear();
        isRendering = false;
        flushEffects();
      }, { timeout: 100 });
    } else {
      setTimeout(() => {
        renderQueue.forEach(comp => renderComponent(comp));
        renderQueue.clear();
        isRendering = false;
        flushEffects();
      }, 0);
    }
  }
};

// Unmount vnode tree (ensures effect cleanups run)
const unmountVNode = (vnode, dom) => {
  if (vnode == null || vnode === false) return;
  if (typeof vnode === 'string' || typeof vnode === 'number') return;
  if (typeof vnode === 'function') return;
  if (vnode.type && typeof vnode.type === 'function') {
    const inst = vnode._i;
    if (inst) {
      unmountVNode(inst.oldVNode, dom);
      inst.cleanup && inst.cleanup();
      effectQueue.delete(inst);
      inst._m = 0;
    }
    return;
  }
  const kids = vnode.props?.[CHILDREN] || [];
  const nodes = dom && dom.childNodes;
  if (kids && nodes) for (let i = 0, di = 0; i < kids.length && di < nodes.length; i++, di++) unmountVNode(kids[i], nodes[di]);
};

// Virtual DOM diffing algorithm with key-based reconciliation
const diff = (oldVNode, newVNode, container, index = 0) => {
  const empty = (v) => v == null || v === false;
  if (empty(oldVNode) && empty(newVNode)) return;
  // Remove old node
  if (empty(newVNode) && !empty(oldVNode)) {
    unmountVNode(oldVNode, container.childNodes[index]);
    container.removeChild(container.childNodes[index]);
    return;
  }

  // Add new node
  if (!empty(newVNode) && empty(oldVNode)) {
    container.appendChild(createDOMElement(newVNode));
    return;
  }

  // Replace different types
  if (oldVNode.type !== newVNode.type) {
    unmountVNode(oldVNode, container.childNodes[index]);
    container.replaceChild(createDOMElement(newVNode), container.childNodes[index]);
    return;
  }

  // Function components: update via instance render, not DOM props
  if (newVNode && newVNode.type && typeof newVNode.type === 'function') {
    const inst = (newVNode._i = oldVNode._i || newVNode._i || { fn: newVNode.type, hooks: [], oldVNode: null, dom: container.childNodes[index], props: newVNode.props, _m: 1 });
    inst.props = newVNode.props;
    inst.dom = container.childNodes[index];
    inst._m = 1;
    renderComponent(inst, container, index);
    return;
  }

  // Text nodes
  if (typeof newVNode === 'string' || typeof newVNode === 'number') {
    if (oldVNode !== newVNode) {
      container.childNodes[index].textContent = newVNode;
    }
    return;
  }

  // Update props
  const node = container.childNodes[index];
  updateProps(node, oldVNode.props, newVNode.props);

  // Diff children with key-based reconciliation
  const oldChildren = oldVNode.props[CHILDREN] || [];
  const newChildren = newVNode.props[CHILDREN] || [];

  // Group children by key for efficient reconciliation
  const oldKeyed = new Map();
  const oldKeyless = [];
  oldChildren.forEach((child, i) => {
    const key = child?.key;
    if (key != null) oldKeyed.set(String(key), { child, index: i });
    else oldKeyless.push({ child, index: i });
  });

  const newKeyed = new Map();
  const newKeyless = [];
  newChildren.forEach((child, i) => {
    const key = child?.key;
    if (key != null) newKeyed.set(String(key), { child, index: i });
    else newKeyless.push({ child, index: i });
  });

  // Process keyed children first
  const allKeys = new Set([...oldKeyed.keys(), ...newKeyed.keys()]);
  allKeys.forEach(key => {
    const old = oldKeyed.get(key), nw = newKeyed.get(key);

    if (!nw) {
      // Key removed - find and remove from DOM
      if (old) {
        const domIndex = findDOMIndexByKey(node, key);
        if (domIndex >= 0) {
          node.removeChild(node.childNodes[domIndex]);
        }
      }
    } else if (!old) {
      // Key added - insert at correct position
      const beforeKey = findBeforeKey(newKeyed, key);
      const beforeIndex = beforeKey ? findDOMIndexByKey(node, beforeKey) : -1;
      const domElement = createDOMElement(nw.child);
      if (beforeIndex >= 0) {
        node.insertBefore(domElement, node.childNodes[beforeIndex]);
      } else {
        node.appendChild(domElement);
      }
    } else {
      // Key exists - diff in place
      const domIndex = findDOMIndexByKey(node, key);
      diff(old.child, nw.child, node, domIndex >= 0 ? domIndex : old.index);
    }
  });

  // Process keyless children (simple positional diff)
  const maxKeyless = Math.max(oldKeyless.length, newKeyless.length);
  for (let i = 0; i < maxKeyless; i++) {
    const oldChild = oldKeyless[i]?.child;
    const newChild = newKeyless[i]?.child;
    diff(oldChild, newChild, node, oldKeyless[i]?.index ?? i);
  }
};

// Find DOM index by keyed element marker
const findDOMIndexByKey = (parent, key) => {
  const k = String(key);
  for (let i = 0; i < parent.childNodes.length; i++) {
    const n = parent.childNodes[i];
    if (n?.dataset?.minimaKey === k) return i;
  }
  return -1;
};

// Helper function to find the key that should come before this one
const findBeforeKey = (keyedMap, targetKey) => {
  const keys = Array.from(keyedMap.keys());
  const targetIndex = keys.indexOf(targetKey);
  for (let i = targetIndex - 1; i >= 0; i--) {
    if (keyedMap.has(keys[i])) return keys[i];
  }
  return null;
};

// Create DOM element from VNode
const createDOMElement = (vnode) => {
  if (vnode == null || vnode === false) return document.createTextNode('');
  if (typeof vnode === 'string' || typeof vnode === 'number') return document.createTextNode(vnode);
  if (typeof vnode === 'function') vnode = createElement(vnode);
  if (typeof vnode.type === 'function') return renderFunction(vnode);
  const element = document.createElement(vnode.type);
  if (vnode.key != null) element.dataset.minimaKey = String(vnode.key);
  updateProps(element, {}, vnode.props);
  (vnode.props?.[CHILDREN] || []).forEach(child => child != null && element.appendChild(createDOMElement(child)));
  return element;
};

// Function component rendering
const renderFunction = (vnode) => {
  const inst = vnode._i || (vnode._i = { fn: vnode.type, hooks: [], oldVNode: null, dom: null, props: vnode.props, _m: 1 });
  inst.props = vnode.props;
  const prevComponent = currentComponent, prevHookIndex = hookIndex;
  currentComponent = inst; hookIndex = 0;
  const rendered = inst.fn(vnode.props);
  if (!inst.dom) (inst.dom = createDOMElement(rendered), inst.oldVNode = rendered);
  currentComponent = prevComponent; hookIndex = prevHookIndex;
  return inst.dom;
};

// Re-render component
const renderComponent = (inst, parentNode, elementIndex) => {
  if (!inst || !inst._m) return;
  if (!parentNode) parentNode = inst.dom && inst.dom.parentNode;
  if (parentNode && elementIndex == null) {
    const siblings = parentNode.childNodes;
    elementIndex = 0;
    for (; elementIndex < siblings.length && siblings[elementIndex] !== inst.dom; elementIndex++);
  }
  if (!parentNode || elementIndex == null) return;
  const prevComponent = currentComponent, prevHookIndex = hookIndex;
  currentComponent = inst; hookIndex = 0;
  const next = inst.fn(inst.props);
  diff(inst.oldVNode, next, parentNode, elementIndex);
  inst.oldVNode = next;
  inst.dom = parentNode.childNodes[elementIndex];
  currentComponent = prevComponent; hookIndex = prevHookIndex;
};

const updateProps = (element, oldProps = {}, newProps = {}) => {
  const oldKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);

  // Remove old props (only if not in new props)
  for (let i = 0; i < oldKeys.length; i++) {
    const key = oldKeys[i];
    if (key === CHILDREN || key === KEY || key in newProps) continue;

    if (key.startsWith('on')) {
      element.removeEventListener(key.substring(2).toLowerCase(), oldProps[key]);
    } else if (key in element) {
      element[key] = '';
    } else {
      element.removeAttribute(key);
    }
  }

  // Set new props (only if different from old)
  for (let i = 0; i < newKeys.length; i++) {
    const key = newKeys[i];
    if (key === CHILDREN || key === KEY) continue;

    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue !== newValue) {
      if (key.startsWith('on')) {
        const event = key.substring(2).toLowerCase();
        if (oldValue) element.removeEventListener(event, oldValue);
        element.addEventListener(event, newValue);
      } else if (key in element) {
        element[key] = newValue;
      } else {
        element.setAttribute(key, newValue);
      }
    }
  }
};

// Main render function
const render = (vnode, container) => {
  if (typeof vnode === 'function') vnode = createElement(vnode);
  if (vnode == null || vnode === false) {
    if (container._minimaVNode) diff(container._minimaVNode, null, container, 0);
    container._minimaVNode = null;
    flushEffects();
    return;
  }
  if (container._minimaVNode) diff(container._minimaVNode, vnode, container, 0);
  else container.appendChild(createDOMElement(vnode));
  container._minimaVNode = vnode;
  flushEffects();
};

// Export public API
export {
  createElement, useState, useEffect, useMemo, useCallback,
  useTransition, useDeferredValue, useResource, Suspense, render
};
