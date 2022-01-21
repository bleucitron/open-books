import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { FavoritesSearch } from '@interfaces';

const favoriteList: string | [] = [];
const { subscribe, set, update } = writable<FavoritesSearch[]>(
  favoriteList,
  () => {
    if (browser) {
      const parsedHistory = JSON.parse(localStorage.getItem('favory'));
      return parsedHistory || [];
    }
    return [];
  },
);

export const favory = {
  subscribe,
  addItem: (newFavoryItem: FavoritesSearch) =>
    update((favoriteList: FavoritesSearch[]) => [
      newFavoryItem,
      ...favoriteList.filter(item => item.name !== newFavoryItem.name),
    ]),
  clear: () => {
    set([]);
    localStorage.removeItem('favory');
  },
};

favory.subscribe(value => {
  if (browser) localStorage.setItem('favory', JSON.stringify(value));
});
