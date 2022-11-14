import { error, json, type RequestHandler } from '@sveltejs/kit';
import { get } from '@api/utils/verbs';
import { checkCodes } from '@utils';
import { baseUrl, options, makeSearchSiretEndpoint } from '../../utils';

import type { SiretsFromAPI } from '@interfaces';

export const GET: RequestHandler = async ({ params: { insee } }) => {
  if (!insee) {
    throw error(404, `Le code INSEE ${insee} n'existe pas`);
  }

  const codes = checkCodes(insee);
  const endpoint = makeSearchSiretEndpoint(codes);

  const results = await get<SiretsFromAPI>(`${baseUrl}/${endpoint}`, {
    ...options,
  }).then(r => r.etablissements);

  return json(results);
};
