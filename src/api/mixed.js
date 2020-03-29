import { getBudgets } from './budget';
import { getSiret } from './siren';

export function getBudgetsBySiret(siren) {
  return getBudgets(siren).then(data => {
    const sirets = [...new Set(data.records.map(({ fields }) => fields.ident))];

    console.log('SIRETS in data', sirets);
    const dataBySiret = Object.fromEntries(
      sirets.map(siret => {
        const records = data.records.filter(
          ({ fields }) => fields.ident === siret,
        );

        return [siret, { id: siret, records }];
      }),
    );

    return Promise.allSettled(sirets.map(getSiret)).then(res => {
      const data = res.filter(r => r.value).map(r => r.value);

      data.forEach(d => {
        dataBySiret[d.siret].detail = d;
      });

      return Object.values(dataBySiret);
    });
  });
}
