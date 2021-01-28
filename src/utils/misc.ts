import type { UrlData } from '../interfaces';

export function displayLabel(label: string): string {
  if (!label) return '';

  return label === DEFAULT_LABEL ? '' : label;
}

export function makeId(siret: string, year: number): string {
  return `${siret}_${year}`;
}

export function makeBudgetUrl({ name, insee, siret, sirens, year }: UrlData) {
  const sirensAsString = sirens.join(',');

  return `/budgets?name=${name}&insee=${insee}&siret=${siret}&sirens=${sirensAsString}&year=${year}`;
}

export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function formatFullValue(value: number) {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function formatValue(value: number): string {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    // @ts-ignore
    notation: 'compact',
    // maximumSignificantDigits: order,
    currency: 'EUR',
  }).format(value);
}

const DEFAULT_LABEL = 'commune';
const toRemove = ['-', ' de'];

export function extractSiren(siret: string): string {
  return siret.substring(0, 9);
}

export function extractEtabl(siret: string): string {
  return siret.substring(9);
}

export function formatLabel(label: string, name: string): string {
  const l = normalizeText(label);
  const n = normalizeText(name.toLowerCase());

  if (l === n) return DEFAULT_LABEL;

  let formatted = label.replace(n, '').trim().toLowerCase();

  toRemove.forEach(c => {
    formatted = formatted.replace(new RegExp(`${c}$`), '');
  });

  return formatted;
}

export function sumBy(list: object[], key: string) {
  return list.reduce((acc, cur) => acc + cur[key], 0);
}

export function pathFromString(s: string) {
  return s?.split('').map((e, i, a) => (i > 0 ? a[i - 1] + e : e));
}
