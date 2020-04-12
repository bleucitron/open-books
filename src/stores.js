import { writable } from 'svelte/store';
import { Map } from 'immutable';

export const city = writable();
export const entries = writable(new Map());
