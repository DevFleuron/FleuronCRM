import { Request, Response } from "express";
import Template from "../models/Template.model";

/**
 GET /api/templates
 Récupérer tous les templates
 */
export const getTemplates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type } = req.query;

    const filter: any = {};
    if (type) filter.type = type;

    const templates = await Template.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error: any) {
    console.error("Erreur getTemplates:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des templates",
      error: error.message,
    });
  }
};

/**
 POST /api/templates
 Créer un nouveau template
 */
export const createTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, type, subject, content, ctaText, ctaUrl, attachment } =
      req.body; // ✅ Ajouter ctaText, ctaUrl, attachment

    if (!name || !type || !content) {
      res.status(400).json({
        success: false,
        message: "Données manquantes",
      });
      return;
    }

    // Extraire les variables du contenu
    const regex = /{{(\w+)}}/g;
    const matches = content.matchAll(regex);
    const variables = Array.from(
      new Set(Array.from(matches, (m: any) => m[1])),
    );

    const template = await Template.create({
      name,
      type,
      subject,
      content,
      variables,
      ctaText,
      ctaUrl,
      attachment,
      usageCount: 0,
    });

    res.status(201).json({
      success: true,
      message: "Template créé avec succès",
      data: template,
    });
  } catch (error: any) {
    console.error("Erreur createTemplate:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du template",
      error: error.message,
    });
  }
};

/**
 PUT /api/templates/:id
 Mettre à jour un template
 */
export const updateTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, type, subject, content, ctaText, ctaUrl, attachment } =
      req.body; // ✅ Ajouter

    const template = await Template.findById(id);

    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template non trouvé",
      });
      return;
    }

    // Extraire les variables si le contenu a changé
    if (content) {
      const regex = /{{(\w+)}}/g;
      const matches = content.matchAll(regex);
      template.variables = Array.from(
        new Set(Array.from(matches, (m: any) => m[1])),
      );
    }

    template.name = name || template.name;
    template.type = type || template.type;
    template.subject = subject !== undefined ? subject : template.subject;
    template.content = content || template.content;
    template.ctaText = ctaText !== undefined ? ctaText : template.ctaText; // ✅ Ajouter
    template.ctaUrl = ctaUrl !== undefined ? ctaUrl : template.ctaUrl; // ✅ Ajouter
    template.attachment =
      attachment !== undefined ? attachment : template.attachment; // ✅ Ajouter

    await template.save();

    res.status(200).json({
      success: true,
      message: "Template mis à jour avec succès",
      data: template,
    });
  } catch (error: any) {
    console.error("Erreur updateTemplate:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du template",
      error: error.message,
    });
  }
};

/**
 DELETE /api/templates/:id
 Supprimer un template
 */
export const deleteTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const template = await Template.findByIdAndDelete(id);

    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template non trouvé",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Template supprimé avec succès",
    });
  } catch (error: any) {
    console.error("Erreur deleteTemplate:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du template",
      error: error.message,
    });
  }
};
