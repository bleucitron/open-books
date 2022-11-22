import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { getCity } from '@api/geo';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const insee = params.insee ?? '';

  const city = await getCity(insee, fetch).catch(() => {
    throw error(404, `Le code INSEE ${insee} n'existe pas`);
  });

  return {
    city,
  };
};
