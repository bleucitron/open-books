import { writable } from 'svelte/store';

import type { Code } from '../interfaces';

export default writable<Code>(undefined);
