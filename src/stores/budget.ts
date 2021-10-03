import { writable } from 'svelte/store';

import type { Budget } from '@interfaces';

export default writable<Budget>();
