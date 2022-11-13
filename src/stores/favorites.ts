import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { LinkItem } from '@interfaces';

const { subscribe, set, update } = writable<LinkItem[]>([], () => {
  if (browser) {
    const parsedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (parsedFavorites) {
      set(parsedFavorites);
    }
  }
});

const favorites = {
  subscribe,
  addItem: (newItem: LinkItem) =>
    update((items: LinkItem[]) => [
      newItem,
      ...items.filter(item => item.name !== newItem.name),
    ]),
  clear: () => {
    set([]);
  },
  removeItem: (name: string) =>
    update((items: LinkItem[]) =>
      items.filter((t: LinkItem) => t.name !== name),
    ),
};

favorites.subscribe(value => {
  if (browser) {
    localStorage.setItem('favorites', JSON.stringify(value));
  }
});

export default favorites;
