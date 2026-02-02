# Core API (`@minimum-viable-web/minimajs/core`)

This is the **lowest-level** MinimaJS module: VNodes, rendering, and hooks. Most users will prefer `@minimum-viable-web/minimajs/api` (short helpers) or `@minimum-viable-web/minimajs` (re-exported surface), but understanding core helps when debugging.

Exports from `src/minima-core.js`.

## VNodes (mental model)

- A VNode is an object like `{ type, props, key }`.
- `type` is either a **tag name** (`'div'`) or a **component function**.
- `props.children` is an array (children are flattened).

## `createElement(type, props?, ...children)`

Creates a VNode.

```js
import { createElement as h } from '@minimum-viable-web/minimajs/core';

const view = h(
  'div',
  { id: 'app', className: 'card' },
  'Hello',
  h('button', { onClick: () => console.log('clicked') }, 'Click')
);
```

Tip: if you prefer shorter tag helpers (`div(...)`, `button(...)`) use `@minimum-viable-web/minimajs/api`.

## `render(vnodeOrComponent, container)`

Renders a VNode into a DOM element.

```js
import { createElement as h, render } from '@minimum-viable-web/minimajs/core';

const App = () => h('h1', null, 'Hello MinimaJS');

render(App, document.getElementById('app'));
```

Notes:

- Passing a component function is allowed; core will wrap it for you.
- Calling `render(null, container)` clears the previous render.

## Hooks (rules)

- Hooks **must** run inside a component render (not in random functions).
- Call hooks **unconditionally** (don’t put them in `if`/loops).

## `useState(initial)`

State hook. Returns `[value, setValue]`.

```js
import { createElement as h, useState } from '@minimum-viable-web/minimajs/core';

export function Counter() {
  const [count, setCount] = useState(0);

  return h('div', null,
    h('p', null, `Count: ${count}`),
    h('button', { onClick: () => setCount(count + 1) }, 'Increment')
  );
}
```

## `useEffect(effect, deps?)`

Side effects + cleanup.

```js
import { createElement as h, useEffect, useState } from '@minimum-viable-web/minimajs/core';

export function Clock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return h('div', null, new Date(now).toLocaleTimeString());
}
```

## `useMemo(factory, deps)`

Caches an expensive computation until `deps` change.

```js
import { createElement as h, useMemo } from '@minimum-viable-web/minimajs/core';

export function Square({ n }) {
  const squared = useMemo(() => n * n, [n]);
  return h('div', null, `${n}² = ${squared}`);
}
```

## `useCallback(fn, deps)`

Returns a stable function reference until `deps` change.

```js
import { createElement as h, useCallback } from '@minimum-viable-web/minimajs/core';

export function SaveButton({ onSave }) {
  const handleClick = useCallback(() => onSave(), [onSave]);
  return h('button', { onClick: handleClick }, 'Save');
}
```

## `useTransition()`

Returns `[isPending, startTransition]`.

```js
import { createElement as h, useState, useTransition } from '@minimum-viable-web/minimajs/core';

export function TransitionDemo() {
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  return h('div', null,
    h('input', {
      value: text,
      onInput: (e) => startTransition(() => setText(e.target.value)),
      placeholder: 'Type...'
    }),
    h('p', null, isPending ? 'Updating…' : 'Idle')
  );
}
```

## `useDeferredValue(value)`

Stores a value and schedules a deferred render when it changes. (This implementation simply re-renders; it does not do React-style prioritization.)

```js
import { createElement as h, useDeferredValue } from '@minimum-viable-web/minimajs/core';

export function DeferredLabel({ value }) {
  const deferred = useDeferredValue(value);
  return h('div', null, `Deferred: ${deferred}`);
}
```

## `useResource(resourceFactory)`

Caches the return value of `resourceFactory()` for the lifetime of the component instance and returns it.

Important: in the current implementation it **does not** accept a deps array, and it **does not** provide a `.read()` API.

```js
import { createElement as h, useEffect, useResource, useState } from '@minimum-viable-web/minimajs/core';

export function UserJson() {
  const userPromise = useResource(() => fetch('/api/user').then(r => r.json()));
  const [user, setUser] = useState(null);

  useEffect(() => {
    userPromise.then(setUser);
  }, []);

  return user ? h('pre', null, JSON.stringify(user, null, 2)) : h('div', null, 'Loading…');
}
```

## `Suspense`

`Suspense` is exported, but in the current core implementation it’s effectively a **placeholder** (it does not wrap child rendering, so it won’t catch async work thrown by nested components).

If you need loading states today, use `useState` + `useEffect` patterns (as shown above) or use the higher-level helpers in `@minimum-viable-web/minimajs/llm`.

