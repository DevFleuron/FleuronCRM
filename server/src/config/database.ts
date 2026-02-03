import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

/**
 * Connexion à MongoDB Atlas
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI n'est pas défini dans le fichier .env");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ Connexion à MongoDB Atlas réussie");

    // Événements de connexion
    mongoose.connection.on("connected", () => {
      console.log("🔗 Mongoose connecté à MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Erreur de connexion Mongoose:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Mongoose déconnecté de MongoDB");
    });

    // Fermeture propre
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 Connexion MongoDB fermée");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB:", error);
    process.exit(1);
  }
};

/**
 * Fermeture de la connexion
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("✅ Connexion MongoDB fermée");
  } catch (error) {
    console.error("❌ Erreur lors de la fermeture:", error);
    throw error;
  }
};
