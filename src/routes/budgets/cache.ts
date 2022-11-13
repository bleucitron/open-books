import { browser } from '$app/environment';
import { getRecords } from '@api';
import { makeBudget, makeId, orderRecordsBySiret } from '@utils';
import type { Budget, BudgetMap, BudgetRecord, City, Fetch } from '@interfaces';

const budgetCache = {} as BudgetMap;

/**
 * Budget cache:
 * - only filled client-side
 * - not filled for non empty budgets fetched by fillBudget
 * - mainly filled with fillBudgetBySirens
 *
 * If fillBudget were to fill the cache for non empty fetches,
 * the way fillBudgetBySirens works would result in skipping sirets fetches.
 */

export function fillBudget(
  siret: string,
  year: number,
  city: City,
  fetch?: Fetch,
): Promise<Budget> {
  const id = makeId(siret, year);

  return id in budgetCache
    ? Promise.resolve(budgetCache[id])
    : getRecords(
        {
          ident: [siret],
          year,
        },
        fetch,
      )
        .catch(() => [])
        .then(async (records: BudgetRecord[]) => {
          const b = await makeBudget(
            {
              info: { city },
              siret,
              year,
              records,
            },
            fetch,
          );

          if (browser) {
            /**
             * To avoid refetching budgets with no records,
             * we first check if the siret is present in the cache for another year,
             * meaning fillBudgetBySirens has already done its job, and won't skip sirets
             */
            const hasSiret = Object.keys(budgetCache).find(k =>
              k.startsWith(siret),
            );

            if (hasSiret && !(id in budgetCache)) {
              if (!(id in budgetCache)) {
                budgetCache[id] = b;
              }
            }
          }

          return b;
        });
}

export function fillBudgetBySirens(
  sirens: string[] = [],
  years: number[] = [],
  city: City,
): Promise<Budget[]>[] {
  const sirensToFetch: string[] = [];
  let siretsInCache: string[] = [];

  sirens.forEach(siren => {
    const sirets = Object.keys(budgetCache).filter(s => s.startsWith(siren));

    if (sirets.length) {
      siretsInCache = [...siretsInCache, ...sirets];
    } else {
      sirensToFetch.push(siren);
    }
  });

  const needToFetch = sirensToFetch.length > 0;

  return [...years].reverse().map(year => {
    const cached = siretsInCache.map(id => budgetCache[id]).filter(b => b);

    return !needToFetch
      ? Promise.resolve(cached)
      : Promise.all([
          Promise.resolve(cached),
          getRecords({ siren: sirensToFetch, year })
            .catch(() => [])
            .then((records: BudgetRecord[]) =>
              Promise.all(
                orderRecordsBySiret(records).map(async ({ siret, records }) => {
                  const b = await makeBudget({
                    info: { city },
                    siret,
                    year,
                    records,
                  });
                  const id = makeId(siret, year);
                  if (browser && !(id in budgetCache)) {
                    budgetCache[id] = b;
                  }

                  return b;
                }),
              ),
            ),
        ]).then(budgets => budgets.flat());
  });
}
