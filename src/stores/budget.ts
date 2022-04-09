import { writable, derived } from 'svelte/store';

import type { Budget, Type, FonctionTreeValue } from '@interfaces';
import { stepsFromString, fonctionFromTree } from '@utils';

const budget = writable<Budget>();

export default budget;

export const type = writable<Type>();

export const code = writable<string>();

export const tree = derived([budget, code], ([$budget, $code]) => {
  if (!$budget) return null;
  if (!$code) return $budget;

  const steps = stepsFromString($code);

  return steps.reduce<Budget | FonctionTreeValue>(
    (acc, cur) => acc.tree[cur],
    $budget,
  );
});

export const fonction = derived([code, budget], ([$code, $budget]) => {
  if (!$code || !$budget) {
    return undefined;
  }

  return fonctionFromTree($code, $budget.tree);
});
