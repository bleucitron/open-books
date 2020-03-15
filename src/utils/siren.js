const nbResults = 1000;
const category = 7210;

export function makeGetSiretEndpoint(siret) {
  return `/siret/${siret}`;
}

export function makeSearchSiretEndpoint(text, code) {
  const base = '/siret';

  const nameParam = `denominationUniteLegale:"${text}"`;
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
