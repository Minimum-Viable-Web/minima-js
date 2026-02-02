import api from '../src/minima-api.js';
import * as full from '../src/minima-full.js';
import * as llm from '../src/minima-llm.js';
import * as devtools from '../src/minima-devtools.js';

export const runLibModuleTests = (test, eq, ok) => {
  // API bundle
  test('api: exposes core helpers and shortcuts', () => {
    ok(api && typeof api.h === 'function', 'api.h exists');
    ok(typeof api.app === 'function', 'api.app exists');
    ok(typeof api.createElement === 'function', 'api.createElement exists');
  });

  // LLM layer
  test('llm: exports quick builders', () => {
    ok(typeof llm.quickForm === 'function', 'quickForm is function');
    ok(typeof llm.quickList === 'function', 'quickList is function');
    ok(typeof llm.quickModal === 'function', 'quickModal is function');
  });

  // Devtools
  test('devtools: exports control functions', () => {
    eq(typeof devtools.enableDevTools, 'function', 'enableDevTools fn');
    eq(typeof devtools.disableDevTools, 'function', 'disableDevTools fn');
    eq(typeof devtools.inspectComponentTree, 'function', 'inspectComponentTree fn');
  });

  // Full bundle smoke test
  test('full: createElement basic vnode', () => {
    const v = full.createElement('div', { id: 'x' }, 'y');
    eq(v.type, 'div', 'type');
    eq(v.props.id, 'x', 'id');
    ok(v.props.children && v.props.children[0] === 'y', 'children populated');
  });
};


