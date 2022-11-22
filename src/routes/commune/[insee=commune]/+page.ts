import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { fillBudget } from './cache';

const defaultYear = new Date().getFullYear() - 2;

export const load: LayoutLoad = async ({ url, parent, fetch }) => {
  const { searchParams } = url;
  const siret = searchParams.get('siret');
  const year = searchParams.get('year');

  const { city, siret: mainSiret } = await parent();

  if (!siret || !year) {
    const s = siret ?? mainSiret;
    const y = year ?? defaultYear.toString();

    const redirectUrl = new URL(url);
    redirectUrl.searchParams.set('siret', s);
    redirectUrl.searchParams.set('year', y);

    throw redirect(302, redirectUrl.toString());
  }

  const budget = await fillBudget(siret, parseInt(year), city, fetch);

  return {
    budget,
  };
};
