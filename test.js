/**
 * MinimaJS Node Test Suite - Zero Dependencies
 */

import { createElement } from './src/minima-core.js';
import { sanitizeText, html } from './src/minima-template.js';
import { renderToString, injectSSRData } from './src/minima-ssr.js';
import { defineComponent, withProps, Fragment, memo } from './src/minima-component.js';
import { runLibModuleTests } from './tests/lib-modules.test.js';

let passed = 0, failed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`✓ ${name}`); }
  catch (e) { failed++; console.log(`✗ ${name}: ${e.message}`); }
};
const eq = (a, b, msg) => { if (a !== b) throw new Error(`${msg}: ${a} !== ${b}`); };
const ok = (v, msg) => { if (!v) throw new Error(msg); };

console.log('\n=== MinimaJS Test Suite ===\n');

// createElement tests
console.log('-- Core: createElement --');
test('creates VNode with type', () => {
  const v = createElement('div');
  eq(v.type, 'div', 'type');
});

test('creates VNode with props', () => {
  const v = createElement('div', { id: 'test', className: 'box' });
  eq(v.props.id, 'test', 'id prop');
  eq(v.props.className, 'box', 'className prop');
});

test('creates VNode with children', () => {
  const v = createElement('div', null, 'Hello', 'World');
  eq(v.props.children.length, 2, 'children count');
  eq(v.props.children[0], 'Hello', 'first child');
});

test('creates VNode with nested children', () => {
  const child = createElement('span', null, 'Nested');
  const v = createElement('div', null, child);
  eq(v.props.children[0].type, 'span', 'nested type');
});

test('flattens nested arrays', () => {
  const v = createElement('ul', null, ['a', 'b'], 'c');
  eq(v.props.children.length, 3, 'flattened');
});

test('preserves key prop', () => {
  const v = createElement('li', { key: 'item-1' }, 'Item');
  eq(v.key, 'item-1', 'key');
});

test('handles null props', () => {
  const v = createElement('div', null, 'text');
  ok(v.props.children, 'has children');
});

test('treats array second arg as children', () => {
  const v = createElement('div', ['a', 'b']);
  eq(v.props.children.length, 2, 'children count');
  eq(v.props.children[0], 'a', 'first child');
});

test('preserves key=0', () => {
  const v = createElement('li', { key: 0 }, 'Item');
  eq(v.key, 0, 'key');
});

// sanitizeText tests
console.log('\n-- Template: sanitizeText --');
test('escapes < and >', () => {
  eq(sanitizeText('<script>'), '&lt;script&gt;', 'angle brackets');
});

test('escapes quotes', () => {
  eq(sanitizeText('"hello"'), '&quot;hello&quot;', 'double quotes');
  ok(sanitizeText("'test'").includes('&#x27;'), 'single quotes');
});

test('escapes forward slash', () => {
  ok(sanitizeText('</div>').includes('&#x2F;'), 'slash');
});

test('handles non-string input', () => {
  eq(sanitizeText(123), '123', 'number');
  eq(sanitizeText(null), 'null', 'null');
});

test('blocks XSS script tags', () => {
  const result = sanitizeText('<script>alert("xss")</script>');
  ok(!result.includes('<script>'), 'no script tag');
});

test('blocks XSS event handlers', () => {
  const result = sanitizeText('<img onerror="alert(1)">');
  ok(!result.includes('<img'), 'escaped');
});

// html template tests
console.log('\n-- Template: html --');
test('embeds VNodes in templates', () => {
  const v = html`<div>${createElement('span', null, 'X')}</div>`;
  eq(v.type, 'div', 'root');
  eq(v.props.children[0].type, 'span', 'child vnode');
});

test('parses void tags without swallowing siblings', () => {
  const v = html`<div><input value="a"><span>b</span></div>`;
  eq(v.props.children[0].type, 'input', 'input first');
  eq(v.props.children[1].type, 'span', 'span second');
});

console.log('\n-- Security --');
test('template: blocks javascript: href', () => {
  const v = html`<a href="javascript:alert(1)">x</a>`;
  ok(!('href' in v.props), 'href dropped');
});

test('template: blocks data: src', () => {
  const v = html`<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">`;
  ok(!('src' in v.props), 'src dropped');
});

test('template: drops inline on* handlers', () => {
  const v = html`<img onerror="alert(1)" src="x">`;
  ok(!('onerror' in v.props) && !('onError' in v.props), 'onerror dropped');
});

test('template: preserves data-* and aria-* attrs', () => {
  const v = html`<div data-x="1" aria-label="y"></div>`;
  eq(v.props['data-x'], '1', 'data-x');
  eq(v.props['aria-label'], 'y', 'aria-label');
});

test('template: preserves whitespace in text nodes', () => {
  const v = html`<div> a  b </div>`;
  eq(v.props.children[0], ' a  b ', 'whitespace');
});

test('ssr: injectSSRData escapes < to prevent script-breakout', () => {
  const page = '<html><body></body></html>';
  const out = injectSSRData(page, { x: '</script><script>alert(1)</script>' });
  ok(!out.includes('</script><script>alert(1)</script>'), 'no raw close/open script');
  ok(out.includes('\\u003c/script'), 'escaped <');
});

// renderToString tests
console.log('\n-- SSR: renderToString --');
test('renders simple element', () => {
  const v = createElement('div', null, 'Hello');
  const html = renderToString(() => v);
  ok(html.includes('<div>'), 'has opening tag');
  ok(html.includes('Hello'), 'has text');
  ok(html.includes('</div>'), 'has closing tag');
});

test('renders with props', () => {
  const v = createElement('div', { id: 'main', className: 'container' }, 'Content');
  const html = renderToString(() => v);
  ok(html.includes('id="main"'), 'has id');
  ok(html.includes('class="container"') || html.includes('className="container"'), 'has class');
});

test('renders nested elements', () => {
  const v = createElement('div', null, 
    createElement('span', null, 'Nested')
  );
  const html = renderToString(() => v);
  ok(html.includes('<span>Nested</span>'), 'nested span');
});

test('renders void elements', () => {
  const v = createElement('img', { src: 'test.png' });
  const html = renderToString(() => v);
  ok(html.includes('<img') && html.includes('/>'), 'self-closing');
});

test('escapes text content', () => {
  const v = createElement('div', null, '<script>bad</script>');
  const html = renderToString(() => v);
  ok(!html.includes('<script>bad</script>'), 'escaped');
});

test('skips event handlers in SSR', () => {
  const v = createElement('button', { onClick: () => {} }, 'Click');
  const html = renderToString(() => v);
  ok(!html.includes('onClick'), 'no onclick');
  ok(!html.includes('function'), 'no function');
});

test('renders component functions', () => {
  const MyComp = (props) => createElement('div', null, props.text);
  const html = renderToString(MyComp, { text: 'Hello' });
  ok(html.includes('Hello'), 'component rendered');
});

test('handles null/undefined children', () => {
  const v = createElement('div', null, null, undefined, 'text');
  const html = renderToString(() => v);
  ok(html.includes('text'), 'has valid text');
});

// injectSSRData tests
console.log('\n-- SSR: injectSSRData --');
test('injects data scripts', () => {
  const html = '<html><body></body></html>';
  const result = injectSSRData(html, { user: { name: 'Test' } });
  ok(result.includes('data-ssr-key="user"'), 'has data key');
  ok(result.includes('"name":"Test"'), 'has data content');
});

test('preserves existing HTML', () => {
  const html = '<html><body><div>Content</div></body></html>';
  const result = injectSSRData(html, { key: 'value' });
  ok(result.includes('<div>Content</div>'), 'content preserved');
});

// Component system tests
console.log('\n-- Component: defineComponent --');
test('creates component function', () => {
  const Comp = defineComponent({
    name: 'Test',
    render() { return createElement('div', null, 'test'); }
  });
  eq(typeof Comp, 'function', 'is function');
});

test('withProps adds default props', () => {
  const Base = (props) => createElement('div', null, props.text);
  const Enhanced = withProps(Base, { text: 'default' });
  eq(typeof Enhanced, 'function', 'returns function');
});

test('Fragment returns children', () => {
  const children = [createElement('span'), createElement('span')];
  const result = Fragment({ children });
  eq(result, children, 'returns children');
});

test('memo returns function', () => {
  const Comp = () => createElement('div');
  const Memoized = memo(Comp);
  eq(typeof Memoized, 'function', 'is function');
});

// Edge cases
console.log('\n-- Edge Cases --');
test('deeply nested VNodes', () => {
  let v = createElement('span', null, 'deep');
  for (let i = 0; i < 10; i++) v = createElement('div', null, v);
  eq(v.type, 'div', 'outer is div');
});

test('large children array', () => {
  const kids = Array.from({ length: 100 }, (_, i) => `item${i}`);
  const v = createElement('ul', null, ...kids);
  eq(v.props.children.length, 100, '100 children');
});

test('special characters in text', () => {
  const text = '<>&"\'/\\`${}';
  const safe = sanitizeText(text);
  ok(!safe.includes('<'), 'no raw <');
  ok(!safe.includes('>'), 'no raw >');
});

test('unicode content', () => {
  const v = createElement('div', null, '你好世界 🌍');
  const html = renderToString(() => v);
  ok(html.includes('你好世界'), 'chinese preserved');
  ok(html.includes('🌍'), 'emoji preserved');
});

test('boolean props', () => {
  const v = createElement('input', { disabled: true, checked: false });
  const html = renderToString(() => v);
  ok(html.includes('disabled'), 'true prop included');
});

test('numeric props', () => {
  const v = createElement('input', { tabIndex: 1, maxLength: 10 });
  const html = renderToString(() => v);
  ok(html.includes('tabIndex="1"') || html.includes('tabindex="1"'), 'numeric prop');
});

// Additional lib module tests (API, LLM, DevTools, Full bundle)
console.log('\n-- Lib Modules: API / LLM / DevTools / Full --');
runLibModuleTests(test, eq, ok);

// Summary
console.log('\n=== Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);
process.exit(failed > 0 ? 1 : 0);

