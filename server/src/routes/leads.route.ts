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

console.log('📦 lead.routes.ts - Chargement du fichier...')

/**
 * ROUTES DES LEADS
 */

const router = Router()

// Middleware de log pour déboguer
router.use((req, res, next) => {
  console.log(`🔀 lead.routes - ${req.method} ${req.path} - Body:`, req.body)
  next()
})

/**
 * @route   GET /api/leads/stats
 * @desc    Récupérer les statistiques des leads
 * @access  Public
 */
router.get('/stats', (req, res) => {
  console.log('📊 Route /stats déclenchée')
  getLeadsStats(req, res)
})

/**
 * @route   GET /api/leads/ref/:ref
 * @desc    Récupérer un lead par sa référence
 * @access  Public
 */
router.get('/ref/:ref', (req, res) => {
  console.log('🔍 Route /ref/:ref déclenchée')
  getLeadByRef(req, res)
})

/**
 * @route   GET /api/leads
 * @desc    Récupérer tous les leads (avec pagination et filtres)
 * @access  Public
 */
router.get('/', (req, res) => {
  console.log('📋 Route GET / déclenchée')
  getAllLeads(req, res)
})

/**
 * @route   GET /api/leads/:id
 * @desc    Récupérer un lead spécifique par ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  console.log('🔍 Route GET /:id déclenchée')
  getLeadById(req, res)
})

/**
 * @route   POST /api/leads
 * @desc    Créer un nouveau lead
 * @access  Public
 */
router.post('/', (req, res) => {
  console.log('➕ Route POST / déclenchée')
  console.log('📦 Body:', req.body)
  createLead(req, res)
})

/**
 * @route   PUT /api/leads/:id
 * @desc    Mettre à jour un lead
 * @access  Public
 */
router.put('/:id', (req, res) => {
  console.log('✏️ Route PUT /:id déclenchée')
  updateLead(req, res)
})

/**
 * @route   DELETE /api/leads/:id
 * @desc    Supprimer un lead
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  console.log('🗑️ Route DELETE /:id déclenchée')
  deleteLead(req, res)
})

/**
 * @route   PATCH /api/leads/:id/sms
 * @desc    Marquer un SMS comme envoyé
 * @access  Public
 */
router.patch('/:id/sms', (req, res) => {
  console.log('📱 Route PATCH /:id/sms déclenchée')
  markSmsAsSent(req, res)
})

/**
 * @route   PATCH /api/leads/:id/email
 * @desc    Marquer un email comme envoyé
 * @access  Public
 */
router.patch('/:id/email', (req, res) => {
  console.log('📧 Route PATCH /:id/email déclenchée')
  markEmailAsSent(req, res)
})

console.log('✅ lead.routes.ts - Routes configurées')

export default router
