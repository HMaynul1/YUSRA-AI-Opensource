import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Middleware: Check if admin
const isAdmin = (req: AuthRequest, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Get stats
router.get('/stats', isAdmin, async (req: AuthRequest, res) => {
  try {
    const totalUsers = await prisma.user.count()
    const totalSessions = await prisma.chatSession.count()
    const totalMessages = await prisma.message.count()

    res.json({
      totalUsers,
      totalSessions,
      totalMessages,
      timestamp: new Date(),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Get config
router.get('/config', isAdmin, async (req: AuthRequest, res) => {
  try {
    const configs = await prisma.appConfig.findMany()
    const configObj: Record<string, string> = {}
    configs.forEach(c => {
      configObj[c.key] = c.value
    })
    res.json(configObj)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch config' })
  }
})

// Update config
router.post('/config', isAdmin, async (req: AuthRequest, res) => {
  try {
    const { key, value } = req.body
    const config = await prisma.appConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' })
  }
})

// Get all users
router.get('/users', isAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Update user role
router.post('/users/:userId/role', isAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

export default router
