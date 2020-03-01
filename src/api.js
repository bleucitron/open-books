import axios from 'axios';

const token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
const sirenUrl = 'https://api.insee.fr/entreprises/sirene/V3';
const dataUrl =
  'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=balances-comptables-des-etablissements-publics-locaux-depuis-2010';

// const siret = '26290054100034';

export default function(siret) {
  const url = `${dataUrl}&q=ident:${siret}&rows=10000`;

  const sirenP = axios.get(`/siret/${siret}`, {
    baseURL: sirenUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const dataP = axios.get(url);

  return Promise.all([sirenP, dataP]);
}
