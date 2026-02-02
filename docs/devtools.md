# DevTools

MinimaJS DevTools are lightweight, optional debugging helpers exposed by `@minimum-viable-web/minimajs/devtools` (and re-exported from the main entry).

## Enable / disable

```js
import { enableDevTools, disableDevTools } from '@minimum-viable-web/minimajs/devtools';
enableDevTools(); // sets window.__MINIMA_DEVTOOLS__ = true
disableDevTools();
```

You can also enable in the browser console:

```js
window.__MINIMA_DEVTOOLS__=true;
```

## Inspect / profile helpers

```js
import { inspectComponentTree, analyzePerformance } from '@minimum-viable-web/minimajs/devtools';
inspectComponentTree();
analyzePerformance();
```

## Hooks

- `useDevTools(componentName?)` exposes minimal inspection helpers when devtools are enabled.
- `useProfiler(componentName?)` provides simple timing/mark utilities (manual profiling surface).

