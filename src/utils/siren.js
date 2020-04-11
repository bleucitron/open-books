import { normalizeText } from '.';

const nbResults = 1000;
const category = 7210;

export function makeGetSiretEndpoint(siret) {
  return `/siret/${siret}`;
}

export function makeGetSiretsEndpoint(siren) {
  const base = '/siret';

  const param = `siren:"${siren}"`;

  const number = `nombre=${nbResults}`;

  const query = `q=${param}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function makeSearchSiretEndpoint(text, code) {
  const base = '/siret';

  const normalizedText = normalizeText(text);
  const nameParam = `denominationUniteLegale:"${normalizedText}"`;
  const cityParam = `codeCommuneEtablissement:${code}`;
  const typeParam = `categorieJuridiqueUniteLegale:${category}`;

  const number = `nombre=${nbResults}`;

  const params = [nameParam, cityParam, typeParam].join(' AND ');
  const query = `q=${params}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function extractSirens({ etablissements }) {
  return [...new Set(etablissements.map(({ siren }) => siren))];
}
