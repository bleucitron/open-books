import { get } from '../utils/verbs';
import { makeBudgetEndpoint } from '../utils/budget';

const baseURL = 'https://data.economie.gouv.fr';

export function getBudgets(siren, code, year = 2018) {
  // the code argument might not necessary since siren identitifies the city, supposably
  const endpoint = makeBudgetEndpoint(siren, code, year);

  return get(endpoint, {
    baseURL,
  });
}
