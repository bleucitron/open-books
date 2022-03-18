import { randomNb } from '@utils';

const fields = ['code', 'nom', 'departement', 'region', 'population'];

export function makeGetCitiesEndpoint(text: string): string {
  if (!text) {
    throw 'No text provided';
  }

  const base = 'communes';

  const name = `nom="${text}"`;
  const fieldsString = `fields=${fields.join(',')}`;
  const boost = 'boost=population';

  const allParams = [name, fieldsString, boost].join('&');

  return `${base}?${allParams}`;
}

export function makeGetCityEndpoint(code: string): string {
  if (!code) {
    throw 'No code provided';
  }

  const base = 'communes';

  const fieldsString = `fields=${fields.join(',')}`;

  return `${base}?nom=${code}&${fieldsString}`;
}

const dptCodes = [
  ...Array.from(Array(976).keys())
    .map(c => c + 1)
    .filter(c => c !== 20 && c !== 975 && (c <= 95 || c >= 971))
    .map(code => code.toString().padStart(2, '0')),
  '2A',
  '2B',
];

export function getRandomDptCodes(): string[] {
  return Array.from(Array(3).keys()).reduce(acc => {
    let code = getRandomDptCode();

    while (acc.includes(code)) {
      code = getRandomDptCode();
    }

    return [...acc, code];
  }, []);
}

export function getRandomDptCode(): string {
  const index = randomNb(dptCodes.length);
  return dptCodes[index];
}
