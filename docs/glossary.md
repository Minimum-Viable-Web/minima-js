# Glossary

Quick definitions for common MinimaJS (and UI framework) jargon.

## VNode (Virtual Node)

A **VNode** is a plain JavaScript object that represents a UI element (or a component) before it becomes real DOM.

In MinimaJS core, a VNode looks like:

- `type`: a string tag name (like `'div'`) **or** a component function
- `props`: an object containing attributes/props and `children`
- `key`: an optional stable identifier used for list reconciliation

## Virtual DOM

A way to build UI by creating a **tree of VNodes**, then turning that into real DOM and updating it efficiently over time.

## Diffing / Reconciliation

The process of comparing an “old” VNode tree to a “new” VNode tree and applying the minimum DOM updates needed to match the new tree.

## Render

To “render” means “turn a component/VNode into DOM” (or into HTML on the server).

- **Client render**: updates the browser DOM
- **Server render (SSR)**: produces an HTML string

## Component

A function (or factory) that returns a VNode (or VNodes). Components let you structure UI into reusable pieces.

## Props

Inputs passed to an element or component. For elements, props map to DOM properties/attributes and event handlers. For components, props are the function argument.

## Children

Nested content inside an element/component. In MinimaJS VNodes, children are stored under `props.children`.

## Key

A stable identifier (often `id`) used when rendering lists so the diff algorithm can keep the correct DOM nodes attached to the correct items.

## Hook

A function (like `useState`) that stores per-component-instance state or behavior. Hooks are called during render and are tracked by call order.

## `useState`

A hook for local component state. Returns `[value, setValue]`.

## `useEffect`

A hook for side effects (timers, subscriptions, network requests) and cleanup. Typically runs after render; cleanup runs on unmount (or before effect re-runs).

## SSR (Server-Side Rendering)

Rendering a component/VNode tree into an **HTML string** on the server.

## Hydration

Making server-rendered HTML interactive in the browser (attaching event handlers and/or re-rendering if needed).

## Template literal / Tagged template

The `html\`...\`` API is a **tagged template**: JavaScript calls a function (`html`) with the string segments and interpolated values, and MinimaJS turns it into VNodes.

## XSS (Cross-Site Scripting)

A class of security bugs where untrusted data is interpreted as executable script/HTML. MinimaJS template APIs sanitize interpolated values to reduce this risk.

## CSP (Content Security Policy)

A browser security feature that restricts what scripts/resources can run. “CSP-friendly” usually means avoiding `eval`-style code and unsafe inline script patterns.

## LLM layer

`@minimum-viable-web/minimajs/llm` provides higher-level helpers (forms/modals/tables/builders) designed to be predictable for AI codegen, but useful for humans too.

