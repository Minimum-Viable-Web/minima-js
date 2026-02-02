# SSR and Hydration

MinimaJS provides a small SSR surface in `@minimum-viable-web/minimajs/ssr` (also re-exported from the main entry).

## `renderToString(component, props?)`

```js
import { renderToString } from '@minimum-viable-web/minimajs/ssr';
const html=renderToString(App,{user});
```

Notes:

- `renderToString` converts VNodes to HTML and **escapes text** via `sanitizeText()`.
- Function-valued `on*` props are **not** serialized into HTML.

## `hydrate(component, container, serverHTML?)`

```js
import { hydrate } from '@minimum-viable-web/minimajs/ssr';
hydrate(App,document.getElementById('app'));
```

Hydration compares normalized server/client HTML and will fall back to a client render if it detects a mismatch.

## `preloadComponent(componentPath)`

```js
import { preloadComponent } from '@minimum-viable-web/minimajs/ssr';
const Mod=await preloadComponent('/components/MyComponent.js');
```

## SSR data helpers

- `ssrData(key, fetcher)` reads JSON embedded in `<script type="application/json" data-ssr-key="...">` (or calls `fetcher()`).
- `injectSSRData(html, dataMap)` injects those scripts into a server-rendered HTML string.

```js
import { ssrData, injectSSRData } from '@minimum-viable-web/minimajs/ssr';
const data=ssrData('user',()=>({name:'Anon'}));
const out=injectSSRData(pageHtml,{user:data});
```

