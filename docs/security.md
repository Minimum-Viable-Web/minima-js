# Security (XSS/CSP)

MinimaJS ships with **built-in XSS protection** in its template engine (`@minimum-viable-web/minimajs/template`).

## Safe-by-default template interpolation

When you interpolate primitive values into `html\`\``, MinimaJS **escapes** them via `sanitizeText()`:

```js
import { html } from '@minimum-viable-web/minimajs/template';
const userInput='<img src=x onerror=alert(1) />';
const view=html`<div>${userInput}</div>`; // escaped output
```

## `sanitizeText(text)`

```js
import { sanitizeText } from '@minimum-viable-web/minimajs/template';
sanitizeText('<b>hi</b>'); // "&lt;b&gt;hi&lt;/b&gt;"
```

Use this when you must sanitize external strings before inserting into non-template contexts.

## URL attribute filtering

The template engine rejects dangerous URL schemes like `javascript:` / `data:` / `vbscript:` for URL-bearing attributes.

## Event handlers in templates

To attach handlers inside templates, pass functions as interpolations. The template engine converts them into event props (e.g. `onclick` → `onClick`) in a CSP-friendly way.

```js
import { html } from '@minimum-viable-web/minimajs/template';
const onClick=()=>console.log('clicked');
const view=html`<button onclick="${onClick}">Click</button>`;
```

## CSP notes

- No `eval()` is used by the template engine.
- For SSR, MinimaJS serializes attributes safely and skips function-valued `on*` props when rendering to HTML (functions don’t serialize).

