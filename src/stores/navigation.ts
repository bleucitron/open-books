import { derived } from 'svelte/store';
import { navigating } from '$app/stores';
import type { Navigation } from '@sveltejs/kit';

function isNavigating(navigation: Navigation, key: string): boolean {
  const from = navigation?.from.searchParams.get(key);
  const to = navigation?.to.searchParams.get(key);

  return from !== to;
}

export default derived(navigating, $navigating =>
  isNavigating($navigating, 'insee'),
);
