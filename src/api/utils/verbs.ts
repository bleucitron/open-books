// Refer for better typescript usage to
// https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript

import type { RequestOptions } from '@interfaces';

export function get<T>(url: string, opts?: RequestOptions): Promise<T> {
  const { fetch: altFetch, ...options } = opts;

  const fetcher = altFetch ?? fetch;
  return fetcher(encodeURI(url), options).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    const stream = resp.headers.get('content-type').includes('json')
      ? resp.json()
      : resp.text();

    return stream;
  });
}
