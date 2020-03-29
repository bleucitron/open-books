const nbResults = 10000;

export function makeBudgetEndpoint(siren, code, year) {
  const base = '/api/records/1.0/search';

  const dataset = `dataset=balances-comptables-des-communes-en-${year}`;

  const c = code.slice(2);
  const sirenParam = `siren:${siren}`;
  const inseeParam = `insee:${c}`;

  const params = [sirenParam, inseeParam].join('&');
  const query = `q=${params}`;

  const rows = `rows=${nbResults}`;

  const allParams = [dataset, query, rows].join('&');

  return `${base}?${allParams}`;
}
