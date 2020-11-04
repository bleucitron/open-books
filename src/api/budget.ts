import { get } from './utils/verbs';
import { makeBudgetCroiseEndpoint, makeNomenEndpoint } from './utils/budget';

import type { Record, BudgetParams } from '../interfaces';

const recordsUrl = 'https://data.economie.gouv.fr';

export function getRecords(params: BudgetParams): Promise<Record[]> {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get(endpoint, {
    baseURL: recordsUrl,
  }).then(({ records }) => records.map(record => record.fields));
}

const nomenUrl =
  'https://raw.githubusercontent.com/iOiurson/plans-de-compte/main/';

export function getNomen(year: number, code: string, population?: number) {
  const endpoint = makeNomenEndpoint(year, code, population);

  return get(endpoint, {
    baseURL: nomenUrl,
  });
}
