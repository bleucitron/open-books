import { writable } from 'svelte/store';
import { browser } from '$app/env';
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
  addItem: (newFavoriteItem: LinkItem) =>
    update((favoriteList: LinkItem[]) => [
      newFavoriteItem,
      ...favoriteList.filter(item => item.name !== newFavoriteItem.name),
    ]),
  clear: () => {
    set([]);
  },
  removeItem: (name: string) => {
    const favoritesArray = JSON.parse(localStorage.getItem('favorites'));
    const newFavoritesArray = favoritesArray.filter(
      (t: LinkItem) => t.name !== name,
    );
    localStorage.setItem('favorite', JSON.stringify(newFavoritesArray));
  },
  checkItem: (name: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    const isFavorite = favorites.map((favorite: LinkItem) => {
      if (favorite.name === name) {
        return false;
      }
      return true;
    });
    return isFavorite.includes(false);
  },
};

favorites.subscribe(value => {
  if (browser) {
    localStorage.setItem('favorites', JSON.stringify(value));
  }
});

export default favorites;
