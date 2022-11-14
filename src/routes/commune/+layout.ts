import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { getCity } from '@api/geo';
import type { Etablissement } from '@interfaces';
import { makeBudgetUrl, extractSirens } from '@utils';

const defaultYear = new Date().getFullYear() - 2;

export const load: LayoutLoad = async ({
  params,
  url: { searchParams },
  fetch,
}) => {
  const insee = params.insee ?? '';
  const y = searchParams.get('year') ?? '';
  const sirenString = searchParams.get('sirens');
  let siret = searchParams.get('siret');

  const year = parseInt(y) || defaultYear;

  let sirens = sirenString?.split(',');

  const city = await getCity(insee, fetch);

  if (!siret || !sirens) {
    const siretsFromInsee = (await fetch(`/sirene/sirets/${insee}`, {
      headers: { 'content-type': 'application/json' },
    }).then(r => r.json())) as Etablissement[];

    if (!siretsFromInsee) {
      throw new Error(
        `Nous ne trouvons pas d'informations SIRENE sur la commune ${city.nom} (code INSEE ${city.code})`,
      );
    }

    const mainSirets = siretsFromInsee.filter(e => e.etablissementSiege);
    sirens = extractSirens(mainSirets);

    const sirets = mainSirets.map(e => e.siret).sort();

    siret = sirets[0];

    throw redirect(
      307,
      makeBudgetUrl({
        insee,
        siret,
        sirens,
        year,
      }),
    );
  }

  return {
    sirens,
    siret,
    city,
    insee,
  };
};
