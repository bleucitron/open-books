import { derived } from 'svelte/store';

import budget from './budget';
import code from './code';
import { fonctionFromTree } from '@utils';

export default derived([code, budget], ([$code, $budget]) => {
  if (!$code || !$budget) {
    return undefined;
  }

  return fonctionFromTree($code, $budget.tree);
});
