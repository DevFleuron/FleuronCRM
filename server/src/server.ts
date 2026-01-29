import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'

// Import des routes
import leadRoutes from './routes/history.routes'
import importRoutes from './routes/import.routes'
import historyRoutes from './routes/history.routes'

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: '✅ API Leads - Serveur fonctionnel',
    version: '1.0.0',
    endpoints: {
      leads: '/api/leads',
      import: '/api/import',
      history: '/api/history',
    },
  })
})

app.use('/api/leads', leadRoutes)
app.use('/api/import', importRoutes)
app.use('/api/history', historyRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur serveur:', err)

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

app.listen(PORT, () => {
  console.log(`Serveur démarré avec succès : http://localhost:${PORT}/api`)
})

process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Erreur non gérée:', err)
  process.exit(1)
})
