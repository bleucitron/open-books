import type { City } from '@interfaces';
import { randomNb } from '@utils';

import { get } from './utils/verbs';
import {
  getRandomDptCodes,
  makeGetCitiesEndpoint,
  makeGetCityEndpoint,
} from './utils/geo';

const baseUrl = 'https://geo.api.gouv.fr';

export function getRandomCities(): Promise<City[]> {
  const codes = getRandomDptCodes();

  return Promise.all(
    codes.map(code =>
      get<City[]>(
        `${baseUrl}/departements/${code}/communes?fields=departement,population`,
      ).then(communes => {
        const bigCities = communes.filter(c => c.population >= 1000);
        return bigCities[randomNb(bigCities.length)];
      }),
    ),
  );
}

export function getCities(text: string): Promise<City[]> {
  const endpoint = makeGetCitiesEndpoint(text);

  return get<City[]>(`${baseUrl}/${endpoint}&limit=5`);
}

export function getCity(insee: string): Promise<City> {
  const endpoint = makeGetCityEndpoint(insee);

  return get<City>(`${baseUrl}/${endpoint}`);
}
