/**
 * TYPES UTILITAIRES
 * Fichier contenant des types réutilisables
 */

/**
 * Réponse standard de l'API
 */
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Réponse avec pagination
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page?: number
  limit?: number
}

/**
 * Options de recherche
 */
export interface SearchOptions extends PaginationOptions {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Statistiques génériques
 */
export interface Stats {
  total: number
  [key: string]: number
}

/**
 * Type pour les statuts de lead
 */
export type LeadStatus = 'nouveau' | 'contacte' | 'converti' | 'perdu'

/**
 * Type pour les statuts d'import
 */
export type ImportStatus = 'en_cours' | 'termine' | 'echec'

/**
 * Filtre de recherche de leads
 */
export interface LeadFilter extends SearchOptions {
  statut?: LeadStatus
}

/**
 * Classe pour les erreurs personnalisées
 */
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
