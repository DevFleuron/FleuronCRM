import { Router } from 'express'
import {
  getAllLeads,
  getLeadById,
  getLeadByRef,
  createLead,
  updateLead,
  deleteLead,
  getLeadsStats,
  markSmsAsSent,
  markEmailAsSent,
} from '../controllers/lead.controller'

/**
 * ROUTES DES LEADS
 */

const router = Router()

/**
 * @route   GET /api/leads/stats
 * @desc    Récupérer les statistiques des leads
 * @access  Public
 */
router.get('/stats', getLeadsStats)

/**
 * @route   GET /api/leads/ref/:ref
 * @desc    Récupérer un lead par sa référence
 * @access  Public
 */
router.get('/ref/:ref', getLeadByRef)

/**
 * @route   GET /api/leads
 * @desc    Récupérer tous les leads (avec pagination et filtres)
 * @access  Public
 */
router.get('/', getAllLeads)

/**
 * @route   GET /api/leads/:id
 * @desc    Récupérer un lead spécifique par ID
 * @access  Public
 */
router.get('/:id', getLeadById)

/**
 * @route   POST /api/leads
 * @desc    Créer un nouveau lead
 * @access  Public
 */
router.post('/', createLead)

/**
 * @route   PUT /api/leads/:id
 * @desc    Mettre à jour un lead
 * @access  Public
 */
router.put('/:id', updateLead)

/**
 * @route   DELETE /api/leads/:id
 * @desc    Supprimer un lead
 * @access  Public
 */
router.delete('/:id', deleteLead)

/**
 * @route   PATCH /api/leads/:id/sms
 * @desc    Marquer un SMS comme envoyé
 * @access  Public
 */
router.patch('/:id/sms', markSmsAsSent)

/**
 * @route   PATCH /api/leads/:id/email
 * @desc    Marquer un email comme envoyé
 * @access  Public
 */
router.patch('/:id/email', markEmailAsSent)

export default router
