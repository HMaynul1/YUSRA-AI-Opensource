import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { adminAPI } from '../lib/api'
import { t } from '../lib/i18n'

interface Stats {
  totalUsers: number
  totalSessions: number
  totalMessages: number
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { user, language } = useAppStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [config, setConfig] = useState<Record<string, string>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/')
      return
    }
    loadStats()
    loadConfig()
  }, [user, navigate])

  const loadStats = async () => {
    try {
      const res = await adminAPI.getStats()
      setStats(res.data)
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  const loadConfig = async () => {
    try {
      const res = await adminAPI.getConfig()
      setConfig(res.data)
    } catch (error) {
      console.error('Failed to load config')
    }
  }

  const saveConfig = async (key: string, value: string) => {
    try {
      await adminAPI.updateConfig(key, value)
      setConfig({ ...config, [key]: value })
      setEditingKey(null)
    } catch (error) {
      console.error('Failed to save config')
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{t(language, 'admin')}</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            {t(language, 'back')}
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-6 rounded-lg">
              <h3 className="text-sm font-semibold opacity-70">{t(language, 'users')}</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg">
              <h3 className="text-sm font-semibold opacity-70">{t(language, 'sessions')}</h3>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900 p-6 rounded-lg">
              <h3 className="text-sm font-semibold opacity-70">{t(language, 'messages')}</h3>
              <p className="text-3xl font-bold">{stats.totalMessages}</p>
            </div>
          </div>
        )}

        {/* Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{t(language, 'config')}</h2>

          <div className="space-y-4">
            {[
              { key: 'system_prompt', label: t(language, 'systemPrompt') },
              { key: 'default_model', label: t(language, 'defaultModel') },
              { key: 'creator_name', label: t(language, 'creatorName') },
              { key: 'yusra_backstory', label: t(language, 'yusraBackstory') },
            ].map(({ key, label }) => (
              <div key={key} className="border-b pb-4">
                <label className="block text-sm font-semibold mb-2">{label}</label>
                {editingKey === key ? (
                  <div className="flex gap-2">
                    <textarea
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1 p-2 rounded-lg"
                      rows={3}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => saveConfig(key, editingValue)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        {t(language, 'save')}
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        {t(language, 'cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditingKey(key)
                      setEditingValue(config[key] || '')
                    }}
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <p className="text-sm">{config[key] || '(empty)'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
