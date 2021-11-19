const fields = ['code', 'nom', 'departement', 'region', 'population'];

export function makeGetCitiesEndpoint(text: string): string {
  if (!text) {
    throw 'No text provided';
  }

  const base = 'communes';

  const name = `nom="${text}"`;
  const fieldsString = `fields=${fields.join(',')}`;
  const boost = 'boost=population';

  const allParams = [name, fieldsString, boost].join('&');

  return `${base}?${allParams}`;
}

export function makeGetCityEndpoint(code: string): string {
  if (!code) {
    throw 'No code provided';
  }

  const base = 'communes';

  const fieldsString = `fields=${fields.join(',')}`;

  return `${base}/${code}?${fieldsString}`;
}
