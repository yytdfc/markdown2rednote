import type { PageConfig } from '../types'
import { themes, fontOptions } from '../config'

interface ConfigPanelProps {
  config: PageConfig
  setConfig: React.Dispatch<React.SetStateAction<PageConfig>>
  updateConfig: (key: keyof PageConfig, value: string | number | boolean) => void
  collapsed: boolean
  onReset: () => void
  onExportConfig: () => void
  onImportConfig: () => void
  onExportImages: () => void
  isRendering: boolean
  isExporting: boolean
}

export function ConfigPanel({
  config,
  setConfig,
  updateConfig,
  collapsed,
  onReset,
  onExportConfig,
  onImportConfig,
  onExportImages,
  isRendering,
  isExporting,
}: ConfigPanelProps) {
  if (collapsed) return null

  return (
    <div className="config-panel">
      <div className="panel-header">
        <span>配置</span>
      </div>
      <div className="config-content">
        <div className="config-section">
          <h4>封面标题</h4>
          <div className="config-row cover-row">
            <label className="flex-2">
              字体
              <select
                value={config.coverFontFamily}
                onChange={(e) => updateConfig('coverFontFamily', e.target.value)}
              >
                {fontOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              字号
              <input
                type="number"
                value={config.coverFontSize}
                min={20}
                max={72}
                onChange={(e) => updateConfig('coverFontSize', +e.target.value)}
              />
            </label>
            <label className="flex-1">
              颜色
              <input
                type="color"
                value={config.coverColor}
                onChange={(e) => updateConfig('coverColor', e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h4>正文样式</h4>
          <div className="config-row cover-row">
            <label className="flex-2">
              字体
              <select
                value={config.fontFamily}
                onChange={(e) => updateConfig('fontFamily', e.target.value)}
              >
                {fontOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              字号
              <input
                type="number"
                value={config.fontSize}
                min={12}
                max={24}
                onChange={(e) => updateConfig('fontSize', +e.target.value)}
              />
            </label>
            <label className="flex-1">
              字体色
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => updateConfig('textColor', e.target.value)}
              />
            </label>
          </div>
          <div className="config-row">
            <label>
              行高
              <input
                type="number"
                value={config.lineHeight}
                min={1.2}
                max={2.5}
                step={0.1}
                onChange={(e) => updateConfig('lineHeight', +e.target.value)}
              />
            </label>
            <label>
              主题
              <select
                value={config.theme}
                onChange={(e) => {
                  const newTheme = e.target.value as PageConfig['theme']
                  const themeColors = themes[newTheme]
                  setConfig((prev) => ({
                    ...prev,
                    theme: newTheme,
                    textColor: themeColors.text,
                    bgColor: themeColors.bg,
                    headingColor: themeColors.headingColor,
                    boldColor: themeColors.boldColor,
                    coverColor: themeColors.headingColor,
                    codeBg: themeColors.codeBg,
                  }))
                }}
              >
                <option value="light">浅色</option>
                <option value="cream">象牙</option>
                <option value="paper">纸张</option>
                <option value="dark">深色</option>
                <option value="midnight">午夜</option>
                <option value="sepia">复古</option>
                <option value="pink">粉色</option>
                <option value="mint">薄荷</option>
                <option value="ocean">海洋</option>
                <option value="lavender">薰衣草</option>
                <option value="honey">蜂蜜</option>
              </select>
            </label>
          </div>
          <div className="config-row">
            <label>
              背景色
              <input
                type="color"
                value={config.bgColor}
                onChange={(e) => updateConfig('bgColor', e.target.value)}
              />
            </label>
            <label>
              标题色
              <input
                type="color"
                value={config.headingColor}
                onChange={(e) => updateConfig('headingColor', e.target.value)}
              />
            </label>
            <label>
              加粗色
              <input
                type="color"
                value={config.boldColor}
                onChange={(e) => updateConfig('boldColor', e.target.value)}
              />
            </label>
            <label>
              代码背景
              <input
                type="color"
                value={config.codeBg}
                onChange={(e) => updateConfig('codeBg', e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h4>页面尺寸</h4>
          <div className="config-row">
            <label>
              宽度
              <input
                type="number"
                value={config.pageWidth}
                min={300}
                max={800}
                onChange={(e) => updateConfig('pageWidth', +e.target.value)}
              />
            </label>
            <label>
              高度
              <input
                type="number"
                value={config.pageHeight}
                min={400}
                max={1000}
                onChange={(e) => updateConfig('pageHeight', +e.target.value)}
              />
            </label>
            <label>
              边距
              <input
                type="number"
                value={config.pageMargin}
                min={20}
                max={80}
                onChange={(e) => updateConfig('pageMargin', +e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h4>排版选项</h4>
          <div className="config-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.showPageNumber}
                onChange={(e) => updateConfig('showPageNumber', e.target.checked)}
              />
              页码
              {config.showPageNumber && (
                <select
                  value={config.pageNumberPosition}
                  onChange={(e) => updateConfig('pageNumberPosition', e.target.value)}
                  className="inline-select"
                >
                  <option value="bottom-center">居中</option>
                  <option value="bottom-right">右下</option>
                  <option value="bottom-left">左下</option>
                </select>
              )}
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.showPageLines}
                onChange={(e) => updateConfig('showPageLines', e.target.checked)}
              />
              页面线条
            </label>
          </div>
        </div>

        <div className="config-actions">
          <div className="action-row">
            <button onClick={onReset}>重置</button>
            <button onClick={onExportConfig}>导出配置</button>
            <button onClick={onImportConfig}>导入配置</button>
          </div>
          <div className="export-row">
            <select
              value={config.exportScale}
              onChange={(e) => updateConfig('exportScale', +e.target.value)}
              className="export-select"
              title="导出倍率"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
            </select>
            <select
              value={config.exportFormat}
              onChange={(e) => updateConfig('exportFormat', e.target.value)}
              className="export-select"
              title="导出格式"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
            <button
              onClick={onExportImages}
              disabled={isRendering || isExporting}
              className="export-btn"
            >
              {isExporting ? '导出中...' : '导出图片'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
