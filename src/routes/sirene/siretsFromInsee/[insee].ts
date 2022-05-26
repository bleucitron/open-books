import { getSiretsFromInsee } from '@api';
import type { Etablissement } from '@interfaces';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler<
  {
    insee: string;
  },
  Etablissement[]
> = async ({ params: { insee } }) => {
  if (insee) {
    const results = await getSiretsFromInsee(insee);
    return {
      body: results,
    };
  }

  return {
    status: 404,
  };
};
