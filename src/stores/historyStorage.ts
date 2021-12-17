import { writable } from 'svelte/store';

const history = localStorage.getItem('history');
const parsedHistory = JSON.parse(history);

export const historyStorage = writable<Record<string, HistorySearch>>(
  parsedHistory === null ? [] : parsedHistory,
);

historyStorage.subscribe(value =>
  localStorage.setItem('history', JSON.stringify(value)),
);
