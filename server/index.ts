import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import aiRoutes from './routes/ai'
import adminRoutes from './routes/admin'
import { authMiddleware } from './middleware/auth'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes
app.use('/api/chat', authMiddleware, chatRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.use('/api/admin', authMiddleware, adminRoutes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})

export { app, prisma }
