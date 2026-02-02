# API Module (`@minimum-viable-web/minimajs/api`)

This module is the “**short syntax**” layer. It re-exports core pieces and adds helpers so you can write UI code with less boilerplate.

Exports come from `src/minima-api.js`.

## Element creation helpers

### `h(...)` (alias of `createElement`)

```js
import { h } from '@minimum-viable-web/minimajs/api';

const view = h('div', { className: 'card' }, 'Hello');
```

### Tag helpers (`div`, `span`, `p`, `button`, …)

These are just pre-bound versions of `h(tagName, ...)`:

```js
import { div, h1, button } from '@minimum-viable-web/minimajs/api';

export function Hero() {
  return div({ className: 'hero' }, [
    h1('Welcome'),
    button({ onClick: () => console.log('clicked') }, 'Start')
  ]);
}
```

Available tag helpers:

- `div`, `span`, `p`, `button`, `input`, `a`, `img`, `form`, `ul`, `li`, `h1`, `h2`, `h3`

## Component helpers

### `defineComponent(options)` / `component(options)`

`component` is just an alias for `defineComponent`.

```js
import { component, div } from '@minimum-viable-web/minimajs/api';

export const Hello = component({
  name: 'Hello',
  render() {
    return div('Hello');
  }
});
```

### `fc(renderFn)`

Creates a function component from a zero-arg render function.

```js
import { fc, div } from '@minimum-viable-web/minimajs/api';

export const Hello = fc(() => div('Hello'));
```

Tip: `fc` does not accept props; if you need props, write `(props) => ...` directly.

### `memo(Component)`

Memoizes a component result with a shallow-props comparison.

```js
import { memo } from '@minimum-viable-web/minimajs/api';

const UserCard = ({ user }) => `User: ${user.name}`;
export const MemoUserCard = memo(UserCard);
```

## Rendering helpers

### `render(componentOrVNode, target)`

```js
import { render } from '@minimum-viable-web/minimajs/api';
render(App, document.getElementById('app'));
```

If `target` is a string, it uses `document.getElementById(target)`.

### `mount(...)` / `app(component, target='app')`

Aliases for `render`.

```js
import { app } from '@minimum-viable-web/minimajs/api';
app(App, 'app');
```

## Template helpers

### `t` (alias of `html`)

```js
import { t } from '@minimum-viable-web/minimajs/api';
const View=({name})=>t`<div>Hello ${name}</div>`;
```

### `css(strings, ...values)`

Tiny helper that joins template literal chunks into a string (useful for inline CSS strings).

```js
import { css } from '@minimum-viable-web/minimajs/api';

const styleText = css`
  .card { padding: 12px; }
  .cardTitle { font-weight: 600; }
`;
```

## Event prop helpers

These return small prop objects you can spread into element props.

### `click(handler)` / `submit(handler)` / `change(handler)` / `inputEvent(handler)`

```js
import { button, click } from '@minimum-viable-web/minimajs/api';

const Save = () => button(
  { ...click(() => console.log('save')) },
  'Save'
);
```

## Common prop helpers

### `style(obj)` / `className(str)` / `id(str)`

MinimaJS sets DOM properties directly. For `style`, the most reliable input is a **CSS string** (it becomes `element.style = "..."` in the current core implementation).

```js
import { div, style, className, id, props } from '@minimum-viable-web/minimajs/api';

export function Box() {
  const base = props(
    id('box'),
    className('box'),
    style('padding: 8px; border: 1px solid #ccc;')
  );
  return div(base, 'Hi');
}
```

### `props(...objects)` / `attr(key, value)`

```js
import { props, attr } from '@minimum-viable-web/minimajs/api';
const p = props({ role: 'button' }, attr('tabIndex', 0));
```

## Control flow helpers

### `when(condition, vnode)` / `unless(condition, vnode)`

```js
import { div, when } from '@minimum-viable-web/minimajs/api';
export const View=({loggedIn})=>div([when(loggedIn, 'Welcome!')]);
```

### `each(items, renderFn)`

```js
import { ul, li, each } from '@minimum-viable-web/minimajs/api';

export function List({ items }) {
  return ul(each(items, (item) => li({ key: item.id }, item.text)));
}
```

## Lifecycle shortcuts

These are convenience wrappers around `useEffect`.

### `onMount(fn)` / `onUpdate(fn, deps)` / `onDestroy(fn)`

```js
import { onMount, onDestroy } from '@minimum-viable-web/minimajs/api';

export function Logger() {
  onMount(() => console.log('mounted'));
  onDestroy(() => console.log('unmounted'));
  return 'ok';
}
```

## State helpers

### `toggle(initial=false)`

```js
import { button, toggle } from '@minimum-viable-web/minimajs/api';

export function Toggle() {
  const [on, flip] = toggle(false);
  return button({ onClick: flip }, on ? 'ON' : 'OFF');
}
```

### `counter(initial=0)`

```js
import { div, button, counter } from '@minimum-viable-web/minimajs/api';

export function Counter() {
  const [count, inc, dec] = counter(0);
  return div([
    div(`Count: ${count}`),
    button({ onClick: dec }, '-'),
    button({ onClick: inc }, '+')
  ]);
}
```

### `inputState(initial='')`

```js
import { div, input, inputState } from '@minimum-viable-web/minimajs/api';

export function NameField() {
  const [name, setName, onInput] = inputState('');
  return div([
    input({ value: name, onInput }),
    div(`Hello ${name}`)
  ]);
}
```

### `formState(initialValues={})`

```js
import { form, input, button, formState } from '@minimum-viable-web/minimajs/api';

export function Login() {
  const [values, update, reset] = formState({ email: '' });

  return form([
    input({ value: values.email, onInput: update('email') }),
    button({ type: 'button', onClick: reset }, 'Reset')
  ]);
}
```

## Animations

### `fade(show, duration=300)` / `slide(show, duration=300)`

These return an object intended for styling transitions. Note: the current core renderer assigns `element.style = value`, so **object-style merging is not implemented**. Today, prefer CSS classes for transitions (or pass a CSS string to `style(...)`).

```js
import { div, fade } from '@minimum-viable-web/minimajs/api';
export const Panel=({open})=>div({ style: fade(open, 200) }, 'Content');
```

Recommended (CSS class toggle):

```js
import { div } from '@minimum-viable-web/minimajs/api';

export const Panel = ({ open }) =>
  div({ className: open ? 'panel panelOpen' : 'panel' }, 'Content');
```

## Routing

### `route(path, vnode)` / `link(to, children, linkProps?)`

This is a tiny hash-based router helper.

```js
import { div, route, link } from '@minimum-viable-web/minimajs/api';

export function App() {
  return div([
    div([link('/','Home'), ' | ', link('/about','About')]),
    route('/', 'Home page'),
    route('/about', 'About page')
  ]);
}
```

## Context helpers

### `context(initialValue)` / `createContext(initialValue)`

Creates a minimal context object with `{ Provider, Consumer, use }`.

```js
import { createElement as h } from '@minimum-viable-web/minimajs/core';
import { createContext } from '@minimum-viable-web/minimajs/api';

const Theme = createContext('light');

const Child = () => h('div', null, `Theme: ${Theme.use()}`);

export function App() {
  return h(Theme.Provider, { value: 'dark' }, h(Child));
}
```

## Error + debug helpers

### `ErrorBoundary(fallback?)`

This listens to global `window` errors and rejections and renders a fallback UI when one happens. (It’s not a wrapper around child content.)

```js
import { ErrorBoundary } from '@minimum-viable-web/minimajs/api';
import { div } from '@minimum-viable-web/minimajs/api';

export function App() {
  return ErrorBoundary((err) => div(`Error: ${err?.message || err}`));
}
```

### `debug(value)` / `log(value, label?)`

```js
import { log } from '@minimum-viable-web/minimajs/api';
log({ a: 1 }, 'state');
```

