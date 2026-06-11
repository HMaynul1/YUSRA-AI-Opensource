import { create } from 'zustand'
import { Language } from '../lib/i18n'

interface User {
  id: string
  email: string
  name?: string
}

interface AppState {
  // Auth
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void

  // UI
  theme: 'dark' | 'light' | 'amoled'
  language: Language
  setTheme: (theme: 'dark' | 'light' | 'amoled') => void
  setLanguage: (language: Language) => void

  // Settings
  streaming: boolean
  safeMode: boolean
  voiceMode: boolean
  compactBubbles: boolean
  showTimestamps: boolean
  voiceSpeed: number
  voicePitch: number
  setStreaming: (value: boolean) => void
  setSafeMode: (value: boolean) => void
  setVoiceMode: (value: boolean) => void
  setCompactBubbles: (value: boolean) => void
  setShowTimestamps: (value: boolean) => void
  setVoiceSpeed: (value: number) => void
  setVoicePitch: (value: number) => void

  // Chat
  currentSessionId: string | null
  currentMode: 'chat' | 'creative' | 'expert'
  selectedModel: string | null
  setCurrentSessionId: (id: string | null) => void
  setCurrentMode: (mode: 'chat' | 'creative' | 'expert') => void
  setSelectedModel: (model: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  token: localStorage.getItem('token'),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  // UI
  theme: (localStorage.getItem('theme') as any) || 'dark',
  language: (localStorage.getItem('language') as Language) || 'en',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  setLanguage: (language) => {
    localStorage.setItem('language', language)
    set({ language })
  },

  // Settings
  streaming: JSON.parse(localStorage.getItem('streaming') ?? 'true'),
  safeMode: JSON.parse(localStorage.getItem('safeMode') ?? 'false'),
  voiceMode: JSON.parse(localStorage.getItem('voiceMode') ?? 'false'),
  compactBubbles: JSON.parse(localStorage.getItem('compactBubbles') ?? 'false'),
  showTimestamps: JSON.parse(localStorage.getItem('showTimestamps') ?? 'true'),
  voiceSpeed: parseFloat(localStorage.getItem('voiceSpeed') ?? '1'),
  voicePitch: parseFloat(localStorage.getItem('voicePitch') ?? '1'),
  setStreaming: (value) => {
    localStorage.setItem('streaming', JSON.stringify(value))
    set({ streaming: value })
  },
  setSafeMode: (value) => {
    localStorage.setItem('safeMode', JSON.stringify(value))
    set({ safeMode: value })
  },
  setVoiceMode: (value) => {
    localStorage.setItem('voiceMode', JSON.stringify(value))
    set({ voiceMode: value })
  },
  setCompactBubbles: (value) => {
    localStorage.setItem('compactBubbles', JSON.stringify(value))
    set({ compactBubbles: value })
  },
  setShowTimestamps: (value) => {
    localStorage.setItem('showTimestamps', JSON.stringify(value))
    set({ showTimestamps: value })
  },
  setVoiceSpeed: (value) => {
    localStorage.setItem('voiceSpeed', value.toString())
    set({ voiceSpeed: value })
  },
  setVoicePitch: (value) => {
    localStorage.setItem('voicePitch', value.toString())
    set({ voicePitch: value })
  },

  // Chat
  currentSessionId: null,
  currentMode: 'chat',
  selectedModel: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setCurrentMode: (mode) => set({ currentMode: mode }),
  setSelectedModel: (model) => set({ selectedModel: model }),
}))
