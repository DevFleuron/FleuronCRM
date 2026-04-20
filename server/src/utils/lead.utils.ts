export function isNRPStatus(status: string): boolean {
  if (!status) return false;
  const s = status.trim().toUpperCase();
  return (
    s === "NRP" ||
    s === "NRP 1" ||
    s === "NRP 2" ||
    s === "NRP 3" ||
    s === "NRP 4" ||
    s === "NRP 5"
  );
}

export function shouldContinueSequence(status: string): boolean {
  if (!status) return false;
  const s = status.trim().toUpperCase();
  return (
    s === "NOUVEAU PROSPECT" ||
    s === "LEAD" ||
    s === "NRP" ||
    s === "NRP 1" ||
    s === "NRP 2" ||
    s === "NRP 3" ||
    s === "NRP 4" ||
    s === "NRP 5" ||
    s === "PROSPECT A RETRAITER" ||
    s === "DOUBLON" ||
    s === "JUSTE DES RENSEIGNEMENT" ||
    s === "PAS FAIS DE DEMANDE" ||
    s === "ANNULE"
  );
}

export function isLeavingNRP(oldStatus: string, newStatus: string): boolean {
  return isNRPStatus(oldStatus) && !isNRPStatus(newStatus);
}
