# LLM Docs

MinimaJS includes an LLM-oriented layer (`@minimum-viable-web/minimajs/llm`) that provides high-level helpers for common UI patterns.

- **Template builders**: `quickForm`, `quickList`, `quickModal`, `quickCard`, `quickTable`
- **Fluent chain builders**: `$div()`, `$button()`, `$input()`, etc.
- **App/pattern helpers**: exported as `llmCreateApp` from the main entry (`createApp as llmCreateApp`)

## Start with the API reference

- [LLM API reference](api/llm.md)

## Example

```js
import { quickForm } from '@minimum-viable-web/minimajs/llm';

const form = quickForm({
  fields: ['email', { name: 'password', type: 'password' }],
  showReset: true,
  onSubmit: (values) => console.log(values)
});
```

For extending MinimaJS using an LLM there are detailed design/requirements/testing docs live in the existing `llm/` directory:

- [`llm/LLM-API.md`](../llm/LLM-API.md)
- [`llm/LLM-DESIGN.md`](../llm/LLM-DESIGN.md)
- [`llm/LLM-IMPLEMENTATION.md`](../llm/LLM-IMPLEMENTATION.md)
- [`llm/LLM-OPERATIONS.md`](../llm/LLM-OPERATIONS.md)
- [`llm/LLM-REQUIREMENTS.md`](../llm/LLM-REQUIREMENTS.md)
- [`llm/LLM-TESTING.md`](../llm/LLM-TESTING.md)
- [`llm/LLM-TROUBLESHOOTING.md`](../llm/LLM-TROUBLESHOOTING.md)