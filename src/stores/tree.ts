import { writable } from 'svelte/store';

import type { FonctionTree, FonctionTreeValue } from '@interfaces';

export default writable<FonctionTree | FonctionTreeValue>();
