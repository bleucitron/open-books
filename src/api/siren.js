import { get } from '../utils/verbs';
import {
  makeGetSiretEndpoint,
  makeSearchSiretEndpoint,
  extractSirens,
} from '../utils/siren';

const token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
const baseURL = 'https://api.insee.fr/entreprises/sirene/V3';

const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
};

export function getSiret(siret) {
  const endpoint = makeGetSiretEndpoint(siret);

  return get(endpoint, {
    baseURL,
    headers,
  }).then(({ etablissement }) => etablissement);
}

export function getSirens(text, code) {
  const endpoint = makeSearchSiretEndpoint(text, code);

  return get(endpoint, {
    baseURL,
    headers,
  }).then(extractSirens);
}
