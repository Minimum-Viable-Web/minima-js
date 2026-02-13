# Build, Test, Size

All commands run from the repo root.

## Test

```bash
npm test
```

Runs `node scripts/test.js`.

**Dynamic analysis and assertions:** The test suite runs with `NODE_ENV=test` and uses Node’s `assert` (via `eq`/`ok`) so many assertions are enabled during testing. This improves fault detection before deployment. Assertions are used only for dynamic analysis (CI and local test runs); production builds do not enable these test-time assertions.

## Static syntax check

```bash
npm run lint:syntax
```

Runs `node --check` on each source entry point to validate parse/syntax without executing. No dependencies. Files checked:

- `src/minima.js`
- `src/minima-core.js`
- `src/minima-template.js`
- `src/minima-ssr.js`
- `src/minima-component.js`
- `src/minima-api.js`
- `src/minima-llm.js`
- `src/minima-devtools.js`
- `src/minima-full.js`

## Build (minify to `dist/`)

```bash
npm run build
```

Runs `node scripts/build.js`, which minifies these sources:

- `src/minima-core.js` → `dist/minima-core.min.js`
- `src/minima-api.js` → `dist/minima-api.min.js`
- `src/minima-component.js` → `dist/minima-component.min.js`
- `src/minima-template.js` → `dist/minima-template.min.js`
- `src/minima-ssr.js` → `dist/minima-ssr.min.js`
- `src/minima-llm.js` → `dist/minima-llm.min.js`
- `src/minima-devtools.js` → `dist/minima-devtools.min.js`
- `src/minima-full.js` → `dist/minima-full.min.js`
- `src/minima.js` → `dist/minima.min.js`

## Bundle sizes

```bash
npm run size
```

Prints the sizes of the files in `dist/`.

