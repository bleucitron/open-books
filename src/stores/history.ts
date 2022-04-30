import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { LinkItem } from '@interfaces';

const historyList: string | [] = [];
const { subscribe, set, update } = writable<LinkItem[]>(historyList, () => {
  if (browser) {
    const parsedHistory = JSON.parse(localStorage.getItem('history'));
    if (parsedHistory) {
      set(parsedHistory);
    }
  }
});

const history = {
  subscribe,
  addItem: (newHistoryItem: LinkItem) =>
    update((historyList: LinkItem[]) => [
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

export default history;
