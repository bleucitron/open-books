import { get } from '../utils/verbs';
import { makeBudgetCroiseEndpoint } from '../utils/budget';

const baseURL = 'https://data.economie.gouv.fr';

export function getBudgets(params) {
  const endpoint = makeBudgetCroiseEndpoint(params);

  return get(endpoint, {
    baseURL,
  });
}

export function getBudgetsBySiret(siren, year = 2018) {
  return getBudgets({ siren, year }).then(data => {
    const sirets = [...new Set(data.records.map(({ fields }) => fields.ident))];

    const dataBySiret = Object.fromEntries(
      sirets.map(siret => {
        const records = data.records.filter(
          ({ fields }) => fields.ident === siret,
        );

        return [siret, { siret, year, records }];
      }),
    );
    console.log('SIRETS in data', sirets);
    console.log('SIRETS data', dataBySiret);

    return Object.values(dataBySiret);
  });
}
