import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { HistorySearch } from '@interfaces';

const historyList: string | [] = [];
const { subscribe, set, update } = writable<HistorySearch[]>(
  historyList,
  () => {
    if (browser) {
      const parsedHistory = JSON.parse(localStorage.getItem('history'));
      return parsedHistory === null ? [] : parsedHistory;
    }
    return [];
  },
);

export const history = {
  subscribe,
  addItem: (newHistoryItem: HistorySearch) => {
    update((historyList: HistorySearch[]) => {
      return [
        newHistoryItem,
        ...historyList.filter(item => {
          return item.name !== newHistoryItem.name;
        }),
      ];
    });
  },
  clear: () => {
    set([]);
    localStorage.removeItem('history');
  },
};

history.subscribe(value => {
  if (browser) localStorage.setItem('history', JSON.stringify(value));
});
