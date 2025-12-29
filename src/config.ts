import type { PageConfig, ThemeColors, BuiltinThemeName } from './types'

export const builtinThemes: Record<BuiltinThemeName, ThemeColors> = {
  light: { bg: '#ffffff', text: '#333333', accent: '#e74c3c', quote: '#666666', headingColor: '#e74c3c', boldColor: '#c0392b', codeBg: '#f5f5f5' },
  cream: { bg: '#FFFEF5', text: '#1a1a1a', accent: '#e74c3c', quote: '#666666', headingColor: '#c0392b', boldColor: '#e67e22', codeBg: '#f5f0e6' },
  paper: { bg: '#F9F6F2', text: '#2d2d2d', accent: '#d35400', quote: '#777777', headingColor: '#c0392b', boldColor: '#e74c3c', codeBg: '#efe9e1' },
  dark: { bg: '#1a1a2e', text: '#eaeaea', accent: '#ff6b6b', quote: '#aaaaaa', headingColor: '#ff6b6b', boldColor: '#ffa502', codeBg: '#2d2d44' },
  midnight: { bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff', quote: '#8b949e', headingColor: '#58a6ff', boldColor: '#7ee787', codeBg: '#161b22' },
  sepia: { bg: '#f4ecd8', text: '#5c4b37', accent: '#8b4513', quote: '#7a6a5a', headingColor: '#8b4513', boldColor: '#a0522d', codeBg: '#e8dcc8' },
  pink: { bg: '#fff0f5', text: '#4a4a4a', accent: '#ff69b4', quote: '#888888', headingColor: '#ff69b4', boldColor: '#db7093', codeBg: '#ffe4ec' },
  mint: { bg: '#f0fff4', text: '#2d3748', accent: '#38a169', quote: '#718096', headingColor: '#276749', boldColor: '#2f855a', codeBg: '#e0f5e8' },
  ocean: { bg: '#f0f9ff', text: '#1e3a5f', accent: '#0077b6', quote: '#64748b', headingColor: '#0077b6', boldColor: '#00b4d8', codeBg: '#e0f0fa' },
  lavender: { bg: '#faf5ff', text: '#44337a', accent: '#805ad5', quote: '#718096', headingColor: '#6b46c1', boldColor: '#9f7aea', codeBg: '#f0e8fa' },
  honey: { bg: '#fffdf7', text: '#4a4a4a', accent: '#d4a574', quote: '#8a8a8a', headingColor: '#c08552', boldColor: '#b8860b', codeBg: '#faf6ed' },
}

const customThemeModules = import.meta.glob<{ default: ThemeColors | PageConfig }>('./custom-themes/*.json', { eager: true })
const customThemes: Record<string, ThemeColors> = {}
for (const path in customThemeModules) {
  const name = path.replace('./custom-themes/', '').replace('.json', '')
  const data = customThemeModules[path].default
  if ('bg' in data) {
    customThemes[name] = data as ThemeColors
  } else {
    const cfg = data as PageConfig
    customThemes[name] = {
      bg: cfg.bgColor,
      text: cfg.textColor,
      accent: cfg.headingColor,
      quote: '#666666',
      headingColor: cfg.headingColor,
      boldColor: cfg.boldColor,
      codeBg: cfg.codeBg,
    }
  }
}

export const themes: Record<string, ThemeColors> = { ...builtinThemes, ...customThemes }

export const fontOptions = [
  'PingFang SC',
  'Microsoft YaHei',
  'Smiley Sans',
  'Source Han Serif SC VF',
  'Helvetica Neue',
  'Arial',
  'Georgia',
  'Times New Roman',
]

export const defaultConfig: PageConfig = {
  fontFamily: 'Source Han Serif SC VF',
  fontSize: 15,
  lineHeight: 1.8,
  pageMargin: 30,
  pageWidth: 450,
  pageHeight: 600,
  theme: 'light',
  textColor: '#333333',
  bgColor: '#ffffff',
  showPageNumber: true,
  pageNumberPosition: 'bottom-right',
  showPageLines: false,
  coverFontFamily: 'Smiley Sans',
  coverFontSize: 55,
  coverColor: '#e74c3c',
  headingColor: '#e74c3c',
  boldColor: '#c0392b',
  codeBg: '#f5f5f5',
  exportScale: 4,
  exportFormat: 'webp',
}

export const STORAGE_KEY = 'md-paged-config'
