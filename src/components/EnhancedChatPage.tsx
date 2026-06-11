import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { chatAPI, aiAPI } from '../lib/api'
import { t } from '../lib/i18n'
import { renderMarkdown } from '../lib/markdown'
import { TTSService } from '../lib/tts'
import { ShortcutManager, defaultShortcuts } from '../lib/shortcuts'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  liked?: boolean
  reactions?: Record<string, number>
  createdAt: string
}

interface Session {
  id: string
  title: string
  mode: string
  language: string
  model?: string
}

export default function EnhancedChatPage() {
  const {
    user,
    logout,
    theme,
    setTheme,
    language,
    setLanguage,
    currentSessionId,
    setCurrentSessionId,
    currentMode,
    setCurrentMode,
    selectedModel,
    setSelectedModel,
    voiceSpeed,
    voicePitch,
  } = useAppStore()

  const [sessions, setSessions] = useState<Session[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [providers, setProviders] = useState<string[]>([])
  const [models, setModels] = useState<Record<string, string[]>>({})
  const [showSettings, setShowSettings] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shortcutManager = useRef(new ShortcutManager())

  // Initialize shortcuts
  useEffect(() => {
    shortcutManager.current.register({
      ...defaultShortcuts.newChat,
      handler: createNewSession,
    })
    shortcutManager.current.register({
      ...defaultShortcuts.send,
      handler: sendMessage,
    })
    shortcutManager.current.register({
      ...defaultShortcuts.search,
      handler: () => setShowSearch(!showSearch),
    })
    shortcutManager.current.register({
      ...defaultShortcuts.focusInput,
      handler: () => document.getElementById('chat-input')?.focus(),
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcutManager.current.handleKeyDown(e)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load initial data
  useEffect(() => {
    loadSessions()
    loadProviders()
    loadUserProfile()
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
  }, [messages, streamingContent])

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

  const loadUserProfile = async () => {
    try {
      const profileRes = await fetch('/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      const statsRes = await fetch('/api/profiles/me/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      setUserProfile(await profileRes.json())
      setUserStats(await statsRes.json())
    } catch (error) {
      console.error('Failed to load profile')
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
      setStreamingContent('')
    } catch (error) {
      console.error('Failed to create session')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !currentSessionId || loading || streaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)
    setStreaming(true)
    setStreamingContent('')

    try {
      const provider = providers[0] || 'openai'
      const model = selectedModel || models[provider]?.[0]

      // Use streaming if available
      const eventSource = new EventSource(
        `/api/chat/stream?sessionId=${currentSessionId}&content=${encodeURIComponent(input)}&model=${model}&provider=${provider}`
      )

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.token && data.token !== '[DONE]') {
          setStreamingContent((prev) => prev + data.token)
        }
      }

      eventSource.onerror = () => {
        eventSource.close()
        setStreaming(false)
        setLoading(false)

        if (streamingContent) {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: streamingContent,
            createdAt: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          setStreamingContent('')

          // Auto-read if voice mode enabled
          if (useAppStore.getState().voiceMode) {
            TTSService.speak({
              text: streamingContent,
              language,
              rate: voiceSpeed,
              pitch: voicePitch,
            })
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to send message', error)
      setStreaming(false)
      setLoading(false)
    }
  }

  const searchMessages = async () => {
    if (!searchQuery.trim()) return
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&sessionId=${currentSessionId || ''}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        }
      )
      const data = await res.json()
      setSearchResults(data.results)
    } catch (error) {
      console.error('Search failed')
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      })
      const data = await res.json()
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, reactions: data.reactions } : msg
        )
      )
    } catch (error) {
      console.error('Failed to add reaction')
    }
  }

  const exportChat = async (format: 'json' | 'csv' | 'md') => {
    if (!currentSessionId) return
    try {
      const url = `/api/sessions/${currentSessionId}/export/${format}`
      window.open(url, '_blank')
    } catch (error) {
      console.error('Export failed')
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-2xl">
          ☰
        </button>
        <h1 className="text-xl font-bold">YUSRA AI</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowSearch(!showSearch)} className="text-xl">
            🔍
          </button>
          <button onClick={() => setShowProfile(!showProfile)} className="text-xl">
            👤
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="text-xl">
            ⚙️
          </button>
        </div>
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
                  className={`w-full text-left p-2 rounded truncate ${
                    currentSessionId === session.id ? 'bg-indigo-600' : 'hover:bg-indigo-700'
                  }`}
                  title={session.title}
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
            {messages.length === 0 && streamingContent === '' && (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-6xl mb-4">🤖</div>
                  <h2 className="text-2xl font-bold mb-2">{t(language, 'welcome')}</h2>
                  <p className="opacity-70">I am YUSRA, a virtual clone of Ezreen Al YUSRA</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs py-2 px-4 rounded-lg ${
                    message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
                  <div className="flex gap-2 mt-2 text-xs">
                    {['👍', '❤️', '😂', '🔥'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(message.id, emoji)}
                        className="hover:scale-125 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {message.reactions && Object.entries(message.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1 text-xs">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="bg-white bg-opacity-20 px-2 py-1 rounded">
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-xs py-2 px-4 rounded-lg bg-gray-300 text-black">
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingContent) }} />
                </div>
              </div>
            )}

            {loading && !streamingContent && (
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
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Type your message... (Ctrl+Enter to send)"
                className="flex-1 p-2 rounded-lg resize-none"
                rows={3}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={sendMessage}
                  disabled={loading || streaming}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {t(language, 'send')}
                </button>
                <button
                  onClick={() => exportChat('json')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  📥 Export
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

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold">🔍 Search</h2>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded-lg"
            />
            <button
              onClick={searchMessages}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Search
            </button>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((msg) => (
                <div key={msg.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm font-semibold">{msg.role}</p>
                  <p className="text-sm">{msg.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && userProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold">👤 Profile</h2>
            <div>
              <p className="font-semibold">{userProfile.name}</p>
              <p className="text-sm opacity-70">{userProfile.email}</p>
            </div>
            {userStats && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded">
                  <p className="text-sm opacity-70">Sessions</p>
                  <p className="text-2xl font-bold">{userStats.totalSessions}</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded">
                  <p className="text-sm opacity-70">Messages</p>
                  <p className="text-2xl font-bold">{userStats.totalMessages}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowProfile(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4 max-h-96 overflow-y-auto">
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

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
