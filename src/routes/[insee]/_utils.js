import { Set } from 'immutable';

import { makeCSV } from '../../utils';

export function makeLabel(records) {
  const labels = [
    ...new Set(records.map(record => record.lbudg.toLowerCase())),
  ];

  if (labels.length === 0) return '';
  if (labels.length > 1) {
    console.error('More than 1 label for', id);
  }

  const label = labels[0];

  return label;
}

export function makeBudget(siret, year, records) {
  const length = records.length;

  if (length === 0) return undefined;

  const debit = records.reduce((sum, { sd }) => sum + sd, 0);
  const credit = records.reduce((sum, { sc }) => sum + sc, 0);
  const labels = [
    ...new Set(records.map(record => record.lbudg.toLowerCase())),
  ];
  const nomens = [...new Set(records.map(record => record.nomen))];

  if (labels.length > 1) {
    console.log('More than 1 label for', siret, year);
  }
  if (nomens.length > 1) {
    console.log('More than 1 nomen for', siret, year);
  }

  const label = labels.length > 0 ? labels[0] : '';
  const nomen = nomens.length > 0 ? nomens[0] : '';

  // const csv = await makeCSV(records);

  // const blob = new Blob([csv], { type: 'text/csv' });
  // const file = `${siret}_${year}.csv`;
  // const url = URL.createObjectURL(blob);

  return {
    siret,
    year,
    nomen,
    length,
    debit,
    credit,
    label,
    // csv,
    // file,
    // url,
    records,
  };
}
