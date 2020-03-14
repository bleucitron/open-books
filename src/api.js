import axios from 'axios';

const token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
const sirenUrl = 'https://api.insee.fr/entreprises/sirene/V3';
const dataUrl =
  'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=balances-comptables-des-etablissements-publics-locaux-depuis-2010';

function get(...p) {
  return axios.get(...p).then(({ data }) => data);
}

function fetchSiret(siret) {
  return get(`/siret/${siret}`, {
    baseURL: sirenUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(({ etablissement }) => etablissement);
}

function fetchBudget(siren, code) {
  const c = code.slice(2);
  console.log('C', c);

  return get(
    `https://data.economie.gouv.fr/api/records/1.0/search/?dataset=balances-comptables-des-communes-en-2018&q=siren:${siren}&insee:${c}&rows=10000`,
  );
}

function fetchSiren(text, codeCommune) {
  return get(
    `/siret?q=denominationUniteLegale:"${text}" AND codeCommuneEtablissement:${codeCommune} AND categorieJuridiqueUniteLegale:7210&nombre=300`,
    {
      baseURL: sirenUrl,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  ).then(({ etablissements }) => {
    return [...new Set(etablissements.map(({ siren }) => siren))];
  });
}

const banUrl =
  'hhttps://geo.api.gouv.fr/communes?nom=bordeaux&boost=population&fields=code,nom,departement,region';

export function fetchCities(e) {
  const text = e.target.value;

  console.log('TEXT', text);

  get(
    `https://geo.api.gouv.fr/communes?nom=${text}&boost=population&fields=code,nom,departement,region,population`,
  ).then(data => {
    console.log('Villes', data);

    const { nom, code } = data[0];

    console.log('NOM', nom, code);

    fetchSiren(nom, code).then(siren => {
      console.log('SIREN', siren);
      fetchBudget(siren, code).then(data => {
        const sirets = [
          ...new Set(data.records.map(({ fields }) => fields.ident)),
        ];

        console.log('SIRETS in data', sirets);
        sirets.forEach(siret => {
          console.log('SIRET', siret);
          console.log(
            'NB',
            data.records.filter(({ fields }) => fields.ident === siret).length,
          );
        });

        Promise.all(sirets.map(fetchSiret)).then(res => {
          console.log('RES', res);

          res.forEach(r => {
            console.log('SIRET', r.siret);
            console.log('UNITE LEGALE', r.uniteLegale);
          });
        });
      });
    });
  });
}
