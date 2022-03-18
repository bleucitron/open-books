// SIREN

export function isSiren(siren: string): boolean {
  if (siren.trim().length === 9) {
    return true;
  }
}

// SIRET

export function isSiret(siret: string): boolean {
  if (siret.trim().length === 14) {
    return true;
  }
}
