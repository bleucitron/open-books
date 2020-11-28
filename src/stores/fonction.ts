import { derived } from 'svelte/store';

import tree from './tree';
import code from './code';
import { fonctionFromTree } from '../utils';

export default derived([code, tree], ([$code, $tree]) => {
  if (!$code || !$tree) {
    return undefined;
  }

  return fonctionFromTree($code, $tree);
});
