import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { makeNomenId } from './budget';

const _makeNomenId = suite('makeNomenId');

_makeNomenId('should return string Error if no code provided', () => {
  assert.throws(() => makeNomenId(null, null), /No code provided/);
});
_makeNomenId('should return code and suffix if no population', () => {
  assert.is(makeNomenId('M14', null), 'M14_COM_SUP3500');
});
_makeNomenId('should return code and suffix for big city ', () => {
  assert.is(makeNomenId('M12', 3600), 'M12_COM_SUP3500');
});
_makeNomenId('should return code and suffix for medium city  ', () => {
  assert.is(makeNomenId('G15', 3400), 'G15_COM_500_3500');
});
_makeNomenId('should return code and suffix for little city  ', () => {
  assert.is(makeNomenId('Y21', 400), 'Y21_COM_INF500');
});

_makeNomenId.run();
