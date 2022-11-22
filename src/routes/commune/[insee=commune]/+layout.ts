import type { LayoutLoad } from './$types';
import type { Etablissement } from '@interfaces';
import { extractSirens } from '@utils';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { insee } = params;

  const siretsFromInsee = (await fetch(`/sirene/sirets/${insee}`, {
    headers: { 'content-type': 'application/json' },
  })
    .then(r => r.json())
    .catch(() => [])) as Etablissement[];

  if (!siretsFromInsee.length) {
    throw new Error(
      `Nous ne trouvons pas d'informations SIRENE pour le code INSEE ${insee})`,
    );
  }

  const mainSirets = siretsFromInsee.filter(e => e.etablissementSiege);
  const sirens = extractSirens(mainSirets);

  const sirets = mainSirets.map(e => e.siret).sort();
  const siret = sirets[0];

  return {
    sirens,
    siret,
  };
};
