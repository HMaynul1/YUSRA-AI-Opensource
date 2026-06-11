export class LocalStorage {
  static set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('LocalStorage set failed:', error)
    }
  }

  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('LocalStorage get failed:', error)
      return defaultValue || null
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('LocalStorage remove failed:', error)
    }
  }

  static clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('LocalStorage clear failed:', error)
    }
  }
}

export class SessionStorage {
  static set(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('SessionStorage set failed:', error)
    }
  }

  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('SessionStorage get failed:', error)
      return defaultValue || null
    }
  }

  static remove(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('SessionStorage remove failed:', error)
    }
  }
}
