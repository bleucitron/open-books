export function isSiren(siren: string): boolean {
  return siren.trim().length === 9;
}

export function isSiret(siret: string): boolean {
  return siret.trim().length === 14;
}
