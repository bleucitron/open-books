import { get } from './utils/verbs';
import { makeGetSiretEndpoint, makeSearchSiretEndpoint } from './utils/siren';

const token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
const baseURL = 'https://api.insee.fr/entreprises/sirene/V3';

const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
};

const options = {
  baseURL,
  headers,
};

export function getSiret(siret) {
  const endpoint = makeGetSiretEndpoint(siret);

  return get(endpoint, options).then(({ etablissement }) => etablissement);
}

export function getSiretsFromInsee(text, code) {
  const endpoint = makeSearchSiretEndpoint(text, code);

  return get(endpoint, options).then(r => r.etablissements);
}
