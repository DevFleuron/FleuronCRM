"use client";

import React, { useState } from "react";
import { CampaignWizard } from "@/src/components/features/campaigns/CampaignWizard";
import type { Lead, Template } from "@/src/types";

// Données mockées - Leads
const MOCK_LEADS: Lead[] = [
  {
    _id: "1",
    ref: "47750",
    date: new Date("2026-01-26"),
    heure: "11:49",
    nom: "VICHERAT",
    prenom: "ANTHONY",
    mobile: "06 23 17 56 85",
    email: "anthony.vicherat@laposte.net",
    adresse: "",
    codePostal: "55300",
    source: "LOGICALL",
    telepro: "JANIN JESSICA",
    equipe: "Fleuron Industries",
    rapport: "NRP",
    observation: "par JESSICA JANIN 26/01/2026 16:53 : NRP/ msg laisser",
    typeInstallation: "ITE",
    smsEnvoye: false,
    smsCount: 0,
    emailEnvoye: false,
    emailCount: 0,
    importedAt: new Date(),
  },
  {
    _id: "2",
    ref: "47770",
    date: new Date("2026-01-26"),
    heure: "11:49",
    nom: "IMNO",
    prenom: "ANNE",
    mobile: "06 61 78 78 07",
    email: "christyann@laposte.net",
    adresse: "",
    codePostal: "15140",
    source: "LOGICALL",
    telepro: "RIBERTE MICKAEL",
    equipe: "",
    rapport: "NRP",
    observation: "par POMELO 27/01/2026 19:24 : NOUVEAU PROSPECT => NRP",
    typeInstallation: "ITE",
    smsEnvoye: true,
    smsCount: 2,
    emailEnvoye: false,
    emailCount: 0,
    importedAt: new Date(),
  },
  {
    _id: "3",
    ref: "47771",
    date: new Date("2026-01-26"),
    heure: "11:49",
    nom: "FATA",
    prenom: "SAID",
    mobile: "06 76 58 23 13",
    email: "hadjimoussa254@gmail.com",
    adresse: "",
    codePostal: "13003",
    source: "LOGICALL",
    telepro: "BELLON ERIC",
    equipe: "",
    rapport: "NRP",
    observation: "par ERIC BELLON 26/01/2026 17:54 : msg laissé",
    typeInstallation: "ITE",
    smsEnvoye: false,
    smsCount: 0,
    emailEnvoye: true,
    emailCount: 1,
    importedAt: new Date(),
  },
];

// Données mockées - Templates
const MOCK_TEMPLATES: Template[] = [
  {
    _id: "1",
    name: "Relance NRP - Premier contact",
    type: "sms",
    content:
      "Bonjour {{prenom}} {{nom}}, nous revenons vers vous concernant votre projet {{typeInstallation}}. Êtes-vous disponible pour en discuter ? REF: {{ref}}",
    variables: ["prenom", "nom", "typeInstallation", "ref"],
    createdAt: new Date("2026-01-20"),
    usageCount: 45,
  },
  {
    _id: "2",
    name: "Email de suivi ITE",
    type: "email",
    subject: "Votre projet d'isolation - REF {{ref}}",
    content:
      "Bonjour {{prenom}},\n\nNous revenons vers vous concernant votre demande d'isolation thermique extérieure.\n\nNotre équipe est disponible pour répondre à vos questions.\n\nCordialement,\nL'équipe Fleuron Industries",
    variables: ["prenom", "ref"],
    createdAt: new Date("2026-01-15"),
    usageCount: 23,
  },
  {
    _id: "3",
    name: "Rappel RDV",
    type: "sms",
    content:
      "Rappel : RDV prévu demain pour votre projet {{typeInstallation}}. Confirmez-vous ? REF: {{ref}}",
    variables: ["typeInstallation", "ref"],
    createdAt: new Date("2026-01-10"),
    usageCount: 67,
  },
  {
    _id: "4",
    name: "Email commercial ITE",
    type: "email",
    subject: "Économisez sur vos factures avec notre ITE",
    content:
      "Bonjour {{prenom}},\n\nVotre demande d'isolation thermique extérieure nous intéresse.\n\nNos solutions vous permettent d'économiser jusqu'à 30% sur vos factures énergétiques.\n\nContactez-nous au plus vite !\n\nCordialement",
    variables: ["prenom"],
    createdAt: new Date("2026-01-12"),
    usageCount: 12,
  },
];

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Nouvelle Relance NRP
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Créez une campagne de relance en 3 étapes simples
        </p>
      </div>

      {/* Wizard */}
      <CampaignWizard leads={MOCK_LEADS} templates={MOCK_TEMPLATES} />
    </div>
  );
}
