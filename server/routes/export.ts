import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Export chat as JSON
router.get('/sessions/:sessionId/export/json', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session || session.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Session not found' })
    }

    const exportData = {
      session: {
        id: session.id,
        title: session.title,
        mode: session.mode,
        language: session.language,
        model: session.model,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      messages: session.messages,
      exportedAt: new Date(),
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="chat-${sessionId}.json"`)
    res.json(exportData)
  } catch (error) {
    res.status(500).json({ error: 'Export failed' })
  }
})

// Export chat as CSV
router.get('/sessions/:sessionId/export/csv', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session || session.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Session not found' })
    }

    let csv = 'Timestamp,Role,Message\n'

    session.messages.forEach(msg => {
      const timestamp = new Date(msg.createdAt).toISOString()
      const role = msg.role
      const content = `"${msg.content.replace(/"/g, '""')}"` // Escape quotes

      csv += `${timestamp},${role},${content}\n`
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="chat-${sessionId}.csv"`)
    res.send(csv)
  } catch (error) {
    res.status(500).json({ error: 'Export failed' })
  }
})

// Export chat as Markdown
router.get('/sessions/:sessionId/export/md', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session || session.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Session not found' })
    }

    let markdown = `# ${session.title}\n\n`
    markdown += `**Mode**: ${session.mode} | **Language**: ${session.language} | **Model**: ${session.model}\n\n`
    markdown += `**Created**: ${new Date(session.createdAt).toLocaleString()}\n\n`
    markdown += `---\n\n`

    session.messages.forEach(msg => {
      const timestamp = new Date(msg.createdAt).toLocaleTimeString()
      const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant'
      markdown += `### ${role} - ${timestamp}\n\n${msg.content}\n\n---\n\n`
    })

    res.setHeader('Content-Type', 'text/markdown')
    res.setHeader('Content-Disposition', `attachment; filename="chat-${sessionId}.md"`)
    res.send(markdown)
  } catch (error) {
    res.status(500).json({ error: 'Export failed' })
  }
})

// Export all sessions
router.get('/export/all', async (req: AuthRequest, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user!.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const exportData = {
      user: {
        id: req.user!.id,
        email: req.user!.email,
      },
      sessions: sessions.map(session => ({
        session: {
          id: session.id,
          title: session.title,
          mode: session.mode,
          language: session.language,
          model: session.model,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        },
        messages: session.messages,
      })),
      exportedAt: new Date(),
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="yusra-ai-export-${Date.now()}.json"`)
    res.json(exportData)
  } catch (error) {
    res.status(500).json({ error: 'Export failed' })
  }
})

export default router
