import { get } from './utils/verbs';
import {
  checkCodes,
  makeGetSiretEndpoint,
  makeSearchSiretEndpoint,
} from './utils/siren';

import type { Etablissement } from '../interfaces';

const token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
const baseUrl = 'https://api.insee.fr/entreprises/sirene/V3';

const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
};

const options = {
  headers,
};

export function getSiret(siret: string): Promise<Etablissement> {
  const endpoint = makeGetSiretEndpoint(siret);

  return get(`${baseUrl}/${endpoint}`, options).then(
    ({ etablissement }) => etablissement,
  );
}

export function getSiretsFromInsee(
  text: string,
  code: string,
): Promise<Etablissement[]> {
  const codes = checkCodes(code);
  const endpoint = makeSearchSiretEndpoint(text, codes);

  return get(`${baseUrl}/${endpoint}`, options).then(r => r.etablissements);
}
