import { browser } from '$app/environment';
import { getRecords, getNomen } from '@api';
import { makeBudget, makeId, orderRecordsBySiret } from '@utils';
import type { Nomen } from '@utils/nomen';
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
): Promise<Budget | undefined> {
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
          const ns = [...new Set(records.map(record => record.nomen))];

          if (ns.length > 1) {
            console.warn('More than 1 nomen for', siret, year);
          }

          const n = ns?.[0];

          const nomen = await getNomen(year, n, city?.population, fetch).catch(
            () => undefined,
          );

          const b =
            nomen &&
            (await makeBudget(
              {
                info: { city },
                siret,
                year,
                records,
              },
              nomen,
            ));

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
              budgetCache[id] = b;
            }
          }

          return b;
        });
}

export function fillBudgetBySirens(
  sirens: string[] = [],
  years: number[] = [],
  city: City,
): Promise<(Budget | undefined)[]>[] {
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
            .then(async (records: BudgetRecord[]) => {
              const ns = [...new Set(records.map(record => record.nomen))];

              const nomens = await Promise.allSettled(
                ns.map(n => getNomen(year, n, city?.population, fetch)),
              ).then(res =>
                res
                  .filter(r => r.status === 'fulfilled')
                  .map(r => (r as PromiseFulfilledResult<Nomen>).value)
                  .filter(r => r),
              );

              return orderRecordsBySiret(records).map(({ siret, records }) => {
                const norme = records[0]?.nomen;

                const nomen = nomens.find(
                  n => n.exer === year && n.norme === norme,
                );

                const b =
                  nomen &&
                  makeBudget(
                    {
                      info: { city },
                      siret,
                      year,
                      records,
                    },
                    nomen,
                  );
                const id = makeId(siret, year);
                if (browser && !(id in budgetCache)) {
                  budgetCache[id] = b;
                }

                return b;
              });
            }),
        ]).then(budgets => budgets.flat());
  });
}
