import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiProvider'

const router = Router()
const prisma = new PrismaClient()

// Create session
router.post('/sessions', async (req: AuthRequest, res) => {
  try {
    const { title, mode = 'chat', language = 'en', model } = req.body
    const session = await prisma.chatSession.create({
      data: {
        userId: req.user!.id,
        title: title || 'New Chat',
        mode,
        language,
        model,
      },
    })
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// Get sessions
router.get('/sessions', async (req: AuthRequest, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

// Get session messages
router.get('/sessions/:sessionId/messages', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Send message
router.post('/sessions/:sessionId/messages', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params
    const { content, model, provider = 'openai' } = req.body

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        sessionId,
        userId: req.user!.id,
        role: 'user',
        content,
        model,
      },
    })

    // Get session for system prompt
    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    // Get chat history
    const history = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: -20, // Last 20 messages
    })

    // Build system prompt based on mode
    let systemPrompt = `You are YUSRA, a virtual clone of Ezreen Al YUSRA, daughter of Mohammad Maynul Hasan Shaon.`
    
    if (session.mode === 'creative') {
      systemPrompt += ` You are in Creative mode - be imaginative, playful, and generate creative content.`
    } else if (session.mode === 'expert') {
      systemPrompt += ` You are in Expert mode - provide detailed, technical, and authoritative responses.`
    }

    // Call AI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const reply = await aiService.chat(provider as any, messages, model)

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        sessionId,
        userId: req.user!.id,
        role: 'assistant',
        content: reply,
        model,
      },
    })

    res.json({
      userMessage,
      assistantMessage,
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message || 'Failed to send message' })
  }
})

// Delete session
router.delete('/sessions/:sessionId', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params
    await prisma.chatSession.delete({ where: { id: sessionId } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' })
  }
})

// Like message
router.post('/messages/:messageId/like', async (req: AuthRequest, res) => {
  try {
    const { messageId } = req.params
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { liked: true },
    })
    res.json(message)
  } catch (error) {
    res.status(500).json({ error: 'Failed to like message' })
  }
})

export default router
