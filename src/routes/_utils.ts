import { goto } from '$app/navigation';
import { city as cityStore } from '@stores';
import type { City } from '@interfaces';

export interface TargetData {
  city: City;
  siret?: string;
}

export function handleTargetSelection(d: TargetData): void {
  const { city, siret } = d;
  if (city) {
    cityStore.set(city);
  }
  if (siret) {
    cityStore.set(null);
    const url = `/budgets?siret=${siret}`;

    goto(url);
  }
}
