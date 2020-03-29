import { get } from '../utils/verbs';
import { makeBudgetCroiseEndpoint } from '../utils/budget';

const baseURL = 'https://data.economie.gouv.fr';

export function getBudgets(params) {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get(endpoint, {
    baseURL,
  });
}
