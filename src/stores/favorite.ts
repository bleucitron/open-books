import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { Favorite } from '@interfaces';

const favoriteList: string | [] = [];
const { subscribe, update } = writable<Favorite[]>(favoriteList, () => {
  if (browser) {
    const parsedFavorite = JSON.parse(localStorage.getItem('favorite'));
    return parsedFavorite || [];
  }
  return [];
});

export const favorite = {
  subscribe,
  toggleItem: (params: Favorite, isFav: boolean) =>
    update((favoriteList: Favorite[]) => {
      if (params.name) {
        if (isFav) {
          favoriteList[params.insee] = params;
        } else {
          delete favoriteList[params.insee];
        }
      }
      return favoriteList;
    }),
  /*
    [
      newFavoriteItem,
      ...favoriteList.filter(item => item.name !== newFavoriteItem.name),
    ]),*/
};

favorite.subscribe(value => {
  if (browser) localStorage.setItem('favorite', JSON.stringify(value));
});
