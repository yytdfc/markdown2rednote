export interface PageConfig {
  fontFamily: string
  fontSize: number
  lineHeight: number
  pageMargin: number
  pageWidth: number
  pageHeight: number
  theme: ThemeName
  textColor: string
  bgColor: string
  showPageNumber: boolean
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left'
  showPageLines: boolean
  coverFontFamily: string
  coverFontSize: number
  coverColor: string
  headingColor: string
  boldColor: string
  codeBg: string
  exportScale: number
  exportFormat: 'png' | 'jpeg' | 'webp'
}

export interface ThemeColors {
  bg: string
  text: string
  accent: string
  quote: string
  headingColor: string
  boldColor: string
  codeBg: string
}

export type ThemeName = 'light' | 'cream' | 'paper' | 'dark' | 'midnight' | 'sepia' | 'pink' | 'mint' | 'ocean' | 'lavender' | 'honey'
