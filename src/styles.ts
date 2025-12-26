import type { PageConfig } from './types'
import { themes } from './config'

export function generateStyles(cfg: PageConfig): string {
  const theme = themes[cfg.theme]

  const pageNumberContent = `counter(page) " / " counter(pages)`
  const pageNumberStyle = cfg.showPageNumber
    ? `
      @${cfg.pageNumberPosition} {
        content: ${pageNumberContent};
        font-size: ${cfg.fontSize * 0.75}px;
        color: ${theme.quote};
      }`
    : ''

  return `
@page {
  size: ${cfg.pageWidth}px ${cfg.pageHeight}px;
  margin: ${cfg.pageMargin}px;
  ${pageNumberStyle}
}
body {
  font-family: "${cfg.fontFamily}", "Source Han Serif SC VF", "PingFang SC", sans-serif;
  font-size: ${cfg.fontSize}px;
  line-height: ${cfg.lineHeight};
  color: ${cfg.textColor};
  background: ${cfg.bgColor};
}
.cover {
  page: cover;
  break-after: page;
}
@page cover {
  size: ${cfg.pageWidth}px ${cfg.pageHeight}px;
  margin: 0;
  @top-center { content: none; }
  @bottom-left { content: none; }
  @bottom-center { content: none; }
  @bottom-right { content: none; }
}
.cover {
  position: relative;
  height: ${cfg.pageHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-line {
  position: absolute;
  left: ${cfg.pageMargin}px;
  right: ${cfg.pageMargin}px;
  height: 2px;
  display: flex;
}
.cover-line::before,
.cover-line::after {
  content: '';
  flex: 1;
  height: 100%;
}
.cover-line::before {
  background: linear-gradient(90deg, transparent, ${cfg.coverColor}80);
}
.cover-line::after {
  background: linear-gradient(90deg, ${cfg.coverColor}80, transparent);
}
.cover-line-top {
  top: 10%;
}
.cover-line-bottom {
  top: 90%;
}
.cover h1 {
  font-family: "${cfg.coverFontFamily}", "Source Han Serif SC VF", "PingFang SC", sans-serif;
  font-size: ${cfg.coverFontSize}px;
  font-weight: bold;
  color: ${cfg.coverColor};
  line-height: 1.4;
  text-align: center;
  margin: 0;
  padding: ${cfg.pageMargin * 1.5}px ${cfg.pageMargin}px;
}

h1 { font-size: ${cfg.fontSize * 1.75}px; color: ${cfg.headingColor}; break-after: avoid; margin-top: 0; }
h2 { font-size: ${cfg.fontSize * 1.375}px; color: ${cfg.headingColor}; break-after: avoid; margin-top: 1.5em; }
h3 { font-size: ${cfg.fontSize * 1.125}px; color: ${cfg.headingColor}; break-after: avoid; }
strong, b { color: ${cfg.boldColor}; }
p { margin-bottom: 1em; text-align: justify; widows: 2; orphans: 2; }
ul, ol { margin: 1em 0; padding-left: 2em; }
li { margin-bottom: 0.5em; break-inside: avoid; }
blockquote {
  border-left: 4px solid ${theme.accent};
  padding-left: 16px;
  margin: 1em 0;
  color: ${theme.quote};
  font-style: italic;
  break-inside: avoid;
}
pre {
  background: ${cfg.codeBg};
  padding: 16px;
  border-radius: 8px;
  white-space: pre-wrap;
  word-wrap: break-word;
  break-inside: avoid;
  font-size: ${cfg.fontSize * 0.875}px;
}
code {
  font-family: 'Monaco', 'Menlo', monospace;
  background: ${cfg.codeBg};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: ${cfg.fontSize * 0.875}px;
}
pre code { background: none; padding: 0; }
a { color: inherit; font-style: italic; text-decoration: underline; pointer-events: none; }
img { max-width: 100%; height: auto; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
th, td { padding: 8px; border: 1px solid ${cfg.headingColor}40; text-align: center; }
th { background: ${cfg.codeBg}; font-weight: bold; }
.page-break { break-after: page; }
${
  cfg.showPageLines
    ? `
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::before,
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::after {
  content: '';
  position: absolute;
  left: ${cfg.pageMargin}px;
  right: ${cfg.pageMargin}px;
  height: 1px;
  background: ${cfg.headingColor}40;
}
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::before {
  top: ${cfg.pageMargin * 0.7}px;
}
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::after {
  bottom: ${cfg.pageMargin}px;
}`
    : ''
}
`
}
