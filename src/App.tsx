import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import html2canvas from 'html2canvas'
import './App.css'
import exampleMarkdown from './example.md?raw'
import type { PageConfig } from './types'
import { defaultConfig, STORAGE_KEY } from './config'
import { generateStyles } from './styles'
import { ConfigPanel } from './components/ConfigPanel'

function App() {
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem('md-paged-content')
    return saved ?? exampleMarkdown
  })
  const [config, setConfig] = useState<PageConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig
  })
  const [isRendering, setIsRendering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [configCollapsed, setConfigCollapsed] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(100)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  useEffect(() => {
    localStorage.setItem('md-paged-content', markdown)
  }, [markdown])

  useEffect(() => {
    if (!markdown) return

    const renderPaged = async () => {
      setIsRendering(true)

      let htmlContent = marked.parse(markdown) as string
      htmlContent = htmlContent.replace(
        /<h1>(.*?)<\/h1>/,
        '<section class="cover"><div class="cover-line cover-line-top"></div><h1>$1</h1><div class="cover-line cover-line-bottom"></div></section>'
      )
      htmlContent = htmlContent.replace(/<hr\s*\/?>/g, '<div class="page-break"></div>')
      const coverEnd = htmlContent.indexOf('</section>') + 10
      htmlContent =
        htmlContent.slice(0, coverEnd) +
        '<div class="content">' +
        htmlContent.slice(coverEnd) +
        '</div>'

      const oldIframe = iframeRef.current
      if (!oldIframe?.parentNode) return

      const newIframe = document.createElement('iframe')
      newIframe.title = 'preview'
      oldIframe.parentNode.replaceChild(newIframe, oldIframe)
      iframeRef.current = newIframe

      const iframeDoc = newIframe.contentDocument || newIframe.contentWindow?.document
      if (!iframeDoc) return

      const styles = generateStyles(config)

      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>${styles}</style>
          <style>
            .pagedjs_pages {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              justify-content: flex-start;
              align-content: flex-start;
            }
            .pagedjs_page {
              background: ${config.bgColor};
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              flex-shrink: 0;
            }
          </style>
        </head>
        <body style="background: #444; padding: 20px;">
          <div id="content">${htmlContent}</div>
          <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"><\/script>
          <script>
            class PagedHandler extends Paged.Handler {
              afterRendered() {
                window.parent.postMessage('rendered', '*');
              }
            }
            Paged.registerHandlers(PagedHandler);
            window.addEventListener('message', function(e) {
              if (e.data && e.data.type === 'zoom') {
                var zoom = e.data.zoom;
                var pages = document.querySelectorAll('.pagedjs_page');
                pages.forEach(function(page) {
                  page.style.transform = 'scale(' + zoom + ')';
                  page.style.transformOrigin = 'top left';
                  page.style.marginRight = ((1 - zoom) * -${config.pageWidth}) + 'px';
                  page.style.marginBottom = ((1 - zoom) * -${config.pageHeight}) + 'px';
                });
              }
            });
          <\/script>
        </body>
        </html>
      `)
      iframeDoc.close()
    }

    const timer = setTimeout(renderPaged, 500)
    return () => clearTimeout(timer)
  }, [markdown, config])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'rendered') {
        setIsRendering(false)
        // Re-apply zoom after render completes
        const iframe = iframeRef.current
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'zoom', zoom: previewZoom / 100 }, '*')
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [previewZoom])

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'zoom', zoom: previewZoom / 100 }, '*')
    }
  }, [previewZoom])

  const updateConfig = (key: keyof PageConfig, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const resetConfig = () => setConfig(defaultConfig)

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paged-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importConfig = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string)
          setConfig({ ...defaultConfig, ...imported })
        } catch {
          alert('配置文件格式错误')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const exportImages = async () => {
    const iframe = iframeRef.current
    if (!iframe) return

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) return

    const pages = iframeDoc.querySelectorAll('.pagedjs_page')
    if (pages.length === 0) {
      alert('没有可导出的页面')
      return
    }

    setIsExporting(true)

    // Reset zoom to 100% before export and wait for reflow
    const pageElements = iframeDoc.querySelectorAll('.pagedjs_page') as NodeListOf<HTMLElement>
    pageElements.forEach((page) => {
      page.style.transform = 'none'
      page.style.marginRight = '0'
      page.style.marginBottom = '0'
    })
    await new Promise((r) => setTimeout(r, 100))

    try {
      const now = new Date()
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`

      // @ts-expect-error File System Access API
      const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' })
      const subDirHandle = await dirHandle.getDirectoryHandle(`pages-${timestamp}`, {
        create: true,
      })

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement
        const canvas = await html2canvas(page, {
          scale: config.exportScale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: config.bgColor,
          logging: false,
        })

        const mimeType = `image/${config.exportFormat}`
        const quality = config.exportFormat === 'png' ? undefined : 0.92
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), mimeType, quality)
        )

        const fileName = `page-${String(i + 1).padStart(2, '0')}.${config.exportFormat}`
        const fileHandle = await subDirHandle.getFileHandle(fileName, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
      }

      alert(`已导出 ${pages.length} 张图片到 pages-${timestamp} 文件夹`)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Export error:', err)
        alert('导出失败，请重试')
      }
    }

    // Restore zoom after export
    const zoom = previewZoom / 100
    pageElements.forEach((page) => {
      page.style.transform = `scale(${zoom})`
      page.style.transformOrigin = 'top left'
      page.style.marginRight = `${(1 - zoom) * -config.pageWidth}px`
      page.style.marginBottom = `${(1 - zoom) * -config.pageHeight}px`
    })

    setIsExporting(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Markdown to 小红书</h1>
        <button
          className="collapse-btn header-collapse"
          onClick={() => setConfigCollapsed(!configCollapsed)}
        >
          {configCollapsed ? '打开配置面板' : '关闭配置面板'}
        </button>
      </header>

      <div className="app-body">
        <div className="main-content">
          <div className="editor-panel">
            <div className="panel-header">
              <span>Markdown</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="输入 Markdown 内容..."
            />
          </div>

          <div className="preview-panel">
            <div className="panel-header">
              <span>预览</span>
              {isRendering && <span className="loading">渲染中...</span>}
              <div className="zoom-controls">
                <button
                  className="zoom-btn"
                  onClick={() => setPreviewZoom((z) => Math.max(25, z - 25))}
                  disabled={previewZoom <= 25}
                >
                  −
                </button>
                <span className="zoom-value">{previewZoom}%</span>
                <button
                  className="zoom-btn"
                  onClick={() => setPreviewZoom((z) => Math.min(200, z + 25))}
                  disabled={previewZoom >= 200}
                >
                  +
                </button>
              </div>
            </div>
            <div className="preview-container">
              <iframe ref={iframeRef} title="preview" />
            </div>
          </div>
        </div>

        <ConfigPanel
          config={config}
          setConfig={setConfig}
          updateConfig={updateConfig}
          collapsed={configCollapsed}
          onReset={resetConfig}
          onExportConfig={exportConfig}
          onImportConfig={importConfig}
          onExportImages={exportImages}
          isRendering={isRendering}
          isExporting={isExporting}
        />
      </div>
    </div>
  )
}

export default App
