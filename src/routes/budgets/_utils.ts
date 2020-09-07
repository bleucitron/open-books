import { normalizeText } from '../../utils';

import type { Budget, BudgetRaw, Record } from '../../interfaces';

const DEFAULT_LABEL = 'commune';

export function displayLabel(label: string): string {
  if (!label) return '';

  return label === DEFAULT_LABEL ? '' : label;
}

export function makeId(siret: string, year: number): string {
  return `${siret}_${year}`;
}

function extractSiren(siret: string): string {
  return siret.substring(0, 9);
}

function extractEtabl(siret: string): string {
  return siret.substring(9);
}

const toRemove = ['-', ' de'];

function formatLabel(label: string, name: string): string {
  const l = normalizeText(label);
  const n = normalizeText(name.toLowerCase());

  if (l === n) return DEFAULT_LABEL;

  let formatted = label.replace(n, '').trim().toLowerCase();

  toRemove.forEach(c => {
    formatted = formatted.replace(new RegExp(`${c}$`), '');
  });

  return formatted;
}

interface RecordsWithSiret {
  siret: string;
  records: Record[];
}

export function orderRecordsBySiret(records: Record[]): RecordsWithSiret[] {
  const sirets = [...new Set(records.map(({ ident }) => ident))];

  return sirets
    .map(siret => {
      const siretRecords = records.filter(({ ident }) => {
        return ident === siret;
      });

      return { siret, records: siretRecords };
    })
    .sort(
      (r1: RecordsWithSiret, r2: RecordsWithSiret) =>
        parseInt(r1.siret) - parseInt(r2.siret),
    );
}

export function makeBudget(data: BudgetRaw): Budget | null {
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
