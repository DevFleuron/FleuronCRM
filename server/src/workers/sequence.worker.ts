import { SequenceService } from "../services/sequence.service";

/*
 Worker qui s'exécute toutes les minutes
 pour vérifier et exécuter les actions programmées
 */
export async function runSequenceWorker() {
  console.log("Sequence Worker démarré - Vérification toutes les minutes");

  // Exécuter immédiatement au démarrage
  await SequenceService.executeScheduledActions();

  // Puis toutes les minutes
  setInterval(async () => {
    await SequenceService.executeScheduledActions();
  }, 60 * 1000);
}
