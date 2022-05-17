import { writable } from 'svelte/store';

import type { Type } from '@interfaces';

export const type = writable<Type>();

export const code = writable<string>();
