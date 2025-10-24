/**
 * V5版本 - 专业设计 + 横纵平衡 + 去AI化
 */

interface PromptParams {
    title: string;
    userPrompt: string;
    currentDate: string;
    language: string;
    theme: string;
    originalDocument: string;
    analyzedDocument: string;
    outlineFormatted: string;
    totalSlides: number;
    searchResults: string;
}

export function generateHTMLPromptV5(params: PromptParams): string {
    const {
        title,
        originalDocument,
        outlineFormatted,
        totalSlides,
        currentDate,
    } = params;

    return `你是麦肯锡的演示文稿设计师。生成${totalSlides}页专业HTML演示文稿。

## 核心要求

1. **横纵平衡**：优先2-3列布局，禁止单列超过5项
2. **去AI化**：禁止左侧色条，使用细边框和浅色背景
3. **无滚动条**：内容必须完全在1280×720内，绝对不能溢出

## HTML模板（必须使用）

每页用<!-- SLIDE X -->包裹，使用以下结构：

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>第X页</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&family=Noto+Sans+SC:wght@400;500&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.slide {
  width: 1280px;
  height: 720px;
  background: #fff;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  padding: 20px;
  overflow: hidden;
}
.header {
  border-bottom: 2px solid #2C3E50;
  padding-bottom: 10px;
}
.header h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  color: #2C3E50;
  margin: 0;
}
.content {
  padding: 20px 0;
  overflow: hidden;
}
.footer {
  border-top: 1px solid #e8e8e8;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}
/* 2列布局 */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  height: 100%;
}
/* 3列布局 */
.three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: 100%;
}
/* 2x2网格 */
.grid-2x2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  height: 100%;
}
/* 卡片 - 无左侧色条 */
.card {
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.card h3 {
  font-size: 18px;
  color: #2C3E50;
  margin-bottom: 10px;
}
.card p {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}
/* 数据卡片 */
.data-card {
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
}
.data-value {
  font-size: 48px;
  font-weight: 700;
  color: #2C3E50;
  line-height: 1;
}
.data-unit {
  font-size: 20px;
  color: #3498DB;
  margin-left: 5px;
}
.data-label {
  font-size: 14px;
  color: #888;
  margin-top: 10px;
}
/* 列表 */
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 10px 0 10px 25px;
  position: relative;
  font-size: 16px;
  line-height: 1.5;
}
li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #3498DB;
  font-size: 20px;
}
/* 居中内容（封面/结束页） */
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.centered h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: 52px;
  color: #2C3E50;
  margin-bottom: 20px;
}
.centered h2 {
  font-size: 24px;
  color: #888;
  font-weight: 400;
  margin-bottom: 40px;
}
</style>
</head>
<body>
<div class="slide">
  <div class="header"><h1>标题</h1></div>
  <div class="content">
    <!-- 内容 -->
  </div>
  <div class="footer">
    <span>数据来源：XXX</span>
    <span>X / ${totalSlides}</span>
  </div>
</div>
</body>
</html>
\`\`\`

## 布局选择规则

- **3-4个要点**：用.two-col（左右各2个）
- **6个要点**：用.two-col（左右各3个）
- **4个数据**：用.grid-2x2
- **6-9个要点**：用.three-col

## 原始文档

${originalDocument.substring(0, 8000)}

## 大纲

${outlineFormatted}

## 强制规则

✅ 必须用<!-- SLIDE X -->包裹
✅ 必须从原文提取真实数据
✅ 必须横向布局（2-3列）
❌ 禁止左侧色条
❌ 禁止内容溢出
❌ 禁止单列超过5项

生成${totalSlides}页HTML！`;
}
