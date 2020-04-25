import { get } from './utils/verbs';
import { makeGetCitiesEndpoint, makeGetCityEndpoint } from './utils/geo';

const baseURL = 'https://geo.api.gouv.fr/';

export function getCities(text) {
  const endpoint = makeGetCitiesEndpoint(text);

  return get(endpoint, {
    baseURL,
  });
}

export function getCity(insee) {
  const endpoint = makeGetCityEndpoint(insee);

  return get(endpoint, {
    baseURL,
  });
}
