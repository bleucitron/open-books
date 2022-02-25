import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { HistorySearch } from '@interfaces';

const historyList: string | [] = [];
const { subscribe, set, update } = writable<HistorySearch[]>(
  historyList,
  () => {
    if (browser) {
      const parsedHistory = JSON.parse(localStorage.getItem('history'));
      if (parsedHistory) {
        set(parsedHistory);
      }
    }
  },
);

export const history = {
  subscribe,
  addItem: (newHistoryItem: HistorySearch) =>
    update((historyList: HistorySearch[]) => [
      newHistoryItem,
      ...historyList.filter(item => item.name !== newHistoryItem.name),
    ]),
  clear: () => {
    set([]);
  },
};

history.subscribe(value => {
  if (browser) localStorage.setItem('history', JSON.stringify(value));
});
