import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { FavoriteSearch } from '@interfaces';

const { subscribe, set, update } = writable<FavoriteSearch[]>([], () => {
  if (browser) {
    const parsedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (parsedFavorites) {
      set(parsedFavorites);
    }
  }
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
  },
  removeItem: (name: string) => {
    const favoritesArray = JSON.parse(localStorage.getItem('favorites'));
    const newFavoritesArray = favoritesArray.filter(
      (t: FavoriteSearch) => t.name !== name,
    );
    localStorage.setItem('favorite', JSON.stringify(newFavoritesArray));
  },
  checkItem: (name: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    const isFavorite = favorites.map((favorite: FavoriteSearch) => {
      if (favorite.name === name) {
        return false;
      }
      return true;
    });
    return isFavorite.includes(false);
  },
};

favorite.subscribe(value => {
  if (browser) {
    localStorage.setItem('favorites', JSON.stringify(value));
  }
});
