import json2csv from 'json-2-csv';
import { makeId } from '@utils';

import type {
  CSV,
  Budget,
  BudgetRaw,
  BudgetRecord,
  RecordsWithSiret,
  FonctionTree,
  FonctionTreeValue,
} from '@interfaces';

import { extractSiren, extractEtabl, formatLabel, sumBy } from './misc';
import { getNomen } from '@api';

const { json2csvAsync: toCSV } = json2csv;

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

export async function makeBudget(data: BudgetRaw): Promise<Budget> {
  const { city, siret, year, records } = data;

  const id = makeId(siret, year);

  const length = records.length;

  if (length === 0) return null;

  const siren = extractSiren(siret);
  const etabl = extractEtabl(siret);

  // const debit = sumBy(records, 'sd');
  // const credit = sumBy(records, 'sc');
  const obnetdeb = sumBy(records, BudgetCode.OBNETDEB);
  const obnetcre = sumBy(records, BudgetCode.OBNETCRE);
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

  const label = labels.length > 0 ? formatLabel(labels[0], city?.nom) : '';
  const nomen = nomens.length > 0 ? nomens[0] : '';

  const nomenFilled = await getNomen(year, nomen, city?.population);
  const tree = aggregateData(records, nomenFilled?.tree);

  return {
    id,
    siret,
    siren,
    etabl,
    city: city?.nom,
    year,
    nomen,
    length,
    obnetdeb,
    obnetcre,
    label,
    records,
    tree,
  };
}

export function orderRecordsBySiret(
  records: BudgetRecord[],
): RecordsWithSiret[] {
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

export function extractFonctions(e: Element): FonctionTree {
  if (e.tagName !== 'RefFonc' && e.tagName !== 'RefFonctionnelles')
    throw `${e.tagName} Not a <RefFonc> or a <RefFonctionnelle>`;

  const data = [...e.children].map(element => {
    const code = element.getAttribute('Code') as string;
    const label = element.getAttribute('Libelle') as string;
    const short = element.getAttribute('Lib_court') as string;

    const value: Partial<FonctionTreeValue> = {
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

export function makeFonctionTree(txt: string): FonctionTree {
  const parser = new DOMParser();
  const doc = parser.parseFromString(txt, 'application/xml');

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

export const typeToLabel = {
  [BudgetType.DEBIT]: 'Dépenses',
  [BudgetType.CREDIT]: 'Recettes',
};

export function fonctionFromTree(
  code: string,
  tree: FonctionTree,
): FonctionTreeValue {
  if (!(code in tree)) {
    return fonctionFromTree(code, tree[code[0]].subTree);
  }

  return tree[code] as FonctionTreeValue;
}

export function aggregateData(
  records: BudgetRecord[],
  tree: FonctionTree,
): FonctionTree {
  const aggregate = Object.values(tree).map(fonction => {
    const { code, subTree } = fonction;

    let obnetdeb;
    let obnetcre;
    let oobdeb;
    let oobcre;

    const output: FonctionTreeValue = { ...fonction };

    const filteredRecords = records.filter(r => r.fonction?.startsWith(code));

    if (!subTree) {
      obnetdeb = sumBy(filteredRecords, BudgetCode.OBNETDEB);
      obnetcre = sumBy(filteredRecords, BudgetCode.OBNETCRE);
      oobdeb = sumBy(filteredRecords, BudgetCode.OOBDEB);
      oobcre = sumBy(filteredRecords, BudgetCode.OOBCRE);
    } else {
      const subAgg = aggregateData(filteredRecords, subTree);
      const values = Object.values(subAgg).map(agg => agg.value);
      obnetdeb = sumBy(values, BudgetCode.OBNETDEB);
      obnetcre = sumBy(values, BudgetCode.OBNETCRE);
      oobdeb = sumBy(values, BudgetCode.OOBDEB);
      oobcre = sumBy(values, BudgetCode.OOBCRE);
      output.subTree = subAgg;
    }

    return [
      code,
      {
        ...output,
        value: {
          obnetdeb,
          obnetcre,
          oobdeb,
          oobcre,
        },
      },
    ];
  });

  return Object.fromEntries(aggregate);
}

export function makeNomenId(code: string, population: number): string {
  let suffix = '';
  if (code) {
    if (!population || population >= 3500) suffix = `_COM_SUP3500`;
    else if (population < 500) suffix = `_COM_INF500`;
    else suffix = `_COM_500_3500`;
  } else {
    throw Error('No code provided');
  }

  return code + suffix;
}
