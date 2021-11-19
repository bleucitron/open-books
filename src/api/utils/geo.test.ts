import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { makeGetCitiesEndpoint, makeGetCityEndpoint } from './geo';

const _citiesEndpoint = suite('citiesEndpoint');

_citiesEndpoint(
  'makeGetCitiesEndpoint should return error if no parameters',
  () => {
    assert.throws(() => makeGetCitiesEndpoint(), 'No text provided');
  },
);

_citiesEndpoint(
  'makeGetCityEndpoint should return error if no parameters',
  () => {
    assert.throws(() => makeGetCityEndpoint(), 'No code provided');
  },
);

_citiesEndpoint(
  'makeGetCitiesEndpoint should return all the parameters of the url with name value "Bordeaux"',
  () => {
    assert.is(
      makeGetCitiesEndpoint('Bordeaux'),
      'communes?nom="Bordeaux"&fields=code,nom,departement,region,population&boost=population',
    );
  },
);

_citiesEndpoint(
  'makeGetCityEndpoint should return all the parameters of the url with name value "Bordeaux"',
  () => {
    assert.is(
      makeGetCityEndpoint('Bordeaux'),
      'communes/Bordeaux?fields=code,nom,departement,region,population',
    );
  },
);

_citiesEndpoint.run();
