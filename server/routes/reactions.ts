import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Add reaction to message
router.post('/messages/:messageId/reactions', async (req: AuthRequest, res) => {
  try {
    const { messageId } = req.params
    const { emoji } = req.body

    if (!emoji || emoji.length > 2) {
      return res.status(400).json({ error: 'Invalid emoji' })
    }

    // For simplicity, store reactions in a JSON field
    // In production, create a separate reactions table
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }

    // Parse existing reactions
    const reactions = message.reactions ? JSON.parse(message.reactions as string) : {}
    reactions[emoji] = (reactions[emoji] || 0) + 1

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        reactions: JSON.stringify(reactions),
      },
    })

    res.json({
      messageId,
      reactions: JSON.parse(updated.reactions as string),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' })
  }
})

// Get message reactions
router.get('/messages/:messageId/reactions', async (req, res) => {
  try {
    const { messageId } = req.params
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { reactions: true },
    })

    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const reactions = message.reactions ? JSON.parse(message.reactions as string) : {}
    res.json(reactions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reactions' })
  }
})

// Remove reaction from message
router.delete('/messages/:messageId/reactions/:emoji', async (req: AuthRequest, res) => {
  try {
    const { messageId, emoji } = req.params

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const reactions = message.reactions ? JSON.parse(message.reactions as string) : {}
    if (reactions[emoji]) {
      reactions[emoji]--
      if (reactions[emoji] <= 0) {
        delete reactions[emoji]
      }
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        reactions: JSON.stringify(reactions),
      },
    })

    res.json({
      messageId,
      reactions: JSON.parse(updated.reactions as string),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove reaction' })
  }
})

export default router
