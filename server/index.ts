import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { PrismaClient } from '@prisma/client'
import getEnv from './config/env'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import aiRoutes from './routes/ai'
import adminRoutes from './routes/admin'
import { authMiddleware } from './middleware/auth'

const app = express()
const prisma = new PrismaClient()

// Get validated environment config
const env = getEnv()
const PORT = env.PORT

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  })
})

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes
app.use('/api/chat', authMiddleware, chatRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.use('/api/admin', authMiddleware, adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  
  // Prisma errors
  if (err.code === 'P1000') {
    return res.status(503).json({
      error: 'Database connection failed',
      message: 'Unable to connect to the database',
    })
  }
  
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Unique constraint violation',
      field: err.meta?.target?.[0],
    })
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
    })
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
    })
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Frontend: ${env.FRONTEND_URL}`)
  console.log(`🔧 Environment: ${env.NODE_ENV}`)
  console.log(`🗄️  Database: Connected`)
})

export { app, prisma, server }
