import { get } from './utils/verbs';
import { makeBudgetCroiseEndpoint, makeNomenEndpoint } from './utils/budget';

import type { BudgetRecord, BudgetParams, BudgetFromAPI } from '@interfaces';

const recordsUrl = 'https://data.economie.gouv.fr';

export function getRecords(params: BudgetParams): Promise<BudgetRecord[]> {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get<BudgetFromAPI>(`${recordsUrl}/${endpoint}`).then(({ records }) =>
    records.map(record => record.fields),
  );
}

const nomenUrl =
  'https://raw.githubusercontent.com/iOiurson/plans-de-compte/main';

export function getNomen(
  year: number,
  code: string,
  population?: number,
): Promise<string> {
  const endpoint = makeNomenEndpoint(year, code, population);

  return get<string>(`${nomenUrl}/${endpoint}`);
}
