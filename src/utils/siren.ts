import type { Etablissement } from '@interfaces';

export function isSiren(siren: string): boolean {
  return siren.trim().length === 9;
}

export function isSiret(siret: string): boolean {
  return siret.trim().length === 14;
}

export function extractSirens(etablissements: Etablissement[]): string[] {
  return [...new Set(etablissements.map(({ siren }) => siren))];
}

interface CityCode {
  name: string;
  nb: number;
  base: string;
}

const codesByMain: Record<string, CityCode> = {
  // Codes for Arrondissements
  '69123': {
    name: 'Lyon',
    nb: 9,
    base: '69380',
  },
  '75056': {
    name: 'Paris',
    nb: 20,
    base: '75100',
  },
  '13055': {
    name: 'Marseille',
    nb: 16,
    base: '13200',
  },
};

export function checkCodes(code: string): string[] {
  if (code in codesByMain) {
    const { nb, base } = codesByMain[code];

    const codes = Array.from({ length: nb }, (_, v) =>
      (parseInt(base) + v + 1).toString(),
    );

    return [code, ...codes];
  }

  return [code];
}
