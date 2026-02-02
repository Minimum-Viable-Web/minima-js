# Component API (`@minimum-viable-web/minimajs/component`)

Exports from `src/minima-component.js`.

## `defineComponent(options)`

`defineComponent()` creates a “component factory” with props validation, lifecycle callbacks, computed caching, and watchers.

```js
import { defineComponent } from '@minimum-viable-web/minimajs/component';
import { div, button, counter } from '@minimum-viable-web/minimajs/api';

export const Counter = defineComponent({
  name: 'Counter',
  setup() {
    const [count, increment] = counter(0);
    return { count, increment };
  },
  render(_props, ctx) {
    return div([
      `Count: ${ctx.count}`,
      button({ onClick: ctx.increment }, '+')
    ]);
  }
});
```

### Key options (subset)

- `props`: required/default validation (warns on missing required)
- `setup(props)`: returns instance context
- `render(props, ctx)`: returns VNode
- lifecycle: `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`
- `computed`: getters with caching
- `watch`: watchers on `setup()` fields

## `withProps(Component, additionalProps)`

Creates a wrapper component that injects extra props.

```js
import { withProps } from '@minimum-viable-web/minimajs/component';

const PrimaryButton = withProps(Button, { className: 'btn btn-primary' });
```

## `compose(...components)`

Composes components left-to-right into a single component.

```js
import { compose } from '@minimum-viable-web/minimajs/component';

const Enhanced = compose(WithAuth, WithLayout, Page);
```

## `Fragment`

Use `Fragment` to return multiple siblings without adding a wrapper element.

```js
import { createElement as h } from '@minimum-viable-web/minimajs/core';
import { Fragment } from '@minimum-viable-web/minimajs/component';

export const View = () =>
  h(Fragment, null,
    h('li', null, 'a'),
    h('li', null, 'b')
  );
```

## `memo(Component, areEqual?)`

Memoizes a component result until props change.

```js
import { memo } from '@minimum-viable-web/minimajs/component';

const MemoUser = memo(User, (prev, next) => prev.id === next.id);
```

