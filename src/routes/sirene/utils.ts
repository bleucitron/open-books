import { SIRENE_TOKEN } from '$env/static/private';

const nbResults = 1000;
const category = '7210';

interface Params {
  codeCommuneEtablissement: string[];
  categorieJuridiqueUniteLegale: string;
}

function buildParamString(paramByKey: Params): string {
  return Object.entries(paramByKey)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const s = value.map(v => `${key}:${v}`).join(' OR ');

        return `(${s})`;
      }

      return `${key}:"${value}"`;
    })
    .join(' AND ');
}

export const baseUrl = 'https://api.insee.fr/entreprises/sirene/V3';

const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${SIRENE_TOKEN}`,
};

export const options = {
  headers,
};

export function makeGetSiretEndpoint(siret: string): string {
  return `siret/${siret}`;
}

export function makeGetSirenEndpoint(siren: string): string {
  return `siren/${siren}`;
}

export function makeGetSiretsEndpoint(sirens: string[]): string {
  const base = 'siret';

  const param = sirens.map(s => `siren:"${s}"`).join(' OR ');

  const number = `nombre=${nbResults}`;

  const query = `q=${param}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function makeSearchSiretEndpoint(codes: string[]): string {
  const base = 'siret';

  const params = buildParamString({
    codeCommuneEtablissement: codes,
    categorieJuridiqueUniteLegale: category,
  });

  const number = `nombre=${nbResults}`;

  const query = `q=${params}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

// Potential endpoints to implement

// export function getSiret(
//   siret: string,
//   altFetch?: Fetch,
// ): Promise<Etablissement> {
//   const endpoint = makeGetSiretEndpoint(siret);

//   return get<SiretFromAPI>(`${baseUrl}/${endpoint}`, {
//     ...options,
//     fetch: altFetch,
//   }).then(r => r.etablissement);
// }

// export function getSiren(siren: string): Promise<UniteLegale> {
//   const endpoint = makeGetSirenEndpoint(siren);

//   return get<SirenFromAPI>(`${baseUrl}/${endpoint}`, options).then(
//     r => r.uniteLegale,
//   );
// }
