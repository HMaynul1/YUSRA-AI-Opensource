import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface UserAnalytics {
  userId: string
  date: Date
  messagesCount: number
  sessionsCount: number
  apiCalls: number
  totalTokens: number
}

export class AnalyticsService {
  static async trackMessage(userId: string, tokens: number): Promise<void> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Store in app config for simplicity
      const key = `analytics_${userId}_${today.toISOString().split('T')[0]}`
      const existing = await prisma.appConfig.findUnique({ where: { key } })

      const data = existing ? JSON.parse(existing.value) : { messages: 0, tokens: 0 }
      data.messages++
      data.tokens += tokens

      await prisma.appConfig.upsert({
        where: { key },
        update: { value: JSON.stringify(data) },
        create: { key, value: JSON.stringify(data) },
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  static async getUserAnalytics(userId: string, days: number = 30): Promise<UserAnalytics[]> {
    try {
      const analytics: UserAnalytics[] = []
      const now = new Date()

      for (let i = 0; i < days; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const key = `analytics_${userId}_${date.toISOString().split('T')[0]}`
        const config = await prisma.appConfig.findUnique({ where: { key } })
        const data = config ? JSON.parse(config.value) : { messages: 0, tokens: 0 }

        analytics.push({
          userId,
          date,
          messagesCount: data.messages || 0,
          sessionsCount: 0,
          apiCalls: data.messages || 0,
          totalTokens: data.tokens || 0,
        })
      }

      return analytics
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      return []
    }
  }
}

// Rate limiting
export class RateLimiter {
  private static limits: Map<string, { count: number; resetTime: number }> = new Map()
  private static readonly DEFAULT_LIMIT = 100
  private static readonly WINDOW_MS = 60 * 1000 // 1 minute

  static isAllowed(userId: string, limit: number = this.DEFAULT_LIMIT): boolean {
    const now = Date.now()
    const key = `ratelimit_${userId}`
    const current = this.limits.get(key)

    if (!current || now > current.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + this.WINDOW_MS })
      return true
    }

    if (current.count < limit) {
      current.count++
      return true
    }

    return false
  }

  static getRemainingRequests(userId: string, limit: number = this.DEFAULT_LIMIT): number {
    const key = `ratelimit_${userId}`
    const current = this.limits.get(key)

    if (!current || Date.now() > current.resetTime) {
      return limit
    }

    return Math.max(0, limit - current.count)
  }

  static getResetTime(userId: string): number {
    const key = `ratelimit_${userId}`
    const current = this.limits.get(key)

    if (!current) {
      return Date.now()
    }

    return current.resetTime
  }
}
