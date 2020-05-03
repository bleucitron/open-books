import { normalizeText } from '../../utils';

const DEFAULT_LABEL = 'commune';

export function displayLabel(label) {
  if (!label) return '';

  return label === DEFAULT_LABEL ? '' : label;
}

function formatLabel(label, name) {
  const l = normalizeText(label);
  const n = normalizeText(name.toLowerCase());

  if (l === n) return DEFAULT_LABEL;
  return label.replace(n, '').trim().toLowerCase();
}

export function makeBudget(data) {
  const { city, siret, year, records } = data;

  const length = records.length;

  if (length === 0) return null;

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

  const label = labels.length > 0 ? formatLabel(labels[0], city) : '';
  const nomen = nomens.length > 0 ? nomens[0] : '';

  return {
    siret,
    city,
    year,
    nomen,
    length,
    debit,
    credit,
    label,
    records,
  };
}
