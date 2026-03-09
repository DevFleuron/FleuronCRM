import fs from "fs";
import csv from "csv-parser";
import Lead from "../models/Lead.model";
import ImportHistory from "../models/ImportHistory.model";
import Campaign from "../models/Campaign.model";
import { SequenceService } from "./sequence.service";
import { isLeavingNRP } from "../utils/lead.utils";
import mongoose from "mongoose";
import Settings from "../models/Settings.model";

export class CSVService {
  private static normalizeHeader(header: string): string {
    return header.toLowerCase().trim().replace(/\s+/g, "");
  }

  private static mapHeaders(headers: string[]): Map<string, string> {
    const mapping = new Map<string, string>();

    const columnMap: Record<string, string[]> = {
      ref: ["ref", "reference"],
      date: ["date", "datecontact"],
      heure: ["heure", "time"],
      nom: ["nom", "lastname", "name"],
      prenom: ["prenom", "firstname"],
      telephone: ["telephone", "tel", "fixe"],
      mobile: ["mobile", "phone", "tel"],
      email: ["email", "mail", "courriel"],
      adresse: ["adresse", "address", "rue"],
      codePostal: ["codepostal", "cp", "postalcode", "zipcode"],
      source: ["source", "origine"],
      telepro: ["telepro", "commercial", "teleprospecteur"],
      equipe: ["equipe", "team", "groupe"],
      rapport: ["rapport", "statut", "status", "etat"],
      observation: ["observation", "commentaire", "note", "comment"],
      typeInstallation: ["typeinstallation", "installation", "type"],
    };

    headers.forEach((header) => {
      const normalized = this.normalizeHeader(header);
      for (const [targetField, aliases] of Object.entries(columnMap)) {
        if (aliases.includes(normalized)) {
          mapping.set(header, targetField);
          break;
        }
      }
    });

    return mapping;
  }

  private static extractRowData(
    row: any,
    headerMapping: Map<string, string>,
  ): any {
    const data: any = {};
    for (const [csvHeader, targetField] of headerMapping.entries()) {
      data[targetField] = row[csvHeader];
    }
    return data;
  }

  static async validateCSV(
    filePath: string,
  ): Promise<{ valid: boolean; message: string }> {
    return new Promise((resolve) => {
      const requiredFields = [
        "ref",
        "nom",
        "prenom",
        "mobile",
        "codePostal",
        "source",
        "rapport",
      ];
      let headers: string[] = [];
      let firstRow = true;

      fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" }))
        .on("headers", (headerList) => {
          headers = headerList;
        })
        .on("data", () => {
          if (firstRow) {
            firstRow = false;
            const headerMapping = this.mapHeaders(headers);
            const mappedFields = Array.from(headerMapping.values());
            const missingFields = requiredFields.filter(
              (field) => !mappedFields.includes(field),
            );

            if (missingFields.length > 0) {
              resolve({
                valid: false,
                message: `Colonnes manquantes: ${missingFields.join(", ")}`,
              });
            } else {
              resolve({ valid: true, message: "CSV valide" });
            }
          }
        })
        .on("error", (error) => {
          resolve({
            valid: false,
            message: `Erreur de lecture: ${error.message}`,
          });
        });
    });
  }

  static async importCSV(filePath: string, nomFichier: string) {
    const startTime = Date.now();

    const settingsDoc = await Settings.findOne();
    const VALID_RAPPORTS = settingsDoc?.rapports?.length
      ? settingsDoc.rapports
      : [
          "NOUVEAU PROSPECT",
          "NRP",
          "NRP 1",
          "NRP 2",
          "NRP 3",
          "NRP 4",
          "NRP 5",
          "CLIENT",
          "PERDU",
          "RDV PRIS",
          "A RAPPELER",
        ];

    const importHistory = await ImportHistory.create({
      nomFichier,
      nombreLeads: 0,
      nombreSucces: 0,
      nombreEchecs: 0,
      nombreNouveaux: 0,
      nombreMisesAJour: 0,
      statut: "en_cours",
      erreurs: [],
      changes: [],
    });

    const stats = { total: 0, nouveaux: 0, misesAJour: 0, echecs: 0 };
    const erreurs: string[] = [];
    const changes: any[] = [];
    const pendingRows: Promise<void>[] = [];
    let headerMapping: Map<string, string> | null = null;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" }))
        .on("headers", (headers) => {
          headerMapping = this.mapHeaders(headers);
          console.log(
            "Mapping des colonnes:",
            Object.fromEntries(headerMapping),
          );
        })
        .on("data", (row) => {
          const rowPromise = (async () => {
            stats.total++;

            try {
              if (!headerMapping)
                throw new Error("Header mapping non initialisé");

              const mappedData = this.extractRowData(row, headerMapping);

              const dateMatch = mappedData.date?.match(
                /(\d{2})\/(\d{2})\/(\d{4})/,
              );
              let parsedDate = new Date();
              if (dateMatch) {
                const [, day, month, year] = dateMatch;
                parsedDate = new Date(`${year}-${month}-${day}`);
              }

              const rawRapport = mappedData.rapport?.trim() || "";

              if (!VALID_RAPPORTS.includes(rawRapport)) {
                const errorMsg = `Rapport invalide "${rawRapport}" pour ${mappedData.prenom?.trim() || ""} ${mappedData.nom?.trim().toUpperCase() || ""}`;
                console.log(errorMsg);
                erreurs.push(errorMsg);
                stats.echecs++;
                return;
              }

              const rapport = rawRapport;

              const leadData = {
                ref: mappedData.ref?.trim(),
                date: parsedDate,
                heure: mappedData.heure?.trim() || "00:00",
                nom: mappedData.nom?.trim().toUpperCase(),
                prenom: mappedData.prenom?.trim(),
                mobile:
                  mappedData.mobile?.trim() ||
                  mappedData.telephone?.trim() ||
                  "",
                email: mappedData.email?.trim().toLowerCase() || "",
                adresse: mappedData.adresse?.trim() || "",
                codePostal: mappedData.codePostal?.trim(),
                source: mappedData.source?.trim(),
                telepro: mappedData.telepro?.trim() || "",
                equipe: mappedData.equipe?.trim() || "",
                rapport,
                observation: mappedData.observation?.trim() || "",
                typeInstallation: mappedData.typeInstallation?.trim() || "",
              };

              const missingFields = [];
              if (!leadData.ref) missingFields.push("ref");
              if (!leadData.nom) missingFields.push("nom");
              if (!leadData.prenom) missingFields.push("prenom");

              if (missingFields.length > 0) {
                const errorMsg = `Ligne ${stats.total}: Champs manquants (${missingFields.join(", ")})`;
                console.log(errorMsg);
                erreurs.push(errorMsg);
                stats.echecs++;
                return;
              }

              const existingLead = await Lead.findOne({ ref: leadData.ref });

              if (existingLead) {
                const oldStatus = existingLead.rapport;

                const hasChanged = await this.updateLeadAndDetectChanges(
                  existingLead,
                  leadData,
                  importHistory._id,
                  changes,
                );

                if (hasChanged) {
                  stats.misesAJour++;

                  const statusChanged = oldStatus !== leadData.rapport;
                  if (statusChanged) {
                    console.log(
                      `Statut changé: ${oldStatus} → ${leadData.rapport}`,
                    );
                    if (leadData.rapport !== "NRP") {
                      await SequenceService.checkAndStopSequences(
                        existingLead._id.toString(),
                        leadData.rapport,
                      );
                    }
                  }
                }
              } else {
                await Lead.create({
                  ...leadData,
                  importedAt: new Date(),
                  lastImportedAt: new Date(),
                  lastImportId: importHistory._id,
                  importCount: 1,
                  statusHistory: [
                    {
                      newStatus: leadData.rapport,
                      changedAt: new Date(),
                      importId: importHistory._id,
                      source: "import",
                    },
                  ],
                });
                stats.nouveaux++;
              }
            } catch (error: any) {
              console.error(`Erreur ligne ${stats.total}:`, error.message);
              erreurs.push(`Ligne ${stats.total}: ${error.message}`);
              stats.echecs++;
            }
          })();

          pendingRows.push(rowPromise);
        })
        .on("end", async () => {
          try {
            await Promise.all(pendingRows);

            console.log("Stats finales:", stats);

            const processingTime = (Date.now() - startTime) / 1000;

            await ImportHistory.updateOne(
              { _id: importHistory._id },
              {
                nombreLeads: stats.total,
                nombreSucces: stats.nouveaux + stats.misesAJour,
                nombreEchecs: stats.echecs,
                nombreNouveaux: stats.nouveaux,
                nombreMisesAJour: stats.misesAJour,
                statut: "termine",
                erreurs,
                changes,
                processingTime,
              },
            );

            resolve({
              message: `Import terminé: ${stats.nouveaux} nouveaux, ${stats.misesAJour} mis à jour, ${stats.echecs} erreurs`,
              importHistoryId: importHistory._id,
              stats: {
                total: stats.total,
                nouveaux: stats.nouveaux,
                misesAJour: stats.misesAJour,
                echecs: stats.echecs,
              },
              errors: erreurs,
            });
          } catch (error: any) {
            reject(error);
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  private static async updateLeadAndDetectChanges(
    existingLead: any,
    newData: any,
    importId: mongoose.Types.ObjectId,
    changes: any[],
  ): Promise<boolean> {
    let hasChanged = false;
    const fieldsToCheck = [
      "rapport",
      "observation",
      "mobile",
      "email",
      "telepro",
      "equipe",
    ];

    for (const field of fieldsToCheck) {
      if (existingLead[field] !== newData[field]) {
        hasChanged = true;

        if (field === "rapport") {
          const oldStatus = existingLead.rapport;
          const newStatus = newData.rapport;

          console.log(
            `Changement statut Lead ${existingLead.ref}: ${oldStatus} → ${newStatus}`,
          );

          if (isLeavingNRP(oldStatus, newStatus)) {
            await this.removeLeadFromActiveCampaigns(
              existingLead._id,
              importId,
              oldStatus,
              newStatus,
            );

            changes.push({
              leadRef: existingLead.ref,
              leadId: existingLead._id,
              field: "rapport",
              leadName: `${existingLead.prenom} ${existingLead.nom}`,
              oldValue: oldStatus,
              newValue: newStatus,
              action: "removed_from_campaigns",
              timestamp: new Date(),
            });

            console.log(
              `Lead ${existingLead.ref} retiré des campagnes actives`,
            );
          } else {
            changes.push({
              leadRef: existingLead.ref,
              leadId: existingLead._id,
              leadName: `${existingLead.prenom} ${existingLead.nom}`,
              field: "rapport",
              oldValue: oldStatus,
              newValue: newStatus,
              action: "updated",
              timestamp: new Date(),
            });
          }

          existingLead.statusHistory.push({
            oldStatus,
            newStatus,
            changedAt: new Date(),
            importId,
            source: "import",
          });
        }
      }
    }

    if (hasChanged) {
      Object.assign(existingLead, newData);
      existingLead.lastImportedAt = new Date();
      existingLead.lastImportId = importId;
      existingLead.importCount = (existingLead.importCount || 0) + 1;
      await existingLead.save();
    }

    return hasChanged;
  }

  private static async removeLeadFromActiveCampaigns(
    leadId: mongoose.Types.ObjectId,
    importId: mongoose.Types.ObjectId,
    oldStatus: string,
    newStatus: string,
  ) {
    const campaigns = await Campaign.find({
      "recipients.leadId": leadId,
      "recipients.status": "pending",
      status: { $in: ["draft", "scheduled"] },
    });

    console.log(
      `${campaigns.length} campagne(s) trouvée(s) pour le lead ${leadId}`,
    );

    for (const campaign of campaigns) {
      const recipientIndex = campaign.recipients.findIndex(
        (r) =>
          r.leadId.toString() === leadId.toString() && r.status === "pending",
      );

      if (recipientIndex !== -1) {
        campaign.recipients[recipientIndex].status = "removed";
        campaign.recipients[recipientIndex].removedAt = new Date();
        campaign.recipients[recipientIndex].removeReason = "status_changed";
        campaign.recipients[recipientIndex].removeDetails = {
          importId,
          oldStatus,
          newStatus,
        };
        campaign.removedCount = (campaign.removedCount || 0) + 1;
        await campaign.save();
      }
    }
  }
}
