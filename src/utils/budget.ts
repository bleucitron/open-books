import json2csv from 'json-2-csv'; // CJS import
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

import { nomenById } from './nomen';
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
  const tree = nomenFilled
    ? aggregateData(records, nomenFilled?.tree, nomenFilled.id)
    : null;

  const treeValues = Object.values(tree ?? {});

  const obnetcre = sumBy(records, BudgetCode.OBNETCRE);
  const obnetdeb = sumBy(records, BudgetCode.OBNETDEB);
  const obnetdeb_i = treeValues.reduce((sum, v) => sum + v.value.obnetdeb_i, 0);
  const obnetdeb_f = treeValues.reduce((sum, v) => sum + v.value.obnetdeb_f, 0);
  const obnetcre_i = treeValues.reduce((sum, v) => sum + v.value.obnetcre_i, 0);
  const obnetcre_f = treeValues.reduce((sum, v) => sum + v.value.obnetcre_f, 0);

  return {
    id,
    siret,
    siren,
    etabl,
    city: city?.nom,
    year,
    nomen,
    length,
    value: {
      obnetdeb,
      obnetcre,
      obnetdeb_i,
      obnetdeb_f,
      obnetcre_i,
      obnetcre_f,
    },
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
  if (e.nodeName !== 'RefFonc' && e.nodeName !== 'RefFonctionnelles')
    throw `${e.nodeName} Not a <RefFonc> or a <RefFonctionnelle>`;

  const children = Array.from(e.childNodes).filter(
    n => n.nodeName === 'RefFonc',
  );

  const data = children.map(element => {
    const e = element as Element;
    const code = e.getAttribute('Code') as string;
    const label = e.getAttribute('Libelle') as string;
    const short = e.getAttribute('Lib_court') as string;

    const value: Partial<FonctionTreeValue> = {
      code,
      label,
    };

    if (label !== short) {
      value.short = short;
    }

    if (children.length > 0) value.tree = extractFonctions(e);

    return [code, value];
  });

  if (data.length === 0) return null;

  return Object.fromEntries(data);
}

export enum BudgetCode {
  OBNETDEB = 'obnetdeb',
  OBNETCRE = 'obnetcre',
  OOBDEB = 'oobdeb',
  OOBCRE = 'oobcre',
}

export enum BudgetType {
  DEBIT = 'obnetdeb',
  DEBIT_I = 'obnetdeb_i',
  DEBIT_F = 'obnetdeb_f',
  CREDIT = 'obnetcre',
  CREDIT_I = 'obnetcre_i',
  CREDIT_F = 'obnetcre_f',
}

export enum FILabel {
  I = 'Investissement',
  F = 'Fonctionnement',
}

export const typeToLabel = {
  [BudgetType.DEBIT]: 'Dépenses',
  [BudgetType.DEBIT_I]: "Dépenses d'investissement",
  [BudgetType.DEBIT_F]: 'Dépenses de fonctionnement',
  [BudgetType.CREDIT]: 'Recettes',
  [BudgetType.CREDIT_I]: "Recettes d'investissement",
  [BudgetType.CREDIT_F]: 'Recettes de fonctionnement',
};

export function fonctionFromTree(
  code: string,
  tree: FonctionTree,
): FonctionTreeValue {
  if (!tree) return null;

  if (!(code in tree)) {
    return fonctionFromTree(code, tree[code[0]]?.tree);
  }

  return tree[code] as FonctionTreeValue;
}

export function aggregateData(
  records: BudgetRecord[],
  tree: FonctionTree,
  nomenId: string,
): FonctionTree {
  const aggregate = Object.values(tree).map(fonction => {
    const { code, tree } = fonction;

    let obnetdeb;
    let obnetcre;
    let obnetdeb_i;
    let obnetcre_i;
    let obnetdeb_f;
    let obnetcre_f;

    let oobdeb;
    let oobcre;

    const output: FonctionTreeValue = { ...fonction };

    const filteredRecords = records.filter(r => r.fonction?.startsWith(code));

    const nomen = nomenById.get(nomenId);

    if (!tree) {
      const records_f = filteredRecords.filter(r => {
        return nomen.fiByCompte.get(r.compte) === 'F';
      });
      const records_i = filteredRecords.filter(r => {
        return nomen.fiByCompte.get(r.compte) === 'I';
      });
      obnetdeb = sumBy(filteredRecords, BudgetType.DEBIT);
      obnetcre = sumBy(filteredRecords, BudgetType.CREDIT);

      obnetdeb_i = sumBy(records_i, BudgetType.DEBIT);
      obnetdeb_f = sumBy(records_f, BudgetType.DEBIT);
      obnetcre_i = sumBy(records_i, BudgetType.CREDIT);
      obnetcre_f = sumBy(records_f, BudgetType.CREDIT);

      oobdeb = sumBy(filteredRecords, BudgetCode.OOBDEB);
      oobcre = sumBy(filteredRecords, BudgetCode.OOBCRE);
    } else {
      const subAgg = aggregateData(filteredRecords, tree, nomenId);
      const values = Object.values(subAgg).map(agg => agg.value);
      obnetdeb = sumBy(values, BudgetType.DEBIT);
      obnetcre = sumBy(values, BudgetType.CREDIT);

      obnetdeb_i = sumBy(values, BudgetType.DEBIT_I);
      obnetcre_i = sumBy(values, BudgetType.CREDIT_I);
      obnetdeb_f = sumBy(values, BudgetType.DEBIT_F);
      obnetcre_f = sumBy(values, BudgetType.CREDIT_F);

      oobdeb = sumBy(values, BudgetCode.OOBDEB);
      oobcre = sumBy(values, BudgetCode.OOBCRE);
      output.tree = subAgg;
    }

    return [
      code,
      {
        ...output,
        value: {
          obnetdeb,
          obnetcre,
          obnetdeb_i,
          obnetcre_i,
          obnetdeb_f,
          obnetcre_f,
          oobdeb,
          oobcre,
        },
      },
    ];
  });

  return Object.fromEntries(aggregate);
}

export function makeNomenDecl(code: string, population: number): string {
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
