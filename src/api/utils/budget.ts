import type { BudgetParams } from '@interfaces';

const nbResults = 10000;

const byYear: Record<number, string> = {
  2018: '0',
  2016: '1',
  2015: '2',
  2014: '3',
  2013: '4',
  2012: '5',
  2019: '6',
  2020: '7',
  2017: '-',
};

const base = 'api/records/1.0/search';

function buildParamString(paramByKey: BudgetParams): string {
  return Object.entries(paramByKey)
    .filter(([key]) => key !== 'year')
    .map(([key, value]) => {
      const valueString = Array.isArray(value) ? value.join(' OR ') : value;

      return `${key}:${valueString}`;
    })
    .join('&');
}

export function makeBudgetSimpleEndpoint(params: BudgetParams): string {
  const { year } = params;
  const dataset = `dataset=balances-comptables-des-communes-en-${year}`;

  const paramString = buildParamString(params);
  const query = `q=${paramString}`;

  const rows = `rows=${nbResults}`;

  const allParams = [dataset, query, rows].join('&');

  return `${base}?${allParams}`;
}

export function makeBudgetCroiseEndpoint(params: BudgetParams): string {
  const { year } = params;
  const yearCode = byYear[year];

  if (!yearCode) return;

  const dataset = `balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec${yearCode}`;

  const paramString = buildParamString(params);
  const query = `q=${paramString}`;

  const rows = `rows=${nbResults}`;

  const allParams = [dataset, query, rows].join('&');

  return `${base}?dataset=${allParams}`;
}

export function makeNomenEndpoint(year: number, decl: string): string {
  const extension = 'xml';
  const code = decl.split('_')[0];

  const fileName = `${decl}.${extension}`;

  return [year, code, fileName].join('/');
}
