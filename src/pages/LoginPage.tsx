import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { authAPI } from '../lib/api'
import { t } from '../lib/i18n'

export default function LoginPage() {
  const { setUser, setToken, language } = useAppStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const res = await authAPI.login(email, password)
        setToken(res.data.token)
        setUser(res.data.user)
      } else {
        const res = await authAPI.register(email, password, name)
        setToken(res.data.token)
        setUser(res.data.user)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">YUSRA AI</h1>
          <p className="text-sm opacity-70">{t(language, 'description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder={t(language, 'name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder={t(language, 'email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t(language, 'password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? t(language, 'loading') : (isLogin ? t(language, 'login') : t(language, 'register'))}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isLogin ? t(language, 'dontHaveAccount') : t(language, 'alreadyHaveAccount')}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-indigo-600 hover:underline"
          >
            {isLogin ? t(language, 'register') : t(language, 'login')}
          </button>
        </p>
      </div>
    </div>
  )
}
