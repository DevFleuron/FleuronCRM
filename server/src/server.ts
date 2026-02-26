import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./config/database";
import { authMiddleware } from "./middleware/auth.middleware";

// Routes
import authRoutes from "./routes/auth.routes";
import importRoutes from "./routes/import.routes";
import leadRoutes from "./routes/leads.routes";
import campaignRoutes from "./routes/campaign.routes";
import historyRoutes from "./routes/history.routes";
import webhookRoutes from "./routes/brevo.routes";
import templateRoutes from "./routes/template.routes";
import statsRoutes from "./routes/stats.routes";
import sequenceRoutes from "./routes/sequence.routes";
import testRoutes from "./routes/test.routes";
import uploadRoutes from "./routes/upload.routes";
import { runSequenceWorker } from "./workers/sequence.worker";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.128:3000",
        "https://crm.fleuronindustries.fr",
      ];

      // Autoriser les requêtes sans origin (comme Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("⚠️ CORS bloqué pour:", origin);
        callback(null, process.env.NODE_ENV === "development");
      }
    },
    credentials: true, //  Important pour les cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connexion MongoDB
connectDB();

// Démarrer le worker de séquences
runSequenceWorker();

//  Routes publiques (pas d'auth requise)
app.use("/api/auth", authRoutes);
app.use("/api/webhooks", webhookRoutes); // Webhooks Brevo (pas d'auth)

//  Routes protégées (auth requise)
app.use("/api/import", authMiddleware, importRoutes);
app.use("/api/leads", authMiddleware, leadRoutes);
app.use("/api/campaigns", authMiddleware, campaignRoutes);
app.use("/api/history", authMiddleware, historyRoutes);
app.use("/api/templates", authMiddleware, templateRoutes);
app.use("/api/stats", authMiddleware, statsRoutes);
app.use("/api/sequences", authMiddleware, sequenceRoutes);
app.use("/api/test", authMiddleware, testRoutes);
app.use("/api/upload", authMiddleware, uploadRoutes);

//  Fichiers statiques (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
});

export default app;
