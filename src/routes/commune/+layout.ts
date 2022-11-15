import type { LayoutLoad } from './$types';
import { getCity } from '@api/geo';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const insee = params.insee ?? '';

  const city = await getCity(insee, fetch);

  return {
    city,
  };
};
