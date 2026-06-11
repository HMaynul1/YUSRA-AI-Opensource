import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { chatAPI, aiAPI } from '../lib/api'
import { t } from '../lib/i18n'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  liked?: boolean
  createdAt: string
}

interface Session {
  id: string
  title: string
  mode: string
  language: string
  model?: string
}

export default function ChatPage() {
  const {
    user,
    logout,
    theme,
    setTheme,
    language,
    setLanguage,
    streaming,
    voiceMode,
    compactBubbles,
    showTimestamps,
    currentSessionId,
    setCurrentSessionId,
    currentMode,
    setCurrentMode,
    selectedModel,
    setSelectedModel,
  } = useAppStore()

  const [sessions, setSessions] = useState<Session[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<string[]>([])
  const [models, setModels] = useState<Record<string, string[]>>({})
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load initial data
  useEffect(() => {
    loadSessions()
    loadProviders()
  }, [])

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages()
    }
  }, [currentSessionId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadSessions = async () => {
    try {
      const res = await chatAPI.getSessions()
      setSessions(res.data)
      if (res.data.length > 0 && !currentSessionId) {
        setCurrentSessionId(res.data[0].id)
      }
    } catch (error) {
      console.error('Failed to load sessions')
    }
  }

  const loadMessages = async () => {
    if (!currentSessionId) return
    try {
      const res = await chatAPI.getMessages(currentSessionId)
      setMessages(res.data)
    } catch (error) {
      console.error('Failed to load messages')
    }
  }

  const loadProviders = async () => {
    try {
      const res = await aiAPI.getProviders()
      setProviders(res.data.providers)
      const modelsRes = await aiAPI.getModels()
      setModels(modelsRes.data)
    } catch (error) {
      console.error('Failed to load providers')
    }
  }

  const createNewSession = async () => {
    try {
      const res = await chatAPI.createSession(
        `Chat - ${new Date().toLocaleTimeString()}`,
        currentMode,
        language,
        selectedModel
      )
      setSessions([res.data, ...sessions])
      setCurrentSessionId(res.data.id)
      setMessages([])
    } catch (error) {
      console.error('Failed to create session')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !currentSessionId || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const provider = providers[0] || 'openai'
      const model = selectedModel || models[provider]?.[0]

      const res = await chatAPI.sendMessage(
        currentSessionId,
        input,
        model,
        provider
      )

      setMessages((prev) => [...prev, res.data.assistantMessage])
    } catch (error: any) {
      console.error('Failed to send message', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error.response?.data?.error || 'Failed to get response'}`,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const startVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.language = language === 'ar' ? 'ar-SA' : language === 'bn' ? 'bn-BD' : 'en-US'
    recognition.start()

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')
      setInput(transcript)
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-2xl"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold">YUSRA AI</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-2xl"
        >
          ⚙️
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 bg-indigo-900 text-white p-4 overflow-y-auto">
            <button
              onClick={createNewSession}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg mb-4"
            >
              {t(language, 'newChat')}
            </button>

            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setCurrentSessionId(session.id)
                    setShowSidebar(false)
                  }}
                  className={`w-full text-left p-2 rounded ${
                    currentSessionId === session.id
                      ? 'bg-indigo-600'
                      : 'hover:bg-indigo-700'
                  }`}
                >
                  {session.title}
                </button>
              ))}
            </div>

            <button
              onClick={logout}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            >
              {t(language, 'logout')}
            </button>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-6xl mb-4">🤖</div>
                  <h2 className="text-2xl font-bold mb-2">{t(language, 'welcome')}</h2>
                  <p className="opacity-70">{t(language, 'description')}</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs ${
                    compactBubbles ? 'py-1 px-3' : 'py-2 px-4'
                  } rounded-lg ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  <p>{message.content}</p>
                  {showTimestamps && (
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-300 text-black py-2 px-4 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 space-y-2">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg resize-none"
                rows={3}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {t(language, 'send')}
                </button>
                <button
                  onClick={startVoiceInput}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  🎤
                </button>
              </div>
            </div>

            {/* Model Selector */}
            <select
              value={selectedModel || ''}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 rounded-lg"
            >
              <option value="">{t(language, 'selectModel')}</option>
              {providers.map((provider) =>
                (models[provider] || []).map((model) => (
                  <option key={model} value={model}>
                    {provider}: {model}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold">{t(language, 'settings')}</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">{t(language, 'theme')}</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full p-2 rounded-lg"
              >
                <option value="dark">{t(language, 'dark')}</option>
                <option value="light">{t(language, 'light')}</option>
                <option value="amoled">{t(language, 'amoled')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t(language, 'language')}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full p-2 rounded-lg"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t(language, 'currentMode')}</label>
              <div className="flex gap-2">
                {(['chat', 'creative', 'expert'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCurrentMode(mode)}
                    className={`flex-1 py-2 rounded-lg ${
                      currentMode === mode
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-300'
                    }`}
                  >
                    {t(language, mode as any)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              {t(language, 'close')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
