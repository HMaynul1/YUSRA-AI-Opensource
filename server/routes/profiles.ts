import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get user profile
router.get('/profiles/me', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update user profile
router.put('/profiles/me', async (req: AuthRequest, res) => {
  try {
    const { name, bio, avatar } = req.body

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get user statistics
router.get('/profiles/me/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const sessionCount = await prisma.chatSession.count({
      where: { userId },
    })

    const messageCount = await prisma.message.count({
      where: { userId },
    })

    const firstSession = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    })

    const lastMessage = await prisma.message.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    })

    res.json({
      totalSessions: sessionCount,
      totalMessages: messageCount,
      memberSince: firstSession?.createdAt,
      lastActive: lastMessage?.createdAt,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Get public profile
router.get('/profiles/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

export default router
