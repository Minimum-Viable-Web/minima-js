# DevTools API (`@minimum-viable-web/minimajs/devtools`)

Exports from `src/minima-devtools.js`.

DevTools are **off by default** to keep production overhead near zero. Enable them explicitly when debugging.

## `enableDevTools()` / `disableDevTools()`

```js
import { enableDevTools } from '@minimum-viable-web/minimajs/devtools';
enableDevTools(); // sets window.__MINIMA_DEVTOOLS__ = true
```

## `useDevTools(componentName?)`

```js
import { useDevTools } from '@minimum-viable-web/minimajs/devtools';

export function Demo() {
  const dev = useDevTools('Demo');

  // When enabled, you can inspect the current component info.
  dev.logState?.();

  return 'ok';
}
```

## `useProfiler(componentName?)`

```js
import { useProfiler } from '@minimum-viable-web/minimajs/devtools';

export function Work() {
  const profiler = useProfiler('Work');
  const end = profiler.measure?.('expensiveWork');

  // ...do work...

  end?.();
  return 'done';
}
```

## `inspectComponentTree()`

```js
import { inspectComponentTree } from '@minimum-viable-web/minimajs/devtools';
inspectComponentTree();
```

## `analyzePerformance()`

```js
import { analyzePerformance } from '@minimum-viable-web/minimajs/devtools';
analyzePerformance();
```

