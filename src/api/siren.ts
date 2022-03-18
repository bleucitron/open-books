import type {
  Etablissement,
  Fetch,
  SiretFromAPI,
  SiretsFromAPI,
  SirenFromAPI,
  uniteLegale,
} from '@interfaces';

import { get } from './utils/verbs';
import {
  checkCodes,
  makeGetSiretEndpoint,
  makeSearchSiretEndpoint,
  makeGetSirenEndpoint,
} from './utils/siren';

const token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
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
  text: string,
  code: string,
  altFetch?: Fetch,
): Promise<Etablissement[]> {
  const codes = checkCodes(code);
  const endpoint = makeSearchSiretEndpoint(text, codes);

  return get<SiretsFromAPI>(`${baseUrl}/${endpoint}`, {
    ...options,
    fetch: altFetch,
  }).then(r => r.etablissements);
}

export function getSiren(siren: string): Promise<uniteLegale> {
  const endpoint = makeGetSirenEndpoint(siren);

  return get<SirenFromAPI>(`${baseUrl}/${endpoint}`, options)
    .then(r => {
      console.log('SIREN from api', r);
      return r.uniteLegale;
    })
    .catch(e => console.log('E', e));
}
