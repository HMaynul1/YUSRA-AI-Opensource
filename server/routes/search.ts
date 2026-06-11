import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Search messages
router.get('/search', async (req: AuthRequest, res) => {
  try {
    const { q, sessionId, startDate, endDate, limit = 50 } = req.query

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' })
    }

    const where: any = {
      userId: req.user!.id,
      content: {
        contains: q,
        mode: 'insensitive',
      },
    }

    if (sessionId && typeof sessionId === 'string') {
      where.sessionId = sessionId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string)
      }
    }

    const messages = await prisma.message.findMany({
      where,
      take: Math.min(parseInt(limit as string) || 50, 100),
      orderBy: { createdAt: 'desc' },
      include: {
        session: {
          select: { id: true, title: true },
        },
      },
    })

    res.json({
      query: q,
      count: messages.length,
      results: messages,
    })
  } catch (error) {
    res.status(500).json({ error: 'Search failed' })
  }
})

// Search sessions
router.get('/sessions/search', async (req: AuthRequest, res) => {
  try {
    const { q, limit = 20 } = req.query

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' })
    }

    const sessions = await prisma.chatSession.findMany({
      where: {
        userId: req.user!.id,
        title: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: Math.min(parseInt(limit as string) || 20, 100),
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      query: q,
      count: sessions.length,
      results: sessions,
    })
  } catch (error) {
    res.status(500).json({ error: 'Search failed' })
  }
})

export default router
