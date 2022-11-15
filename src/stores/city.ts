import { writable } from 'svelte/store';

import type { City } from '@interfaces';

export default writable<City | null>();
