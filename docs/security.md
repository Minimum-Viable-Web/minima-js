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

## MITM protection for network fetches

`loadTemplate(url)` and `preloadComponent(componentPath)` only allow HTTPS URLs or same-origin relative paths (`/`, `./`, `../`). Plain `http://` URLs are rejected to avoid tampering on the wire.

## Dynamic analysis (assertions)

Tests and CI run with assertions enabled (Node `assert`, `NODE_ENV=test`) to improve fault detection before deployment. These assertions are for dynamic analysis only; they are not enabled in production builds. Production use of the library does not depend on or enable the test-time assertion paths.

## Releases

Packages are published over HTTPS (GitHub Packages). CI runs tests before publish. Consumers install via HTTPS; use lockfiles for reproducible installs.

## CSP notes

- No `eval()` is used by the template engine.
- For SSR, MinimaJS serializes attributes safely and skips function-valued `on*` props when rendering to HTML (functions don’t serialize).

