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

export function makeCSV(data) {
  return csvString
    .parseAsync(data, { fields })
    .catch(err => console.error(err));
}

export function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
