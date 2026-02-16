import { Request, Response } from "express";
import { StatsService } from "../services/stats.service";

/*
 GET /api/stats/dashboard
 Récupérer toutes les stats pour le dashboard
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("Chargement stats dashboard...");

    // Utiliser le StatsService qui calcule TOUTES les stats correctement
    const result = await StatsService.getDashboardStats();

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
    console.error("Erreur getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};
