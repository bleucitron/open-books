import { normalizeText } from '@utils';

import type { Etablissement } from '@interfaces';

const nbResults = 1000;
const category = '7210';

interface Params {
  denominationUniteLegale: string;
  codeCommuneEtablissement: number[];
  categorieJuridiqueUniteLegale: string;
}

function buildParamString(paramByKey: Params): string {
  return Object.entries(paramByKey)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const s = value.map(v => `${key}:${v}`).join(' OR ');

        return `(${s})`;
      }

      return `${key}:"${value}"`;
    })
    .join(' AND ');
}

interface CityCode {
  name: string;
  nb: number;
  base: number;
}

const codesByMain: Record<string, CityCode> = {
  // Codes for Arrondissements
  '69123': {
    name: 'Lyon',
    nb: 9,
    base: 69380,
  },
  '75056': {
    name: 'Paris',
    nb: 20,
    base: 75100,
  },
  '13055': {
    name: 'Marseille',
    nb: 16,
    base: 13200,
  },
};

export function checkCodes(code: string): number[] {
  let output = [parseInt(code)];

  if (code in codesByMain) {
    const { nb, base } = codesByMain[code];

    output = [...output, ...Array(nb).keys()].map(e => base + e + 1);
  }

  return output;
}

export function makeGetSiretEndpoint(siret: string): string {
  return `siret/${siret}`;
}

export function makeGetSiretsEndpoint(sirens: string[]): string {
  const base = 'siret';

  const param = sirens.map(s => `siren:"${s}"`).join(' OR ');

  const number = `nombre=${nbResults}`;

  const query = `q=${param}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function makeSearchSiretEndpoint(text: string, codes: number[]): string {
  const base = 'siret';

  const params = buildParamString({
    denominationUniteLegale: normalizeText(text),
    codeCommuneEtablissement: codes,
    categorieJuridiqueUniteLegale: category,
  });

  const number = `nombre=${nbResults}`;

  const query = `q=${params}`;
  const allParams = [query, number].join('&');

  return `${base}?${allParams}`;
}

export function extractSirens(etablissements: Etablissement[]): string[] {
  return [...new Set(etablissements.map(({ siren }) => siren))];
}
