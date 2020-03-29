const nbResults = 10000;

const byYear = {
  '2018': '0',
  '2016': '1',
  '2015': '2',
  '2014': '3',
  '2013': '4',
  '2012': '5',
  '2017': '-',
};

export function makeBudgetEndpoint(siren, code, year) {
  const base = '/api/records/1.0/search';

  const dataset = `balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec${byYear[year]}`;

  const c = code.slice(2);
  const sirenParam = `siren:${siren}`;
  const inseeParam = `insee:${c}`;

  const params = [sirenParam, inseeParam].join('&');
  const query = `q=${params}`;

  const rows = `rows=${nbResults}`;

  const allParams = [dataset, query, rows].join('&');

  return `${base}?dataset=${allParams}`;
}
