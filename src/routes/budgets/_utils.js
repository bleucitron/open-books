import { normalizeText } from '../../utils';

const DEFAULT_LABEL = 'commune';

export function displayLabel(label) {
  if (!label) return '';

  return label === DEFAULT_LABEL ? '' : label;
}

export function makeId(siret, year) {
  return `${siret}_${year}`;
}

function extractSiren(siret) {
  return siret.substring(0, 9);
}

function extractEtabl(siret) {
  return siret.substring(9);
}

const toRemove = ['-', ' de'];

function formatLabel(label, name) {
  const l = normalizeText(label);
  const n = normalizeText(name.toLowerCase());

  if (l === n) return DEFAULT_LABEL;

  let formatted = label.replace(n, '').trim().toLowerCase();

  toRemove.forEach(c => {
    formatted = formatted.replace(new RegExp(`${c}$`), '');
  });

  return formatted;
}

export function orderRecordsBySiret(records) {
  const sirets = [...new Set(records.map(({ ident }) => ident))];

  return sirets
    .map(siret => {
      const siretRecords = records.filter(({ ident }) => {
        return ident === siret;
      });

      return { siret, records: siretRecords };
    })
    .sort((r1, r2) => r1.siret - r2.siret);
}

export function makeBudget(data) {
  const { city, siret, year, records } = data;

  const length = records.length;

  if (length === 0) return null;

  const siren = extractSiren(siret);
  const etabl = extractEtabl(siret);

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
    siren,
    etabl,
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
