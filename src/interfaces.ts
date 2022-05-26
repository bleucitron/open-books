import type { BudgetType } from '@utils/budget';

export type Fetch = (
  info: RequestInfo,
  init?: RequestInit,
) => Promise<Response>;

export interface RequestOptions extends RequestInit {
  fetch?: Fetch;
}

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

export interface SirenFromAPI {
  uniteLegale: UniteLegale;
}

export interface Budget extends TreeValue {
  id: string;
  info: { city: City };
  siren: string;
  siret: string;
  label: string;
  nomen: string;
  etabl: string;
  year: number;
  length: number;
  records: BudgetRecord[];
}

export interface BudgetMap {
  [k: string]: Budget;
}

export interface BudgetRaw {
  info: { city: City };
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

interface InseeEntity {
  code: string;
  nom: string;
}

export interface City extends InseeEntity {
  population: number;
  departement: InseeEntity;
  region: InseeEntity;
}

export interface TreeValue {
  tree: FonctionTree;
  value: Partial<Record<BudgetType, number>>;
}

export interface FonctionTreeValue extends TreeValue {
  code: string;
  label: string;
  short?: string;
}

export interface FonctionTree {
  [code: string]: FonctionTreeValue;
}

export interface Etablissement {
  siren: string;
  nic: string;
  siret: string;
  etablissementSiege: boolean;
  adresseEtablissement: AdresseEtablissement;
}

export interface AdresseEtablissement {
  codeCommuneEtablissement: string;
}

export interface CSV {
  file: string;
  url: string;
}

export interface UrlData {
  insee: string;
  siret: string;
  sirens: string[];
  year: number;
}

export interface BarChartValue {
  code: string;
  label: string;
  short: string;
  tree?: BarChartValue[];
  value: ChartBudgetValue;
}

interface ChartBudgetValue {
  obnetcre: number;
  obnetcre_f: number;
  obnetcre_i: number;
  obnetdeb: number;
  obnetdeb_f: number;
  obnetdeb_i: number;
  oobcre: number;
  oobdeb: number;
}

export interface LinkItem {
  name: string;
  insee: string;
  siret?: string;
  sirens: string[];
}

export interface UniteLegale {
  periodesUniteLegale: { denominationUniteLegale: string }[];
  siren: string;
}
