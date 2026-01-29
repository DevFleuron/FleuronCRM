import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  formatStr = "dd/MM/yyyy",
): string {
  try {
    return format(new Date(date), formatStr, { locale: fr });
  } catch {
    return "-";
  }
}

export function formatPhone(phone: string): string {
  if (!phone) return "-";
  // "0612345678" -> "06 12 34 56 78"
  const cleaned = phone.replace(/\s/g, "");
  return cleaned.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export function getRapportColor(
  rapport: string,
): "success" | "warning" | "error" | "info" | "neutral" {
  switch (rapport) {
    case "CLIENT":
    case "RDV PRIS":
      return "success";
    case "NRP":
    case "A RAPPELER":
      return "warning";
    case "PERDU":
      return "error";
    case "NOUVEAU PROSPECT":
      return "info";
    default:
      return "neutral";
  }
}

export function truncate(str: string, length: number): string {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
