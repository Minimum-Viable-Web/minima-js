# LLM API (`@minimum-viable-web/minimajs/llm`)

This module provides **high-level building blocks** that generate VNodes for common UI patterns. It’s designed to be friendly for LLM codegen, but the APIs are also convenient for humans because they encode common structure (forms, modals, tables, page layout) in a few parameters.

Exports come from `src/minima-llm.js`.

## Template builders

### `quickForm(config)`

Builds a full form (fields + submit + optional reset) and tracks values internally.

```js
import { quickForm } from '@minimum-viable-web/minimajs/llm';

export function LoginForm() {
  return quickForm({
    fields: [
      'email',
      { name: 'password', type: 'password' }
    ],
    showReset: true,
    onSubmit: (values) => {
      // values is an object keyed by field name
      console.log('submit:', values);
    }
  });
}
```

### `quickList(items, renderItem, options?)`

Creates `<ul>` or `<ol>` and renders each item as an `<li>`.

```js
import { quickList } from '@minimum-viable-web/minimajs/llm';

const items = [
  { id: 1, text: 'First' },
  { id: 2, text: 'Second' }
];

export const List = () =>
  quickList(items, (item) => item.text, { ordered: false, className: 'list' });
```

### `quickModal(isOpen, content, options?)`

Creates an overlay + content container.

```js
import { quickModal } from '@minimum-viable-web/minimajs/llm';
import { div } from '@minimum-viable-web/minimajs/api';

export function ModalDemo({ open, onClose }) {
  return div([
    quickModal(open, div('Hello'), { showClose: true, onClose })
  ]);
}
```

### `quickCard(title, content, actions=[])`

Creates a header/body/actions card layout.

```js
import { quickCard } from '@minimum-viable-web/minimajs/llm';
import { button } from '@minimum-viable-web/minimajs/api';

export const CardDemo = () =>
  quickCard(
    'Account',
    'Settings go here.',
    [button({ onClick: () => console.log('save') }, 'Save')]
  );
```

### `quickTable(data, columns)`

Creates a `<table>` with headers and rows.

```js
import { quickTable } from '@minimum-viable-web/minimajs/llm';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

export const UserTable = () =>
  quickTable(users, [
    { key: 'name', header: 'Name' }
  ]);
```

## Fluent chain builders

These build elements using a chainable API and return a VNode when you call `build()`.

### `$div()`, `$button()`, etc.

```js
import { $div, $h3, $button } from '@minimum-viable-web/minimajs/llm';

export const Card = () =>
  $div()
    .class('card')
    .child($h3().text('Title'))
    .child($button().text('OK').onClick(() => console.log('ok')))
    .build();
```

### `$(tagName)`

Use `$()` when you want a builder for a tag that doesn’t have a dedicated `$tag()` helper.

```js
import { $ } from '@minimum-viable-web/minimajs/llm';

export const Custom = () => $('section').class('section').child('Hello').build();
```

## Error recovery helpers

### `safeRender(componentOrVNode, target)`

Renders and tries to self-heal common mistakes (like a missing mount element).

```js
import { safeRender } from '@minimum-viable-web/minimajs/llm';

safeRender(App, 'app'); // if #app is missing, it creates a new <div> and appends to <body>
```

### `safeComponent(componentFn)`

Wraps a component so exceptions show a small error UI instead of crashing the app.

```js
import { safeComponent } from '@minimum-viable-web/minimajs/llm';

const SafeApp = safeComponent(App);
```

### `tryRender(components)`

Tries multiple component factories in order until one renders without throwing.

```js
import { tryRender } from '@minimum-viable-web/minimajs/llm';

export const View = () => tryRender([
  () => Primary(),
  () => Fallback()
]);
```

## Type-guided page builders

These are “builder objects” meant to be easy to discover via IntelliSense.

### `page()` / `builder()`

```js
import { page } from '@minimum-viable-web/minimajs/llm';

export const Layout = () =>
  page()
    .header((nav) => nav.brand('Minima').links([
      '/',
      { href: '#/about', text: 'About' }
    ]))
    .main((main) => main.section('Hello'))
    .footer((f) => f.text('© 2026'))
    .build();
```

### `PageBuilder`, `NavBuilder`, `SectionBuilder`, `FooterBuilder`

```js
import { PageBuilder } from '@minimum-viable-web/minimajs/llm';

export const Layout = () => new PageBuilder().main('Hello').build();
```

## Deep LLM design docs

The longer-form LLM docs remain in `llm/`:

- [`llm/LLM-API.md`](../../llm/LLM-API.md)
- [`llm/LLM-DESIGN.md`](../../llm/LLM-DESIGN.md)

