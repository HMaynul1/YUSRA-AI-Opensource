export type ShortcutHandler = () => void

export interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: ShortcutHandler
}

export class ShortcutManager {
  private shortcuts: Map<string, Shortcut> = new Map()

  register(shortcut: Shortcut): void {
    const key = this.getShortcutKey(shortcut)
    this.shortcuts.set(key, shortcut)
  }

  unregister(key: string): void {
    this.shortcuts.delete(key)
  }

  handleKeyDown(event: KeyboardEvent): void {
    const key = this.getEventKey(event)
    const shortcut = this.shortcuts.get(key)

    if (shortcut) {
      event.preventDefault()
      shortcut.handler()
    }
  }

  private getShortcutKey(shortcut: Shortcut): string {
    return `${shortcut.ctrl ? 'ctrl+' : ''}${shortcut.shift ? 'shift+' : ''}${shortcut.alt ? 'alt+' : ''}${shortcut.key.toLowerCase()}`
  }

  private getEventKey(event: KeyboardEvent): string {
    return `${event.ctrlKey || event.metaKey ? 'ctrl+' : ''}${event.shiftKey ? 'shift+' : ''}${event.altKey ? 'alt+' : ''}${event.key.toLowerCase()}`
  }
}

export const defaultShortcuts = {
  newChat: { key: 'n', ctrl: true },
  send: { key: 'Enter', ctrl: true },
  search: { key: 'f', ctrl: true },
  settings: { key: ',', ctrl: true },
  toggleTheme: { key: 't', ctrl: true },
  toggleLanguage: { key: 'l', ctrl: true },
  focusInput: { key: '/', ctrl: false },
  help: { key: '?', ctrl: false },
}
