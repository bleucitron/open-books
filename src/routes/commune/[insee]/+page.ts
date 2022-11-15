import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { fillBudget } from './cache';

export const load: LayoutLoad = async ({ params, url, parent, fetch }) => {
  const { insee } = params;
  const { searchParams } = url;
  const siret = searchParams.get('siret');
  const year = parseInt(searchParams.get('year') ?? '');

  const data = await parent();
  const { city } = data;

  if (!siret || !year) {
    const s = siret ?? data.siret;
    const defaultYear = new Date().getFullYear() - 2;

    throw redirect(307, `/commune/${insee}?year=${defaultYear}&siret=${s}`);
  }

  const budget = await fillBudget(siret, year, city, fetch);

  return {
    budget,
  };
};
