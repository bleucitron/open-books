import { writable, get } from 'svelte/store';

const budgets = writable({});
budgets.get = () => get(budgets);

export function createBudget(siret) {
  const b = writable({});
  const { subscribe, update } = b;

  const budget = {
    subscribe,
    add: (year, budget) =>
      update(s => {
        s[year] = budget;
        return s;
      }),
    get: () => get(b),
  };

  budgets.update(s => {
    s[siret] = budget;
    return s;
  });

  return budget;
}

export default budgets;
