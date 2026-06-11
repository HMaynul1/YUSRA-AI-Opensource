import { Router } from 'express'
import { aiService } from '../services/aiProvider'
import multer from 'multer'
import axios from 'axios'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Get available AI providers
router.get('/providers', (req, res) => {
  const providers = aiService.getAvailableProviders()
  res.json({
    providers,
    count: providers.length,
  })
})

// Get available models for each provider
router.get('/models', (req, res) => {
  const models: Record<string, string[]> = {
    openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    mistral: ['mistral-large', 'mistral-medium', 'mistral-small'],
    groq: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
    cohere: ['command-r', 'command-r-plus', 'command-nightly'],
    perplexity: ['pplx-7b-online', 'pplx-70b-online'],
    together: ['meta-llama/Llama-2-70b-chat-hf', 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'],
    huggingface: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mistral-7B-Instruct-v0.1'],
    deepseek: ['deepseek-chat', 'deepseek-coder'],
  }
  res.json(models)
})

// Transcribe audio (Whisper via OpenAI)
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(400).json({ error: 'Whisper API key not configured' })
    }

    const formData = new FormData()
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname)
    formData.append('model', 'whisper-1')
    formData.append('language', req.body.language || 'en')

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders?.(),
      },
    })

    res.json({
      text: response.data.text,
      language: response.data.language,
    })
  } catch (error: any) {
    console.error('Transcription error:', error)
    res.status(500).json({ error: error.message || 'Transcription failed' })
  }
})

export default router
