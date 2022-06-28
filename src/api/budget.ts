import { browser } from '$app/env';
import { get } from './utils/verbs';
import { makeBudgetCroiseEndpoint, makeNomenEndpoint } from './utils/budget';

import type {
  BudgetRecord,
  BudgetParams,
  BudgetFromAPI,
  Fetch,
} from '@interfaces';
import { buildNomen, makeM14Decl, nomenById } from '@utils';
import type { Nomen } from '@utils/nomen';

const recordsUrl = 'https://data.economie.gouv.fr';

export function getRecords(
  params: BudgetParams,
  altFetch?: Fetch,
): Promise<BudgetRecord[]> {
  const endpoint = makeBudgetCroiseEndpoint(params);

  if (!endpoint) return Promise.resolve([]);

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
  const decl = code === 'M14' ? makeM14Decl(code, population) : code;
  const endpoint = makeNomenEndpoint(year, decl);
  const id = `${year}_${decl}`;

  const nomen: Nomen = nomenById.has(id)
    ? nomenById.get(id)
    : await get<string>(`${nomenUrl}/${endpoint}`, { fetch: altFetch })
        .then(buildNomen)
        .catch(() => {
          console.warn(
            `${endpoint} does not contain data to be readed, budget details won't be aggregated`,
          );
        });

  if (browser && nomen) {
    nomenById.set(id, nomen);
  }

  return nomen;
}
