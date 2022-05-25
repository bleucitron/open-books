import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { displayLabel, makeId, makeBudgetUrl, normalizeText } from './misc';

const _displayLabel = suite('displayLabel');
const _makeId = suite('makeId');
const _makeBudgetUrl = suite('makeBudgetUrl');
const _normalizeText = suite('normalizeText');

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

_makeId('should return id when given siret and year', () => {
  assert.is(makeId('98373', 2018), '98373_2018');
});

_makeId('should return error when year is missing', () => {
  assert.throws(() => makeId('98373', null), /Missing year/);
});

_makeId('should return error when siret is missing', () => {
  assert.throws(() => makeId(null, 2019), /Missing siret/);
});

_makeBudgetUrl('should return url', () => {
  assert.is(
    makeBudgetUrl({
      insee: 'b',
      siret: 'c',
      sirens: ['d', 'e', 'f'],
      year: 2020,
    }),
    '/budgets?insee=b&siret=c&sirens=d,e,f&year=2020',
  );
});

_makeBudgetUrl('should return error when a parameter is empty', () => {
  assert.throws(
    () =>
      makeBudgetUrl({
        insee: 'b',
        siret: 'c',
        sirens: ['d', 'e', 'f'],
        year: 2020,
      }),
    /Missing parameter/,
  );
});

_makeBudgetUrl('should return error when empty sirens', () => {
  assert.throws(
    () =>
      makeBudgetUrl({
        insee: 'b',
        siret: 'c',
        sirens: [],
        year: 2020,
      }),
    /Missing parameter/,
  );
});

_normalizeText('should return text without accents', () => {
  assert.is(normalizeText('échapé'), 'echape');
});

_displayLabel.run();
_makeId.run();
_makeBudgetUrl.run();
_normalizeText.run();
