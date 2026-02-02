# SSR API (`@minimum-viable-web/minimajs/ssr`)

Exports from `src/minima-ssr.js`.

## `renderToString(componentOrVNode, props?)`

```js
import { renderToString } from '@minimum-viable-web/minimajs/ssr';

const html = renderToString(App, { user: { name: 'Alice' } });
```

What it does:

- Converts a component/VNode tree to an HTML string
- Escapes text via the template sanitization rules
- Skips function-valued `on*` props (functions don’t serialize to HTML)

## `hydrate(componentOrVNode, container, serverHTML?, handlers?)`

```js
import { hydrate } from '@minimum-viable-web/minimajs/ssr';

hydrate(App, document.getElementById('app'));
```

What it does:

- Compares server HTML with a client-generated HTML string
- If it detects a mismatch, it falls back to a client render

## `preloadComponent(componentPath)`

```js
import { preloadComponent } from '@minimum-viable-web/minimajs/ssr';

const PageModule = await preloadComponent('/components/Page.js');
```

## `ssrData(key, fetcher)`

```js
import { ssrData } from '@minimum-viable-web/minimajs/ssr';

// Reads <script type="application/json" data-ssr-key="user">...</script> when present,
// otherwise falls back to fetcher().
const user = ssrData('user', () => ({ name: 'Anon' }));
```

## `injectSSRData(html, dataMap)`

```js
import { injectSSRData } from '@minimum-viable-web/minimajs/ssr';

const page = injectSSRData('<body></body>', { user: { name: 'Alice' } });
```

See also: [`docs/ssr.md`](../ssr.md)

