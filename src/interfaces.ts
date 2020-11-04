export interface Record {
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
  records: Record[];
}

export interface Budget {
  city: string;
  siren: string;
  siret: string;
  label: string;
  nomen: string;
  etabl: string;
  year: number;
  credit: number;
  debit: number;
  length: number;
  records: Record[];
}

export interface BudgetMap {
  [k: string]: Budget | null;
}

export interface BudgetRaw {
  city: string;
  siret: string;
  year: number;
  records: Record[];
}

export interface BudgetParams {
  ident?: string[];
  siren?: string[];
  year: number;
}

interface InseeEntity {
  code: string;
  nom: string;
}

export interface City extends InseeEntity {
  population: number;
  departement: InseeEntity;
  region: InseeEntity;
}

export interface FonctionTree {
  [code: string]: {
    code: string;
    label: string;
    short: string;
    subFonctions: FonctionTree;
  };
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
