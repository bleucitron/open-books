import { getRecords } from '@api';
import { makeBudget, makeId, orderRecordsBySiret } from '@utils';
import type { Budget, BudgetMap, BudgetRecord } from '@interfaces';

const budgetCache = {} as BudgetMap;

export function fillBudgetBySiret(
  siret: string,
  years: number[],
  name: string,
): Promise<Budget>[] {
  const budgets: Promise<Budget>[] = [];
  years.forEach(currYear => {
    const id = makeId(siret, currYear);

    const p =
      id in budgetCache
        ? Promise.resolve(budgetCache[id])
        : getRecords({
            ident: [siret],
            year: currYear,
          })
            .catch(() => [])
            .then((records: BudgetRecord[]) => {
              const b = makeBudget({
                city: name,
                siret,
                year: currYear,
                records,
              });

              budgetCache[id] = b;

              return b;
            });

    budgets.push(p);
  });
  return budgets;
}

export function fillBudgetBySirens(
  sirens: string[],
  years: number[],
  name: string,
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
              orderRecordsBySiret(records).map(({ siret, records }) => {
                const b = makeBudget({
                  city: name,
                  siret,
                  year,
                  records,
                });
                const id = makeId(siret, year);
                if (!(id in budgetCache)) {
                  budgetCache[id] = b;
                }

                return b;
              }),
            ),
        ]).then(budgets => budgets.flat());
  });
}
