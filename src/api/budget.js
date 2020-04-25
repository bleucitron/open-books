import { get } from '../utils/verbs';
import { makeBudgetCroiseEndpoint } from '../utils/budget';

const baseURL = 'https://data.economie.gouv.fr';

export function getRecords(params) {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get(endpoint, {
    baseURL,
  }).then(({ records }) => records.map(record => record.fields));
}

export function getRecordsFromSiren(siren, year) {
  return getRecords({ siren, year }).then(data => {
    const sirets = [...new Set(data.map(({ ident }) => ident))];

    const dataBySiret = Object.fromEntries(
      sirets.map(siret => {
        const records = data.filter(({ ident }) => ident === siret);

        return [siret, { siret, year, records }];
      }),
    );
    // console.log('SIRETS in data', sirets);
    // console.log('SIRETS data', dataBySiret);

    return Object.values(dataBySiret);
  });
}
