# HTML演示文稿生成指南

## 概述

新的HTML生成模式允许AI为每一页生成具有现代设计感的完整HTML页面，而不是使用XML组件。

## 技术架构

### 1. 生成流程

```
文档上传 → AI分析 → 生成大纲 → AI生成HTML → 解析HTML → 预览/编辑 → 导出PDF
```

### 2. 核心组件

- **API端点**: `/api/presentation/generate-html`
- **解析器**: `HTMLSlideParser` - 解析AI生成的HTML内容
- **查看器**: `HTMLSlideViewer` - 预览和导航HTML幻灯片
- **状态管理**: 添加了 `htmlSlides` 和 `generationMode`

### 3. HTML格式

AI生成的HTML使用特殊注释标记每一页：

\`\`\`html

<!-- SLIDE 1 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>第1页 - 标题</title>
    <style>
        /* 所有样式都内联在这里 */
    </style>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
<!-- END SLIDE 1 -->
\`\`\`

## 使用方法

### 1. 启用HTML生成模式

在状态管理中设置：

\`\`\`typescript
setGenerationMode("html");
\`\`\`

### 2. 调用HTML生成API

\`\`\`typescript
const response = await fetch('/api/presentation/generate-html', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
title: '演示标题',
prompt: '用户需求',
outline: ['# 第一章节\\n- 要点1\\n- 要点2', '# 第二章节\\n- 要点3'],
language: 'zh',
theme: 'professional',
searchResults: []
})
});
\`\`\`

### 3. 解析HTML内容

\`\`\`typescript
import { HTMLSlideParser } from '@/lib/html-slide-parser';

const parser = new HTMLSlideParser();
const slides = parser.parse(htmlContent);
\`\`\`

### 4. 显示HTML幻灯片

\`\`\`tsx
import { HTMLSlideViewer } from '@/components/presentation/html-slides/HTMLSlideViewer';

<HTMLSlideViewer 
  slides={htmlSlides}
  onExportPDF={handleExportPDF}
/>
\`\`\`

## 设计特点

### 1. 每页都是独立的HTML文档

- 完整的HTML5结构
- 内联CSS样式
- 可以独立打开和预览
- 适合打印和导出PDF

### 2. 现代化设计

- 使用CSS渐变、阴影、动画
- 响应式布局
- 16:9宽高比（适合演示）
- 专业的配色方案

### 3. 多样化布局

- 封面页
- 标题+内容
- 两栏布局
- 时间轴
- 卡片网格
- 图文混排
- 数据展示
- 总结页

## 导出PDF

### 方案1：浏览器打印（推荐）

\`\`\`typescript
const handleExportPDF = () => {
window.print();
};
\`\`\`

### 方案2：使用库（如jsPDF或html2pdf.js）

\`\`\`typescript
import html2pdf from 'html2pdf.js';

const handleExportPDF = () => {
const element = document.getElementById('slides-container');
html2pdf().from(element).save('presentation.pdf');
};
\`\`\`

### 方案3：服务器端生成（使用Puppeteer）

创建一个新的API端点：

\`\`\`typescript
// /api/presentation/export-pdf
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
const { htmlContent } = await req.json();

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlContent);

const pdf = await page.pdf({
format: 'A4',
landscape: true,
printBackground: true
});

await browser.close();

return new Response(pdf, {
headers: {
'Content-Type': 'application/pdf',
'Content-Disposition': 'attachment; filename=presentation.pdf'
}
});
}
\`\`\`

## 与XML模式的对比

| 特性       | XML模式                        | HTML模式                     |
| ---------- | ------------------------------ | ---------------------------- |
| 生成方式   | AI生成XML，前端解析为React组件 | AI直接生成完整HTML页面       |
| 设计灵活性 | 受限于预定义组件               | 完全自由，AI可以创造任何设计 |
| 编辑能力   | 可以使用富文本编辑器           | 需要编辑HTML代码             |
| 导出格式   | 需要转换                       | 直接打印或转PDF              |
| 性能       | 较好（React组件）              | 较好（iframe隔离）           |
| 适用场景   | 需要交互和编辑                 | 需要设计感和快速导出         |

## 下一步计划

1. ✅ 创建HTML生成API
2. ✅ 创建HTML解析器
3. ✅ 创建HTML查看器组件
4. ⏳ 集成到现有流程中
5. ⏳ 添加PDF导出功能
6. ⏳ 添加HTML编辑功能（可选）
7. ⏳ 优化AI提示词，生成更美观的设计

## 注意事项

1. **安全性**：使用iframe的sandbox属性隔离HTML内容
2. **性能**：大量幻灯片可能影响性能，考虑懒加载
3. **兼容性**：确保生成的HTML在不同浏览器中正常显示
4. **文件大小**：每页都是完整HTML，总大小可能较大
5. **AI限制**：AI生成的HTML质量取决于模型能力和提示词

## 示例

查看 `src/app/api/presentation/generate-html/route.ts` 中的完整提示词模板。
