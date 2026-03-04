import { Router } from "express";
import User from "../models/User.model";
import jwt from "jsonwebtoken";
import {
  authMiddleware,
  adminMiddleware,
  AuthRequest,
} from "../middleware/auth.middleware";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "votre-secret-super-securise-a-changer";

/**
 * POST /api/auth/login
 * Connexion
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Créer JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Envoyer cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

/**
 * POST /api/auth/logout
 * Déconnexion
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

/**
 * GET /api/auth/me
 * Récupérer l'utilisateur connecté
 */
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

/**
 * GET /api/auth/users
 * Liste des utilisateurs (admin only)
 */
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
      res.json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

/**
 * POST /api/auth/users
 * Créer un utilisateur (admin only)
 */
router.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Email, mot de passe et nom requis",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }

      const user = await User.create({
        email,
        password,
        name,
        role: role || "user",
      });

      res.status(201).json({
        success: true,
        message: "Utilisateur créé avec succès",
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

/**
 * DELETE /api/auth/users/:id
 * Supprimer un utilisateur (admin only)
 */
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Empêcher la suppression de son propre compte
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Vous ne pouvez pas supprimer votre propre compte",
        });
      }

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      res.json({
        success: true,
        message: "Utilisateur supprimé",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

export default router;
