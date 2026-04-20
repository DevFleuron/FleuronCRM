export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

  // +33612345678 → 0612345678
  if (cleaned.startsWith("+33")) {
    return "0" + cleaned.slice(3);
  }
  // 33612345678 → 0612345678
  if (cleaned.startsWith("33") && cleaned.length === 11) {
    return "0" + cleaned.slice(2);
  }
  return cleaned;
}

export function toInternational(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  if (cleaned.startsWith("0")) {
    return "+33" + cleaned.slice(1);
  }
  return cleaned;
}
