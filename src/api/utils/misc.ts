export function buildParamString(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramByKey: Record<string, any>,
): string {
  return Object.entries(paramByKey)
    .filter(entry => entry[1])
    .map(([key, value]) => {
      const valueString = Array.isArray(value) ? value.join(',') : value;

      return `${key}=${valueString}`;
    })
    .join('&');
}
