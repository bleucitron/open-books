import { get } from '../utils/verbs';
import { makeGetCitiesEndpoint } from '../utils/geo';

const baseURL = 'https://geo.api.gouv.fr/';

export function getCities(text) {
  const endpoint = makeGetCitiesEndpoint(text);

  return get(endpoint, {
    baseURL,
  });
}
