import { derived } from 'svelte/store';

import { code, budget } from '@stores';
import type { Budget, FonctionTreeValue } from '@interfaces';
import { stepsFromString } from '@utils';

export default derived([budget, code], ([$budget, $code]) => {
  if (!$budget) return null;
  if (!$code) return $budget;

  const steps = stepsFromString($code);

  return steps.reduce<Budget | FonctionTreeValue>(
    (acc, cur) => acc.tree[cur],
    $budget,
  );
});
