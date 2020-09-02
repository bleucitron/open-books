import { get } from './utils/verbs';
import { makeBudgetCroiseEndpoint } from './utils/budget';

import type { Record, BudgetParams } from '../interfaces';

const baseURL = 'https://data.economie.gouv.fr';

export function getRecords(params: BudgetParams): Promise<Record[]> {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get(endpoint, {
    baseURL,
  }).then(({ records }) => records.map(record => record.fields));
}
