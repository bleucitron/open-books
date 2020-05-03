import csvString from 'json2csv';

const fields = [
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

export async function makeCSV(data) {
  const years = [...new Set(data.map(d => d.exer))];
  const year = years.length === 1 ? years[0] : null;
  const sirets = [...new Set(data.map(d => d.ident))];
  const siret = sirets.length === 1 ? sirets[0] : null;

  let file = 'budget';

  if (siret) file += `_${siret}`;
  if (year) file += `_${year}`;

  file += '.csv';

  const csv = await csvString
    .parseAsync(data, { fields })
    .catch(err => console.error(err));
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  return {
    file,
    url,
  };
}

export function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function formatValue(value) {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    notation: 'compact',
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 3,
    currency: 'EUR',
  }).format(value);
}
