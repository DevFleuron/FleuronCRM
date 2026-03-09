import { Request, Response } from "express";
import Settings from "../models/Settings.model";

const DEFAULT_RAPPORTS = [
  "A ENVOYE EN AUDIT",
  "A RAPPELER",
  "ANNULE",
  "BACKUP",
  "DEVIS A ENVOYER",
  "DEVIS ENVOYE",
  "DEVIS ENVOYE NRP 1",
  "DEVIS ENVOYE NRP 2",
  "DEVIS ENVOYE NRP 3",
  "DEVIS SIGNE",
  "DOUBLON",
  "EN ATTENTE RETOUR REGIE",
  "FAUX NUMERO",
  "HORS CRITERE",
  "JUSTE DES RENSEIGNEMENT",
  "LEAD",
  "NOUVEAU PROSPECT",
  "NRP",
  "NRP 1",
  "NRP 2",
  "NRP 3",
  "NRP 4",
  "NRP 5",
  "PAS FAIS DE DEMANDE",
  "PLUS INTERESSE",
  "PROSPECT A RETRAITER",
  "PROSPECT DEJA PRESENT DANS LA BASE",
  "RDV A CONFIRMER",
  "RDV PLACE",
  "Refus mairie",
  "retract A Rappeler",
  "Retract Devis envoyé",
  "Retract NRP 2",
  "Retract Refus Financement",
  "RETRACTATION",
  "SIGNE",
  "VENTE NON FAITE",
];

const DEFAULT_SOURCES = [
  "2D CONSULTING",
  "BOX-TV",
  "Client Otoiture",
  "CLOCHE",
  "CONTACT_AMBASSADEUR",
  "CONTROLE QUALITE",
  "DATA",
  "DATA LP",
  "ELITE",
  "ETUDE-THERMIQUE-GRATUITE-BOX",
  "ETUDE-THERMIQUE-GRATUITE-TNT",
  "FL",
  "FLEURON INDUSTRIES - CROSS COM",
  "FLEURON INDUSTRIES - PUB TV",
  "FORMULAIRE TERRAIN",
  "FORMULAIRE TERRAIN julien",
  "H LEADS",
  "IFLEURON",
  "INTERNE",
  "LEADS STEEVE",
  "LEADSPOT",
  "LOGICALL",
  "LOGICALL PVWATT",
  "LOOPS",
  "Maison_Fleuron",
  "META",
  "NEL",
  "PARRAINAGE",
  "PV STEEVE",
  "RENEOV",
  "RETOUR MAILING",
  "RICHARD PARTNERS",
  "site-fleuronindustries",
  "STEVENS",
  "TIKTOK",
  "TIKTOK_BRUNO",
  "TIKTOK_JESSICA",
  "TIKTOK_JOSE",
  "TNT",
  "UNITEAD",
  "UNITEAD HD",
  "UNITEAD-CRG",
  "UNYX",
  "VOLTADS",
  "YITE",
  "YONI-HENRY",
];
async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      rapports: DEFAULT_RAPPORTS,
      sources: DEFAULT_SOURCES,
    });
  }
  return settings;
}

export const getSettings = async (req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
};

export const addRapport = async (req: Request, res: Response) => {
  const { value } = req.body;
  if (!value?.trim()) return res.status(400).json({ error: "Valeur requise" });
  const settings = await getOrCreateSettings();
  if (settings.rapports.includes(value.trim().toUpperCase())) {
    return res.status(400).json({ error: "Rapport déjà existant" });
  }
  settings.rapports.push(value.trim().toUpperCase());
  await settings.save();
  res.json(settings);
};

export const deleteRapport = async (req: Request, res: Response) => {
  const value = req.params.value as string;
  const settings = await getOrCreateSettings();
  settings.rapports = settings.rapports.filter(
    (r) => r !== decodeURIComponent(value),
  );
  await settings.save();
  res.json(settings);
};

export const addSource = async (req: Request, res: Response) => {
  const { value } = req.body;
  if (!value?.trim()) return res.status(400).json({ error: "Valeur requise" });
  const settings = await getOrCreateSettings();
  const normalized = value.trim();
  if (settings.sources.includes(normalized)) {
    return res.status(400).json({ error: "Source déjà existante" });
  }
  settings.sources.push(normalized);
  await settings.save();
  res.json(settings);
};

export const deleteSource = async (req: Request, res: Response) => {
  const value = req.params.value as string;
  const settings = await getOrCreateSettings();
  settings.sources = settings.sources.filter(
    (s) => s !== decodeURIComponent(value),
  );
  await settings.save();
  res.json(settings);
};
