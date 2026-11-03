import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../public/site-assets/f25b73634502d1e2.js', import.meta.url), 'utf8');
const method = source.match(/getParent\(\)\{([^{}]*)\}/);
assert.ok(method, 'The captured renderer must contain the parent-layer lookup');
const getParent = new Function(method[1]);

for (const state of [undefined, null, {}, { layers: undefined }, { layers: null }, { layers: {} }, { layers: [] }]) {
  test(`Parent lookup tolerates unavailable layers: ${JSON.stringify(state)}`, () => {
    assert.equal(getParent.call({ state: () => state, parentLayer: 'effect' }), undefined);
  });
}

test('Parent lookup preserves matching and ignores unrelated layers', () => {
  const parent = { effects: ['effect'] };
  const state = { layers: [{}, { effects: [] }, { effects: ['other'] }, parent] };
  assert.equal(getParent.call({ state: () => state, parentLayer: 'effect' }), parent);
  assert.equal(getParent.call({ state: () => state, parentLayer: 'missing' }), undefined);
});

test('Parent lookup recovers when the scene registers and survives teardown', () => {
  let state = {};
  const effect = { state: () => state, parentLayer: 'effect' };
  assert.equal(getParent.call(effect), undefined);
  const parent = { effects: ['effect'] };
  state = { layers: [parent] };
  assert.equal(getParent.call(effect), parent);
  state = undefined;
  assert.equal(getParent.call(effect), undefined);
});
