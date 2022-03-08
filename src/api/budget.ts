import { get } from './utils/verbs';
import { makeBudgetCroiseEndpoint, makeNomenEndpoint } from './utils/budget';

import type {
  BudgetRecord,
  BudgetParams,
  BudgetFromAPI,
  Fetch,
} from '@interfaces';
import { buildNomen, nomenByDecl } from '@utils';
import type { Nomen } from '@utils/nomen';

const recordsUrl = 'https://data.economie.gouv.fr';

export function getRecords(
  params: BudgetParams,
  altFetch?: Fetch,
): Promise<BudgetRecord[]> {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get<BudgetFromAPI>(`${recordsUrl}/${endpoint}`, {
    fetch: altFetch,
  }).then(({ records }) => records.map(record => record.fields));
}

const nomenUrl =
  'https://raw.githubusercontent.com/iOiurson/plans-de-compte/main';

export async function getNomen(
  year: number,
  code: string,
  population?: number,
  altFetch?: Fetch,
): Promise<Nomen> {
  const endpoint = makeNomenEndpoint(year, code, population);
  const nomen: Nomen = nomenByDecl.has(endpoint)
    ? nomenByDecl.get(endpoint)
    : await get<string>(`${nomenUrl}/${endpoint}`, { fetch: altFetch })
        .then(buildNomen)
        .catch(() =>
          console.warn(
            `${endpoint} does not contain data to be readed, budget details won't be aggregated`,
          ),
        );

  if (nomen) {
    nomenByDecl.set(nomen.declinaison, nomen);
  }

  return nomen;
}
