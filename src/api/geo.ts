import type { City } from '@interfaces';
import { randomNb } from '@utils';

import { get } from './utils/verbs';
import {
  getRandomDptCodes,
  makeGetCitiesEndpoint,
  makeGetCityEndpoint,
} from './utils/geo';
import type { Fetch } from '@interfaces';
import { browser } from '$app/env';

const baseUrl = 'https://geo.api.gouv.fr';

export function getRandomCities(
  population: number,
  altFetch?: Fetch,
): Promise<City[]> {
  const codes = getRandomDptCodes();

  return Promise.all(
    codes.map(code =>
      get<City[]>(
        `${baseUrl}/departements/${code}/communes?fields=departement,population`,
        { fetch: altFetch },
      ).then(communes => {
        const bigCities = communes.filter(c => c.population >= population);
        return bigCities[randomNb(bigCities.length)];
      }),
    ),
  );
}

export function getCities(text: string, altFetch?: Fetch): Promise<City[]> {
  const endpoint = makeGetCitiesEndpoint(text);

  return get<City[]>(`${baseUrl}/${endpoint}&limit=5`, { fetch: altFetch });
}

const cityCache = new Map();

export async function getCity(insee: string, altFetch?: Fetch): Promise<City> {
  if (cityCache.has(insee)) {
    return cityCache.get(insee);
  }

  const endpoint = makeGetCityEndpoint(insee);

  const city = await get<City>(`${baseUrl}/${endpoint}`, { fetch: altFetch });
  if (browser) cityCache.set(insee, city);
  return city;
}
