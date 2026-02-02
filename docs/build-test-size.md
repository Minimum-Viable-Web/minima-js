# Build, Test, Size

All commands run from the repo root.

## Test

```bash
npm test
```

Runs `node test.js`.

## Build (minify to `dist/`)

```bash
npm run build
```

Runs `node build.js`, which minifies these sources:

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

