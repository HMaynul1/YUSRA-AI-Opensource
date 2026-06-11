import axios from 'axios'

export type AIProvider = 
  | 'openai' 
  | 'gemini' 
  | 'claude' 
  | 'mistral' 
  | 'groq' 
  | 'cohere' 
  | 'perplexity' 
  | 'together' 
  | 'huggingface' 
  | 'deepseek'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class AIService {
  private apiKeys = {
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    claude: process.env.ANTHROPIC_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    groq: process.env.GROQ_API_KEY,
    cohere: process.env.COHERE_API_KEY,
    perplexity: process.env.PERPLEXITY_API_KEY,
    together: process.env.TOGETHER_API_KEY,
    huggingface: process.env.HUGGINGFACE_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
  }

  getAvailableProviders(): AIProvider[] {
    return (Object.entries(this.apiKeys) as [AIProvider, string | undefined][])
      .filter(([_, key]) => key)
      .map(([provider, _]) => provider)
  }

  async chat(
    provider: AIProvider,
    messages: Message[],
    model?: string,
    temperature: number = 0.7
  ): Promise<string> {
    const apiKey = this.apiKeys[provider]
    if (!apiKey) {
      throw new Error(`API key not configured for ${provider}`)
    }

    switch (provider) {
      case 'openai':
        return this.openaiChat(apiKey, messages, model || 'gpt-3.5-turbo', temperature)
      case 'gemini':
        return this.geminiChat(apiKey, messages, model || 'gemini-pro', temperature)
      case 'claude':
        return this.claudeChat(apiKey, messages, model || 'claude-3-sonnet-20240229', temperature)
      case 'mistral':
        return this.mistralChat(apiKey, messages, model || 'mistral-medium', temperature)
      case 'groq':
        return this.groqChat(apiKey, messages, model || 'mixtral-8x7b-32768', temperature)
      case 'cohere':
        return this.cohereChat(apiKey, messages, model || 'command-r', temperature)
      case 'perplexity':
        return this.perplexityChat(apiKey, messages, model || 'pplx-7b-online', temperature)
      case 'together':
        return this.togetherChat(apiKey, messages, model || 'meta-llama/Llama-2-70b-chat-hf', temperature)
      case 'huggingface':
        return this.huggingfaceChat(apiKey, messages, model || 'meta-llama/Llama-2-70b-chat-hf', temperature)
      case 'deepseek':
        return this.deepseekChat(apiKey, messages, model || 'deepseek-chat', temperature)
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  private async openaiChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages,
      temperature,
      max_tokens: 2000,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.choices[0].message.content
  }

  private async geminiChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature },
      }
    )
    return response.data.candidates[0].content.parts[0].text
  }

  private async claudeChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model,
      max_tokens: 2000,
      messages: messages.filter(m => m.role !== 'system'),
      system: messages.find(m => m.role === 'system')?.content,
      temperature,
    }, {
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    })
    return response.data.content[0].text
  }

  private async mistralChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model,
      messages,
      temperature,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.choices[0].message.content
  }

  private async groqChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model,
      messages,
      temperature,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.choices[0].message.content
  }

  private async cohereChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const userMessage = messages[messages.length - 1]?.content || ''
    const response = await axios.post('https://api.cohere.ai/v1/chat', {
      message: userMessage,
      model,
      temperature,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.text
  }

  private async perplexityChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model,
      messages,
      temperature,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.choices[0].message.content
  }

  private async togetherChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
      model,
      messages,
      temperature,
      max_tokens: 2000,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.choices[0].message.content
  }

  private async huggingfaceChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        parameters: { temperature, max_length: 2000 },
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      }
    )
    return response.data[0]?.generated_text || ''
  }

  private async deepseekChat(apiKey: string, messages: Message[], model: string, temperature: number): Promise<string> {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model,
      messages,
      temperature,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
    return response.data.choices[0].message.content
  }
}

export const aiService = new AIService()
