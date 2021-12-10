import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { makeNomenId } from './budget';

const _makeNomenId = suite('makeNomenId');
const code = 'M14';

_makeNomenId('should return string Error if no code provided', () => {
  assert.throws(() => makeNomenId(null, null), /No code provided/);
});
_makeNomenId('should return code and suffix if no population', () => {
  assert.is(makeNomenId(code, null), 'M14_COM_SUP3500');
});
_makeNomenId('should return code and suffix for big city ', () => {
  assert.is(makeNomenId(code, 3600), 'M14_COM_SUP3500');
});
_makeNomenId('should return code and suffix for medium city  ', () => {
  assert.is(makeNomenId(code, 3400), 'M14_COM_500_3500');
});
_makeNomenId('should return code and suffix for little city  ', () => {
  assert.is(makeNomenId(code, 400), 'M14_COM_INF500');
});

_makeNomenId.run();
