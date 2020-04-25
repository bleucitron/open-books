import { writable } from 'svelte/store';
import { Map } from 'immutable';

const budgets = writable(new Map());

export default budgets;

export function saveBudget(budget) {
  if (budget) {
    const { siret, year } = budget;
    budgets.update(state => state.setIn([siret, year], budget));
  }

  // console.log('ENTRIES', $budgets.toJS());
  return budget;
}
