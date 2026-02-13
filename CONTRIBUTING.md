# Contributing to MinimaJS

Thank you for your interest in contributing to MinimaJS! We appreciate your help in making this framework better.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Project Structure

```
MinimaJS/
├── lib/                 # Core library modules
│   ├── minima-core.js   # Virtual DOM & hooks
│   ├── minima-api.js    # Shorthand APIs  
│   ├── minima-template.js # HTML templates
│   ├── minima-component.js # Advanced components
│   ├── minima-ssr.js    # Server-side rendering
│   └── minima-llm.js    # LLM-optimized APIs
├── src/                 # Main entry point
│   ├── minima.js        # Framework entry
│   └── minima.d.ts      # TypeScript definitions
├── dist/                # Minified builds
├── examples/            # Examples and tests
├── docs/                # Documentation
└── scripts/             # Build scripts
```

## Development Guidelines

### Code Style

- Use ES6+ features
- Keep functions under 50 lines when possible  
- Use descriptive variable names
- Add JSDoc comments for public APIs
- Follow the existing code style

### Minimalist Philosophy

MinimaJS follows these core principles:

1. **Shortest syntax possible** - Every API should be ultra-concise
2. **Zero dependencies** - No external packages
3. **Small bundle size** - Keep total size under 20KB
4. **LLM-friendly** - APIs should be predictable for AI
5. **Modern features** - Support latest JavaScript features

### Performance Requirements

- Virtual DOM operations must be under 50ms
- Bundle size increases require justification
- Memory usage should remain minimal
- No unnecessary re-renders

## Testing

Run the test suite:

```bash
npm test
```

### Test policy

**New or changed functionality must include automated tests.** When you add a feature, fix a bug that affects behavior, or change public APIs, add or update tests in `scripts/test.js` (or `tests/*.test.js` for module-specific suites). The test run is required to pass before merge; PRs that add functionality without tests may be asked to add them.

```javascript
// In scripts/test.js, add tests that run via npm test
test('my feature does X', () => {
  eq(actual, expected, 'description');
});
```

### Evidence of test policy adherence

Major functionality in the codebase is covered by the automated suite (`npm test`). Examples of features with corresponding tests:

| Area | Tests (in `scripts/test.js` or `tests/`) |
|------|------------------------------------------|
| Core (createElement, VNodes, hooks) | createElement, children, keys, edge cases |
| Template (html, sanitizeText) | sanitizeText escaping, html parsing, void tags |
| Security (XSS, CSP) | javascript:/data: URL blocking, inline handler drop, injectSSRData script breakout |
| MITM protection (loadTemplate, preloadComponent) | loadTemplate rejects http URL |
| SSR (renderToString, hydrate) | renderToString, void elements, escape, injectSSRData |
| Components (defineComponent, memo, Fragment) | defineComponent, withProps, memo, Fragment |

When adding major features, add tests in the same PR so the policy is followed in practice.

## Building

Build minified versions:

```bash
npm run build
```

Check bundle sizes:

```bash
npm run size
```

## Documentation

- Update README.md for new features
- Add JSDoc comments to new functions
- Update TypeScript definitions in src/minima.d.ts
- Add examples for complex features

## Bug Reports

When reporting bugs, please include:

- MinimaJS version
- Browser/Node.js version  
- Minimal code example
- Expected vs actual behavior
- Steps to reproduce

## Feature Requests  

For new features, consider:

- Does it align with the minimalist philosophy?
- Will it increase bundle size significantly?
- Is the API LLM-friendly?
- Can it be implemented without dependencies?

## Pull Request Process

1. **Branch naming**: Use `feature/description` or `fix/description`

2. **Commit messages**: Use conventional commits
   ```
   feat: add new template helper
   fix: resolve state update bug  
   docs: update README examples
   ```

3. **Testing**: Ensure all tests pass. New functionality must include tests (see Test policy above).

4. **Size check**: Verify bundle size impact
   ```bash
   npm run size
   ```

5. **Documentation**: Update relevant docs

6. **Release notes**: When cutting a release, update [CHANGELOG.md](CHANGELOG.md) with a human-readable summary of major changes (not raw git log). Include a *Security / Vulnerabilities* line: list any CVE-assigned run-time vulnerabilities fixed, or state that none were fixed in that release.

7. **Review**: Request review from maintainers

## API Design Guidelines

### For Core APIs (lib/minima-core.js)

- Must be minimal and essential
- No dependencies on other modules
- Maximum performance focus
- Clear separation of concerns

### For Shorthand APIs (lib/minima-api.js)

- Ultra-concise syntax
- Common patterns only
- Build on core APIs
- LLM-friendly patterns

### For LLM APIs (lib/minima-llm.js)

- One-line solutions for common tasks
- Fluent/chain syntax when appropriate  
- Error recovery built-in
- Template builders for UI patterns

## Code Review Criteria

We review for:

- **Functionality**: Does it work correctly?
- **Performance**: Does it meet performance requirements?
- **Size**: Is the size impact justified?
- **Style**: Does it follow project conventions?
- **Documentation**: Are APIs documented?
- **Tests**: Are there adequate tests?
- **LLM-friendliness**: Is it easy for AI to use?

## What We Don't Accept

- Dependencies on external packages
- Features that significantly increase bundle size without proportional value
- APIs that break the minimalist philosophy
- Code without proper testing
- Breaking changes without migration path
- Features that duplicate existing functionality

## Contribution Ideas

Good first contributions:

- Fix typos in documentation
- Add more examples
- Improve error messages  
- Add TypeScript improvements
- Performance optimizations
- Additional LLM helper functions
- Browser compatibility fixes

## Recognition

Contributors are recognized in:

- README.md contributors section
- GitHub contributor graph
- Release notes for significant contributions

## Getting Help

- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Check existing issues before creating new ones

## License

By contributing to MinimaJS, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make MinimaJS better!
