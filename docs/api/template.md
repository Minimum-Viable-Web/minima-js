# Template API (`@minimum-viable-web/minimajs/template`)

This module provides **HTML-like template literals** that compile into MinimaJS VNodes, with **built-in XSS protection**.

Exports come from `src/minima-template.js`.

## `html\`...\``

`html` is a tagged template function. You write HTML-ish markup, interpolate values, and get back a VNode.

```js
import { html } from '@minimum-viable-web/minimajs/template';

export function Greeting({ name }) {
  return html`<div class="card">Hello ${name}</div>`;
}
```

### How interpolation works

- **Strings/numbers/booleans** are escaped using `sanitizeText()` before they become HTML.
- **Arrays** are supported (useful for loops): you can interpolate `items.map(...)`.
- **Functions** can be used as event handlers. For example, `onclick="${fn}"` becomes an `onClick` prop.

```js
import { html } from '@minimum-viable-web/minimajs/template';

export function ButtonDemo() {
  const onClick = () => console.log('clicked');

  return html`
    <button onclick="${onClick}">
      Click me
    </button>
  `;
}
```

Tip: if you want more explicit “JS object props” style instead of HTML strings, use `@minimum-viable-web/minimajs/api`.

## `sanitizeText(text)`

Escapes dangerous characters for safe insertion into HTML/text contexts.

```js
import { sanitizeText } from '@minimum-viable-web/minimajs/template';

console.log(sanitizeText('<b>x</b>'));
// -> "&lt;b&gt;x&lt;/b&gt;"
```

## `loadTemplate(url)`

Fetches a template file over HTTP and returns a VNode. This is useful when you want to keep large HTML fragments in separate files.

```js
import { loadTemplate } from '@minimum-viable-web/minimajs/template';
import { createElement as h, useEffect, useState } from '@minimum-viable-web/minimajs/core';

export function RemoteTemplate() {
  const [view, setView] = useState(null);

  useEffect(() => {
    loadTemplate('/templates/card.html').then(setView);
  }, []);

  return view || h('div', null, 'Loading…');
}
```

