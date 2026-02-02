# Modules and Imports

MinimaJS is published as an **ES module** package and exposes multiple entry points via `package.json` `exports`.

## Main entry

```js
import { createElement, useState, html, renderToString } from '@minimum-viable-web/minimajs';
```

This entry re-exports APIs from the core modules (see `src/minima.js`).

## Subpath exports

Each of these maps directly to a source file (and a minified `dist/` build for production):

- `@minimum-viable-web/minimajs/core` → `src/minima-core.js` (`dist/minima-core.min.js`)
- `@minimum-viable-web/minimajs/template` → `src/minima-template.js` (`dist/minima-template.min.js`)
- `@minimum-viable-web/minimajs/component` → `src/minima-component.js` (`dist/minima-component.min.js`)
- `@minimum-viable-web/minimajs/ssr` → `src/minima-ssr.js` (`dist/minima-ssr.min.js`)
- `@minimum-viable-web/minimajs/api` → `src/minima-api.js` (`dist/minima-api.min.js`)
- `@minimum-viable-web/minimajs/llm` → `src/minima-llm.js` (`dist/minima-llm.min.js`)
- `@minimum-viable-web/minimajs/devtools` → `src/minima-devtools.js` (`dist/minima-devtools.min.js`)

## Everything (single import)

```js
import { div, useState, html, renderToString } from '@minimum-viable-web/minimajs';
```

This gives you the full exported surface via re-exports in `src/minima.js`.

## Single-file combined bundle (repo artifact)

This repo also ships a combined file that includes all modules in one file:

- Source: `src/minima-full.js`
- Minified: `dist/minima-full.min.js`

## CDN-style usage (repo build artifacts)

This repo includes minified outputs in `dist/`. In simple demos you can import the combined bundle:

```js
import { div, app } from '../dist/minima-full.min.js';
```

(See `examples/*.html` for the intended pattern.)

