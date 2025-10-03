export type Theme = 'system' | 'dark' | 'light'

export const themes: Theme[] = ['dark', 'light']
export const allThemes: Theme[] = ['system', ...themes]

export const defaultTheme: Theme = 'dark'
