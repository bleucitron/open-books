import { json2csvAsync as toCSV } from 'json-2-csv';

import { extractSiren, extractEtabl, formatLabel, sumBy } from './misc';
import type {
  CSV,
  Budget,
  BudgetRaw,
  Record,
  RecordsWithSiret,
  FonctionTree,
  FonctionTreeValue,
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

  // const debit = sumBy(records, 'sd');
  // const credit = sumBy(records, 'sc');
  const debit = sumBy(records, BudgetCode.OBNETDEB);
  const credit = sumBy(records, BudgetCode.OBNETCRE);
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
    const code = element.getAttribute('Code') as string;
    const label = element.getAttribute('Libelle') as string;
    const short = element.getAttribute('Lib_court') as string;

    const value: FonctionTreeValue = {
      code,
      label,
    };

    if (label !== short) {
      value.short = short;
    }

    if (element.children.length > 0) value.subTree = extractFonctions(element);

    return [code, value];
  });

  if (data.length === 0) return null;

  return Object.fromEntries(data);
}

export function makeFonctionTree(txt: string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(txt, 'application/xml');

  const refFonc = doc.querySelector('RefFonctionnelles');

  if (!refFonc) throw 'No <RefFonctionnelles> found';

  return extractFonctions(refFonc);
}

export enum BudgetCode {
  OBNETDEB = 'obnetdeb',
  OBNETCRE = 'obnetcre',
  OOBDEB = 'oobdeb',
  OOBCRE = 'oobcre',
}

export enum BudgetType {
  DEBIT = 'obnetdeb',
  CREDIT = 'obnetcre',
}

export function fonctionFromTree(
  code: string,
  tree: FonctionTree | FonctionTreeValue,
) {
  if (!(code in tree)) return fonctionFromTree(code, tree[code[0]].subTree);

  return tree[code];
}

export function aggregateData(records: Record[], tree: FonctionTree) {
  const aggregate = Object.values(tree).map(fonction => {
    let { code, subTree } = fonction;

    let obnetdeb;
    let obnetcre;
    let oobdeb;
    let oobcre;
    let subAgg;
    const filteredRecords = records.filter(r => r.fonction?.startsWith(code));

    if (!subTree) {
      obnetdeb = sumBy(filteredRecords, BudgetCode.OBNETDEB);
      obnetcre = sumBy(filteredRecords, BudgetCode.OBNETCRE);
      oobdeb = sumBy(filteredRecords, BudgetCode.OOBDEB);
      oobcre = sumBy(filteredRecords, BudgetCode.OOBCRE);
    } else {
      subAgg = aggregateData(filteredRecords, subTree);
      const values = Object.values(subAgg) as FonctionTreeValue[];
      obnetdeb = sumBy(values, BudgetCode.OBNETDEB);
      obnetcre = sumBy(values, BudgetCode.OBNETCRE);
      oobdeb = sumBy(values, BudgetCode.OOBDEB);
      oobcre = sumBy(values, BudgetCode.OOBCRE);
    }

    return [
      code,
      {
        ...fonction,
        obnetdeb,
        obnetcre,
        oobdeb,
        oobcre,
        subTree: subAgg,
      },
    ];
  });

  return Object.fromEntries(aggregate);
}
