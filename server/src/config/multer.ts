import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    const basename = path.basename(file.originalname, extension)
    cb(null, `${basename}-${uniqueSuffix}${extension}`)
  },
})

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Vérifie l'extension du fichier
  const allowedExtensions = ['.csv']
  const extension = path.extname(file.originalname).toLowerCase()

  if (allowedExtensions.includes(extension)) {
    cb(null, true) // Fichier accepté
  } else {
    cb(new Error('Seuls les fichiers CSV sont acceptés'))
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`🗑️ Fichier supprimé: ${filePath}`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du fichier:', error)
  }
}
