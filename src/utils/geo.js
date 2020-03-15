const fields = ['code', 'nom', 'departement', 'region', 'population'];

export function makeGetCitiesEndpoint(text) {
  const base = '/communes';

  const name = `nom="${text}"`;
  const fieldsString = `fields=${fields.join(',')}`;
  const boost = 'boost=population';

  const allParams = [name, fieldsString, boost].join('&');

  return `${base}?${allParams}`;
}
