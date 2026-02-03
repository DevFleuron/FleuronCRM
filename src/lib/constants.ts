export const RAPPORT_OPTIONS = [
  { value: "", label: "Tous les rapports" },
  { value: "NRP", label: "NRP", color: "warning" as const },
  {
    value: "NOUVEAU PROSPECT",
    label: "Nouveau Prospect",
    color: "info" as const,
  },
  { value: "CLIENT", label: "Client", color: "success" as const },
  { value: "PERDU", label: "Perdu", color: "error" as const },
  { value: "RDV PRIS", label: "RDV Pris", color: "success" as const },
  { value: "A RAPPELER", label: "À Rappeler", color: "warning" as const },
];

export const SOURCE_OPTIONS = [
  "LOGICALL",
  "VOLTADS",
  "STEVENS",
  "FLEURON INDUSTRIES - CROSS COM",
  "PARRAINAGE",
];

export const TYPE_INSTALLATION_OPTIONS = [
  "ITE",
  "LED INTERIEUR",
  "POMPE A CHALEUR",
];

export const SMS_EMAIL_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "yes", label: "Envoyé" },
  { value: "no", label: "Non envoyé" },
];

export const TEMPLATE_VARIABLES = [
  { key: "nom", label: "Nom", example: "DUPONT" },
  { key: "prenom", label: "Prénom", example: "Jean" },
  { key: "ref", label: "Référence", example: "47750" },
  { key: "mobile", label: "Mobile", example: "06 12 34 56 78" },
  { key: "date", label: "Date", example: "26/01/2026" },
  { key: "source", label: "Source", example: "LOGICALL" },
  { key: "typeInstallation", label: "Type Installation", example: "ITE" },
];
