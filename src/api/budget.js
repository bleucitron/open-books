import { get } from '../utils/verbs';
import { makeBudgetCroiseEndpoint } from '../utils/budget';

const baseURL = 'https://data.economie.gouv.fr';

export function getBudgets(siren, year = 2018) {
  const endpoint = makeBudgetCroiseEndpoint(siren, year);

  return get(endpoint, {
    baseURL,
  });
}
