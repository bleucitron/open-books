import { writable } from 'svelte/store';
import { Map } from 'immutable';

const entries = writable(new Map());

export default entries;

export function saveRecords(siret, year, records) {
  entries.update(state => state.setIn([siret, year], records));
  // console.log('ENTRIES', $entries.toJS());
}
