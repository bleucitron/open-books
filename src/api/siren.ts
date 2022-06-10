import type {
  Etablissement,
  Fetch,
  SiretFromAPI,
  SiretsFromAPI,
  SirenFromAPI,
  UniteLegale,
} from '@interfaces';

const env = import.meta.env;

import { get } from './utils/verbs';
import {
  checkCodes,
  makeGetSiretEndpoint,
  makeSearchSiretEndpoint,
  makeGetSirenEndpoint,
} from './utils/siren';

const token = env.VITE_SIRENE_TOKEN;
const baseUrl = 'https://api.insee.fr/entreprises/sirene/V3';

const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
};

const options = {
  headers,
};

export function getSiret(
  siret: string,
  altFetch?: Fetch,
): Promise<Etablissement> {
  const endpoint = makeGetSiretEndpoint(siret);

  return get<SiretFromAPI>(`${baseUrl}/${endpoint}`, {
    ...options,
    fetch: altFetch,
  }).then(r => r.etablissement);
}

export function getSiretsFromInsee(
  code: string,
  altFetch?: Fetch,
): Promise<Etablissement[]> {
  const codes = checkCodes(code);
  const endpoint = makeSearchSiretEndpoint(codes);

  return get<SiretsFromAPI>(`${baseUrl}/${endpoint}`, {
    ...options,
    fetch: altFetch,
  })
    .then(r => r.etablissements)
    .catch(e => {
      console.error('Could not fetch sirets', e);
      return null;
    });
}

export function getSiren(siren: string): Promise<UniteLegale> {
  const endpoint = makeGetSirenEndpoint(siren);

  return get<SirenFromAPI>(`${baseUrl}/${endpoint}`, options).then(
    r => r.uniteLegale,
  );
}
