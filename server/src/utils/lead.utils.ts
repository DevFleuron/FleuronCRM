/*
 * Vérifier si un statut est un NRP (NRP, NRP 1, NRP 2, etc.)
 */

export function isNRPStatus(status: string): boolean {
  if (!status) return false;

  const normalizedStatus = status.trim().toUpperCase();

  return (
    normalizedStatus === "NRP" ||
    normalizedStatus === "NRP 1" ||
    normalizedStatus === "NRP 2" ||
    normalizedStatus === "NRP 3" ||
    normalizedStatus === "NRP 4" ||
    normalizedStatus === "NRP 5"
  );
}

/**
 * Vérifier si c'est une transition qui sort du NRP
 */
export function isLeavingNRP(oldStatus: string, newStatus: string): boolean {
  return isNRPStatus(oldStatus) && !isNRPStatus(newStatus);
}
