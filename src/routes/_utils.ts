import { goto } from '$app/navigation';
import type { City } from '@interfaces';

export interface RedirectData {
  city: City;
  siret?: string;
}

export function redirectToBudget({ city, siret }: RedirectData): void {
  let url = '/budgets';
  const params: Record<string, string> = {};

  if (city) {
    params.insee = city.code;
  }
  if (siret) params.siret = siret;

  if (Object.keys(params).length) {
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    url += `?${paramString}`;

    goto(url);
  }
}
