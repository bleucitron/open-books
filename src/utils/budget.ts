import { json2csvAsync as toCSV } from 'json-2-csv';

import { extractSiren, extractEtabl, formatLabel } from './misc';
import type {
  CSV,
  Budget,
  BudgetRaw,
  Record,
  RecordsWithSiret,
} from '../interfaces';

const keys = [
  'EXER',
  'IDENT',
  'NDEPT',
  'LBUDG',
  'INSEE',
  'CBUDG',
  'CTYPE',
  'CSTYP',
  'NOMEN',
  'SIREN',
  'CREGI',
  'CACTI',
  'SECTEUR',
  'FINESS',
  'CODBUD1',
  'CATEG',
  'BAL',
  'FONCTION',
  'COMPTE',
  'BEDEB',
  'BECRE',
  'OBNETDEB',
  'OBNETCRE',
  'ONBDEB',
  'ONBCRE',
  'OOBDEB',
  'OOBCRE',
  'SD',
  'SC',
].map(t => t.toLowerCase());

export async function makeCSV(data: Budget): Promise<CSV> {
  const { city, label, records } = data;

  const years = [...new Set(records.map(d => d.exer))];
  const year = years.length === 1 ? years[0] : null;
  const sirets = [...new Set(records.map(d => d.ident))];
  const siret = sirets.length === 1 ? sirets[0] : null;

  let file = `budget_${city.toLowerCase()}`;

  if (label) file += `_${label.split(' ').join('_')}`;
  if (siret) file += `_${siret}`;
  if (year) file += `_${year}`;

  file += '.csv';

  const csv = await toCSV(records, { keys });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  return {
    file,
    url,
  };
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

export function extractFonctions(e: Element) {
  if (e.tagName !== 'RefFonc' && e.tagName !== 'RefFonctionnelles')
    throw `${e.tagName} Not a <RefFonc> or a <RefFonctionnelle>`;

  const data = [...e.children].map(element => {
    const code = element.getAttribute('Code');
    const label = element.getAttribute('Libelle');
    const short = element.getAttribute('Lib_court');

    return [
      code,
      { code, label, short, subFunctions: extractFonctions(element) },
    ];
  });

  return Object.fromEntries(data);
}

export function makeFonctionTree(txt: string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(txt, 'application/xml');

  const refFonc = doc.querySelector('RefFonctionnelles');

  if (!refFonc) throw 'No <RefFonctionnelles> found';

  return extractFonctions(refFonc);
}
