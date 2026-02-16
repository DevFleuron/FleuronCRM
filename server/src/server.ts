import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

// Routes
import importRoutes from "./routes/import.routes";
import leadRoutes from "./routes/leads.routes";
import campaignRoutes from "./routes/campaign.routes";
import historyRoutes from "./routes/history.routes";
import webhookRoutes from "./routes/brevo.routes";
import templateRoutes from "./routes/template.routes";
import statsRoutes from "./routes/stats.routes";
import sequenceRoutes from "./routes/sequence.routes";
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
      ];

      // Autoriser les requêtes sans origin (comme Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("CORS bloqué pour:", origin);
        callback(null, true); // En dev, on autorise quand même
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion MongoDB
connectDB();

// Démarrer le worker de séquences
runSequenceWorker();

// Routes
app.use("/api/import", importRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/sequences", sequenceRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
});

export default app;
