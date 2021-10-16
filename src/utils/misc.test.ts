import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { displayLabel } from './misc';

const _displayLabel = suite('displayLabel');

_displayLabel('should return empty string when given nothing', () => {
  assert.is(displayLabel(), '');
});

_displayLabel(
  'should return empty string when given the string "commune"',
  () => {
    assert.is(displayLabel('commune'), '');
  },
);

_displayLabel('should return label when given other strings', () => {
  assert.is(displayLabel('coucou'), 'coucou');
});

_displayLabel.run();
