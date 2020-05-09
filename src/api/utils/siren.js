import { normalizeText } from '../../utils';

const nbResults = 1000;
const category = 7210;

function buildParamString(paramByKey) {
  return Object.entries(paramByKey)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const s = value.map(v => `${key}:${v}`).join(' OR ');

        return `(${s})`;
      }

      return `${key}:${value}`;
    })
    .join(' AND ');
}

const codesByMain = {
  // Codes for Arrondissements
  69123: {
    name: 'Lyon',
    nb: 9,
    base: 69380,
  },
  75056: {
    name: 'Paris',
    nb: 20,
    base: 75100,
  },
  13055: {
    name: 'Marseille',
    nb: 16,
    base: 13200,
  },
};

export function checkCodes(code) {
  if (code in codesByMain) {
    const { nb, base } = codesByMain[code];

    return [code, ...Array(nb).keys()].map(e => base + e + 1);
  }

  return [code];
}

export function makeGetSiretEndpoint(siret) {
  return `/siret/${siret}`;
}

export function makeGetSiretsEndpoint(sirens) {
  const base = '/siret';

  const param = sirens.map(s => `siren:"${s}"`).join(' OR ');

  const number = `nombre=${nbResults}`;

  const query = `q=${param}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function makeSearchSiretEndpoint(text, codes) {
  const base = '/siret';

  const params = buildParamString({
    denominationUniteLegale: normalizeText(text),
    codeCommuneEtablissement: codes,
    categorieJuridiqueUniteLegale: category,
  });

  const number = `nombre=${nbResults}`;

  const query = `q=${params}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function extractSirens(etablissements) {
  return [...new Set(etablissements.map(({ siren }) => siren))];
}
