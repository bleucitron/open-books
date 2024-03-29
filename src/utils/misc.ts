import type { UrlData } from '@interfaces';

const DEFAULT_LABEL = 'commune';

export function displayLabel(label?: string): string {
  if (!label) return '';

  return label === DEFAULT_LABEL ? '' : label;
}

export function makeId(siret: string, year: number): string {
  if (!siret) throw Error('Missing siret');
  if (year == null) throw Error('Missing year');
  return `${siret}_${year}`;
}

export function makeBudgetUrl({ insee, siret, sirens, year }: UrlData): string {
  if (!insee || !siret || !sirens || !sirens.length || year == null)
    throw Error('Missing parameter');

  const sirensAsString = sirens.join(',');
  return `/budgets?insee=${insee}&year=${year}&siret=${siret}&sirens=${sirensAsString}`;
}

export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function formatFullValue(value: number): string {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function formatValue(value: number): string {
  return new Intl.NumberFormat('fr').format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    notation: 'compact',
    // maximumSignificantDigits: order,
    currency: 'EUR',
  }).format(value);
}

export function extractSiren(siret: string): string {
  return siret.substring(0, 9);
}

export function extractEtabl(siret: string): string {
  return siret.substring(9);
}

const toRemove = ['-', ' de'];
export function cleanText(s: string): string {
  toRemove.forEach(c => {
    while (s.startsWith(c) || s.endsWith(c)) {
      s = s.replace(new RegExp(`${c}$|^${c}`, 'g'), '');
    }
  });

  return s;
}

export function formatLabel(label: string, name: string = ''): string {
  const l = normalizeText(label);
  const n = normalizeText(name.toLowerCase());

  if (l === n) return l;

  let formatted = label.replace(n, '').trim().toLowerCase();
  formatted = cleanText(formatted);

  return formatted.trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sumBy(list: any[], key: string): number {
  return list.reduce((acc, cur) => acc + cur[key], 0);
}

export function stepsFromString(s: string): string[] {
  if (!s) return [];

  return s.split('').map((char, i, a) => {
    if (i) {
      const previous = a.slice(0, i);
      return previous.join('') + char;
    } else return char;
  });
}

export function randomNb(n: number): number {
  return Math.floor(Math.random() * n);
}
