# Getting Started

## Install

```bash
npm install @minimum-viable-web/minimajs
```

## Pick an import style

- **Everything (single import)**: `@minimum-viable-web/minimajs` (re-exports core/template/component/ssr/llm/api/devtools)
- **Modular (tree-shakeable)**: `@minimum-viable-web/minimajs/core` (and `./template`, `./component`, `./ssr`, `./api`, `./llm`, `./devtools`)
- **Single-file bundle (repo artifact/CDN-style)**: import from `dist/minima-full.min.js`

## Minimal counter (combined import)

```js
import { div, h1, button, useState, app } from '@minimum-viable-web/minimajs';

const Counter=()=>{const[c,s]=useState(0);return div([h1(`Count: ${c}`),button({onClick:()=>s(c+1)},'Click')])};
app(Counter,'app');
```

HTML:

```html
<div id="app"></div>
<script type="module" src="./main.js"></script>
```

## Run the included examples

The example files use **ES modules**, so serve them over HTTP (don’t open them from `file://`).

```bash
# from repo root
python -m http.server 8000
```

Then open:

- `http://localhost:8000/examples/getting-started.html`
- `http://localhost:8000/examples/llm-demo.html`
- `http://localhost:8000/examples/ultra-concise-demo.html`

