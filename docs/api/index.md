# API Reference

This section documents the public APIs exported by each MinimaJS module, with **readable** examples and short explanations.

## Modules

- [Core](core.md) (`@minimum-viable-web/minimajs/core`)
- [API (short helpers)](api.md) (`@minimum-viable-web/minimajs/api`)
- [Template](template.md) (`@minimum-viable-web/minimajs/template`)
- [Component](component.md) (`@minimum-viable-web/minimajs/component`)
- [SSR](ssr.md) (`@minimum-viable-web/minimajs/ssr`)
- [LLM](llm.md) (`@minimum-viable-web/minimajs/llm`)
- [DevTools](devtools.md) (`@minimum-viable-web/minimajs/devtools`)

## Which one should I import?

- If you want **one import that exposes everything**, use `@minimum-viable-web/minimajs`.
- If you want **short DOM helpers** like `div(...)`, use `@minimum-viable-web/minimajs/api`.
- If you want **template literals** (`html\`...\``), use `@minimum-viable-web/minimajs/template`.
- If you want **tree-shaking**, import the specific module you need (`/core`, `/template`, etc).

