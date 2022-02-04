import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { displayLabel } from './misc';
import { makeId } from './misc';
import { makeBudgetUrl } from './misc';
import { normalizeText } from './misc';
import { extractSiren } from './misc';
import { extractEtabl } from './misc';

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

const _makeId = suite('makeId');

_makeId('should return id when given siret and year', () => {
  assert.is(makeId('98373', 2018), '98373_2018');
});

_makeId('should return error when siret is missing', () => {
  assert.throws(() => makeId('98373', null), /Missing siret/);
});

_makeId('should return error when year is missing', () => {
  assert.throws(() => makeId(null, 2019), /Missing year/);
});

_makeId.run();

const _makeBudgetUrl = suite('makeBudgetUrl');

_makeBudgetUrl('should return url', () => {
  assert.is(
    makeBudgetUrl({
      name: 'a',
      insee: 'b',
      siret: 'c',
      sirens: ['d', 'e', 'f'],
      year: 2020,
    }),
    '/budgets?name=a&insee=b&siret=c&sirens=d,e,f&year=2020',
  );
});

_makeBudgetUrl('should return error when a parameter is empty', () => {
  assert.throws(
    () =>
      makeBudgetUrl({
        name: '',
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
        name: 'a',
        insee: 'b',
        siret: 'c',
        sirens: [],
        year: 2020,
      }),
    /Missing parameter/,
  );
});

_makeBudgetUrl.run();

const _normalizeText = suite('normalizeText');

_normalizeText('should return text without accents', () => {
  assert.is(normalizeText('échapé'), 'echape');
});

_normalizeText.run();

const _extractSiren = suite('exetractSiren');

_extractSiren('should return siren', () => {
  assert.is(extractSiren('124'), '124');
});

_extractSiren.run();
const _extractEtabl = suite('exetractEtabl');

_extractEtabl('should return etabl', () => {
  assert.is(extractEtabl('9'), '');
});

_extractEtabl.run();
