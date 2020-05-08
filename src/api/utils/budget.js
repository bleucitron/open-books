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

const base = '/api/records/1.0/search';

function buildParamString(paramByKey) {
  return Object.entries(paramByKey)
    .map(([key, value]) => {
      const valueString = Array.isArray(value) ? value.join(' OR ') : value;

      return `${key}:${valueString}`;
    })
    .join('&');
}

export function makeBudgetSimpleEndpoint({ year, ...rest }) {
  const dataset = `dataset=balances-comptables-des-communes-en-${year}`;

  const params = buildParamString(rest);
  const query = `q=${params}`;

  const rows = `rows=${nbResults}`;

  const allParams = [dataset, query, rows].join('&');

  return `${base}?${allParams}`;
}

export function makeBudgetCroiseEndpoint({ year, ...rest }) {
  const dataset = `balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec${byYear[year]}`;

  const params = buildParamString(rest);
  const query = `q=${params}`;

  const rows = `rows=${nbResults}`;

  const allParams = [dataset, query, rows].join('&');

  return `${base}?dataset=${allParams}`;
}
