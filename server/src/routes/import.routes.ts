import { Router } from 'express'
import { upload } from '../config/multer'
import { importCSV, downloadTemplate } from '../controllers/import.controller'

/**
 * ROUTES D'IMPORT CSV
 */

const router = Router()

/**
 * @route   POST /api/import/csv
 * @desc    Importer un fichier CSV
 * @access  Public
 *
 * upload.single('file') est un middleware Multer
 * - 'file' est le nom du champ dans le formulaire
 * - Il traite l'upload et met le fichier dans req.file
 */
router.post('/csv', upload.single('file'), importCSV)

/**
 * @route   GET /api/import/template
 * @desc    Télécharger un fichier template CSV
 * @access  Public
 */
router.get('/template', downloadTemplate)

export default router
