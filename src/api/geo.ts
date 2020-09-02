import { get } from './utils/verbs';
import { makeGetCitiesEndpoint, makeGetCityEndpoint } from './utils/geo';

import type { City } from '../interfaces';

const baseURL = 'https://geo.api.gouv.fr/';

export function getCities(text: string): Promise<City[]> {
  const endpoint = makeGetCitiesEndpoint(text);

  return get(endpoint, {
    baseURL,
  });
}

export function getCity(insee: string): Promise<City> {
  const endpoint = makeGetCityEndpoint(insee);

  return get(endpoint, {
    baseURL,
  });
}
