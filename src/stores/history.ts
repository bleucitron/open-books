import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { LinkItem } from '@interfaces';

const { subscribe, set, update } = writable<LinkItem[]>([], () => {
  if (browser) {
    const parsedHistory = JSON.parse(localStorage.getItem('history'));
    if (parsedHistory) {
      set(parsedHistory);
    }
  }
});

const history = {
  subscribe,
  addItem: (newItem: LinkItem) =>
    update((historyList: LinkItem[]) => [
      newItem,
      ...historyList.filter(item => item.name !== newItem.name),
    ]),
  clear: () => {
    set([]);
  },
};

history.subscribe(value => {
  if (browser) localStorage.setItem('history', JSON.stringify(value));
});

export default history;
