export interface TTSOptions {
  text: string
  language?: string
  rate?: number
  pitch?: number
  volume?: number
}

export class TTSService {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  private static currentUtterance: SpeechSynthesisUtterance | null = null

  static speak(options: TTSOptions): void {
    if (!this.synth) {
      console.warn('Speech Synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(options.text)
    utterance.lang = this.getLanguageCode(options.language || 'en')
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    this.currentUtterance = utterance
    this.synth.speak(utterance)
  }

  static stop(): void {
    if (this.synth) {
      this.synth.cancel()
      this.currentUtterance = null
    }
  }

  static pause(): void {
    if (this.synth && this.synth.paused === false) {
      this.synth.pause()
    }
  }

  static resume(): void {
    if (this.synth && this.synth.paused === true) {
      this.synth.resume()
    }
  }

  static isSupported(): boolean {
    return this.synth !== null && 'speechSynthesis' in window
  }

  static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false
  }

  static getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return []
    return this.synth.getVoices()
  }

  static setVoice(voiceIndex: number): void {
    if (this.currentUtterance) {
      const voices = this.getAvailableVoices()
      if (voices[voiceIndex]) {
        this.currentUtterance.voice = voices[voiceIndex]
      }
    }
  }

  private static getLanguageCode(language: string): string {
    const codes: Record<string, string> = {
      en: 'en-US',
      bn: 'bn-IN',
      ar: 'ar-SA',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-BR',
      ru: 'ru-RU',
      ja: 'ja-JP',
      ko: 'ko-KR',
      zh: 'zh-CN',
    }
    return codes[language] || 'en-US'
  }

  static onEnd(callback: () => void): void {
    if (this.currentUtterance) {
      this.currentUtterance.onend = callback
    }
  }

  static onStart(callback: () => void): void {
    if (this.currentUtterance) {
      this.currentUtterance.onstart = callback
    }
  }

  static onError(callback: (error: SpeechSynthesisErrorEvent) => void): void {
    if (this.currentUtterance) {
      this.currentUtterance.onerror = callback
    }
  }
}
