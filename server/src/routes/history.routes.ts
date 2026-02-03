import { Router } from 'express'
import {
  getImportHistory,
  getImportById,
  deleteImportHistory,
  getImportStats,
} from '../controllers/history.contoller'

const router = Router()
router.get('/stats', getImportStats)
router.get('/', getImportHistory)
router.get('/:id', getImportById)
router.delete('/:id', deleteImportHistory)

export default router
