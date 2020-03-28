import { get } from '../utils/verbs';
import { makeGetCitiesEndpoint, makeGetCityEndpoint } from '../utils/geo';

const baseURL = 'https://geo.api.gouv.fr/';

export function getCities(text) {
  const endpoint = makeGetCitiesEndpoint(text);

  return get(endpoint, {
    baseURL,
  });
}

export function getCity(code) {
  const endpoint = makeGetCityEndpoint(code);

  return get(endpoint, {
    baseURL,
  });
}
