import { Router } from 'express'
import {
  getImportHistory,
  getImportById,
  deleteImportHistory,
  getImportStats,
} from '../controllers/history.contoller'

/**
 * ROUTES DE L'HISTORIQUE
 */

const router = Router()

/**
 * @route   GET /api/history/stats
 * @desc    Récupérer les statistiques des imports
 * @access  Public
 */
router.get('/stats', getImportStats)

/**
 * @route   GET /api/history
 * @desc    Récupérer l'historique des imports
 * @access  Public
 */
router.get('/', getImportHistory)

/**
 * @route   GET /api/history/:id
 * @desc    Récupérer un import spécifique
 * @access  Public
 */
router.get('/:id', getImportById)

/**
 * @route   DELETE /api/history/:id
 * @desc    Supprimer un enregistrement d'historique
 * @access  Public
 */
router.delete('/:id', deleteImportHistory)

export default router
