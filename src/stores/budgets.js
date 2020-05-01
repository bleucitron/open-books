import { writable, get } from 'svelte/store';

const budgets = writable({});
budgets.get = (siret, year) => {
  let output = get(budgets);

  if (siret) {
    output = output[siret];
    if (year) output = output.get()[year];
  }

  return output;
};

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
    get: year => (year ? get(b)[year] : get(b)),
  };

  budgets.update(s => {
    s[siret] = budget;
    return s;
  });

  return budget;
}

export default budgets;
