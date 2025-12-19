# Markdown2RedNote

将 Markdown 长文一键生成小红书图片的工具。

![界面展示](https://raw.githubusercontent.com/yytdfc/markdown2rednote/main/assets/main_page.webp)

## 安装

需要 [Bun](https://bun.sh)，如未安装：

```bash
curl -fsSL https://bun.sh/install | bash
```

克隆并安装依赖：

```bash
git clone https://github.com/yytdfc/markdown2rednote.git
cd markdown2rednote
bun install
```

## 运行

```bash
bun run dev
```

## 功能

- Markdown 实时渲染为分页内容
- 封面页独立配置（字体、字号、颜色）
- 正文标题和加粗文字配色
- 10 种主题：浅色、象牙、纸张、深色、午夜、复古、粉色、薄荷、海洋、薰衣草
- 页码显示（可选位置：居中/左下/右下）
- 页面装饰线条
- `---` 分割线自动转换为分页
- 导出图片支持多种格式（PNG/JPEG/WebP）和倍率（1x-4x）
- 配置自动保存到浏览器，支持导入/导出
- 支持 HTML 语法实现更复杂布局

## 使用

1. 左侧配置面板调整样式（可折叠）
2. 中间编辑 Markdown 内容
3. 右侧实时预览分页效果
4. 点击「导出图片」选择目录保存

## 主题展示

![主题展示](https://raw.githubusercontent.com/yytdfc/markdown2rednote/main/assets/themes_showcase.webp)

## 相关资源

- [Bun 安装](https://bun.sh/docs/installation)
- [思源宋体 Source Han Serif](https://github.com/adobe-fonts/source-han-serif/tree/release/)
- [得意黑 Smiley Sans](https://github.com/atelier-anchor/smiley-sans)

## License

[MIT](LICENSE)
