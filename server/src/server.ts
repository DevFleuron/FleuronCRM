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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://fleuroncrm.netlify.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion MongoDB
connectDB();

// Routes
app.use("/api/import", importRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/templates", templateRoutes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "FleuronCRM API Running 🚀" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

export default app;
