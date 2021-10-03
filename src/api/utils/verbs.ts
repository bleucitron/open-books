// Refer for better typescript usage to
// https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript

export function get<T>(url: string, options?: unknown): Promise<T> {
  return fetch(url, options).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    const stream = resp.url.endsWith('.xml') ? resp.text() : resp.json();

    return stream;
  });
}
