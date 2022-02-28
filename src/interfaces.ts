import type { BudgetType } from '@utils/budget';
export interface BudgetRecord {
  bal: string;
  becre: number;
  bedeb: number;
  cacti: string;
  categ: string;
  cbudg: string;
  compte: string;
  cregi: string;
  cstyp: string;
  ctype: string;
  exer: string;
  fonction?: string;
  ident: string;
  insee: string;
  lbudg: string;
  ndept: string;
  nomen: string;
  obnetcre: number;
  obnetdeb: number;
  onbcre: number;
  onbdeb: number;
  oobcre: number;
  oobdeb: number;
  sc: number;
  sd: number;
  siren: string;
}

export interface RecordsWithSiret {
  siret: string;
  records: BudgetRecord[];
}

export interface BudgetFromAPI {
  records: {
    fields: BudgetRecord;
  }[];
}

export interface SiretFromAPI {
  etablissement: Etablissement;
}

export interface SiretsFromAPI {
  etablissements: Etablissement[];
}

export interface Budget {
  id: string;
  city: string;
  siren: string;
  siret: string;
  label: string;
  nomen: string;
  etabl: string;
  year: number;
  obnetdeb: number;
  obnetcre: number;
  obnetcre_i: number;
  obnetcre_f: number;
  obnetdeb_i: number;
  obnetdeb_f: number;
  length: number;
  records: BudgetRecord[];
  tree: FonctionTree;
}

export interface BudgetMap {
  [k: string]: Budget;
}

export interface BudgetRaw {
  city: City;
  siret: string;
  year: number;
  records: BudgetRecord[];
}

export interface BudgetParams {
  ident?: string[];
  siren?: string[];
  year: number;
}

export type Type = BudgetType;
export type Code = string;

interface InseeEntity {
  code: string;
  nom: string;
}

export interface City extends InseeEntity {
  population: number;
  departement: InseeEntity;
  region: InseeEntity;
}

export interface FonctionTreeValue {
  code: string;
  label: string;
  value?: Partial<Record<BudgetType, number>>;
  short?: string;
  subTree: FonctionTree;
}

export interface FonctionTree {
  [code: string]: FonctionTreeValue;
}

export interface Etablissement {
  siren: string;
  nic: string;
  siret: string;
  etablissementSiege: boolean;
}

export interface CSV {
  file: string;
  url: string;
}

export interface UrlData {
  name: string;
  insee: string;
  siret: string;
  sirens: string[];
  year: number;
}

export interface BarChartValue {
  label: string;
  value: number;
  handleClick?: () => void;
}

export interface HistorySearch {
  name: string;
  insee: string;
  sirens: string[];
}

export interface FavoriteSearch {
  name: string;
  insee: string;
  sirens: string[];
}
