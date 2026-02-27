import { Request, Response } from "express";
import ImportHistory from "../models/ImportHistory.model";

/*
GET /api/history
Récupérer l'historique des imports
 */
export const getImportHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const history = await ImportHistory.find()
      .sort({ dateImport: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await ImportHistory.countDocuments();

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    console.error("Erreur getImportHistory:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'historique",
      error: error.message,
    });
  }
};

/*
 GET /api/history/:id
 Récupérer un import spécifique avec tous les détails
 */
export const getImportHistoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const history = await ImportHistory.findById(id);

    if (!history) {
      res.status(404).json({
        success: false,
        message: "Import non trouvé",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("Erreur getImportHistoryById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'import",
      error: error.message,
    });
  }
};
