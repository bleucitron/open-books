import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { FavoriteSearch } from '@interfaces';

const { subscribe, set, update } = writable<FavoriteSearch[]>([], () => {
  if (browser) {
    const parsedFavorites = JSON.parse(localStorage.getItem('favorite'));
    if (parsedFavorites) {
      set(parsedFavorites);
    }
    return parsedFavorites || [];
  }
  return [];
});

export const favorite = {
  subscribe,
  addItem: (newFavoriteItem: FavoriteSearch) =>
    update((favoriteList: FavoriteSearch[]) => [
      newFavoriteItem,
      ...favoriteList.filter(item => item.name !== newFavoriteItem.name),
    ]),
  clear: () => {
    set([]);
    localStorage.removeItem('favorite');
  },
};

favorite.subscribe(value => {
  if (browser) {
    localStorage.setItem('favorite', JSON.stringify(value));
  }
});
