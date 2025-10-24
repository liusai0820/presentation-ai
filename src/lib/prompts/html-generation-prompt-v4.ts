/**
 * V4版本 - 基于htmlprompt.md的专业设计系统
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

export function generateHTMLPromptV4(params: PromptParams): string {
    const {
        title,
        originalDocument,
        analyzedDocument,
        outlineFormatted,
        totalSlides,
        currentDate,
    } = params;

    return `你是一名专业的演示文稿设计师和前端开发专家，擅长创造具有极高审美价值的高质量、静态、可打印的HTML演示页面。

## 任务

为"${title}"生成${totalSlides}页专业HTML演示文稿。

## 强制格式要求

每页必须用注释包裹：
\`\`\`
<!-- SLIDE 1 -->
<!DOCTYPE html>
...完整HTML...
</html>
<!-- END SLIDE 1 -->
\`\`\`

## HTML模板结构（必须严格遵守）

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>第X页 - 标题</title>
<link rel="stylesheet" href="https://cdn.staticfile.org/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap">
<style>
:root {
  --primary-color: #2C3E50;
  --primary-light: #3498DB;
  --primary-dark: #1A252F;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --dark-gray: #333333;
  --light-gray: #f5f5f5;
  --mid-gray: #888888;
  --text-color: #333333;
  --light-text: #ffffff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Noto Sans SC', Tahoma, Arial, sans-serif;
  color: var(--text-color);
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: auto;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  color: var(--dark-gray);
  margin-bottom: 0.5em;
}

.slide-container {
  width: 1280px;
  height: 720px;
  background-color: #fff;
  position: relative;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header"
    "content"
    "footer";
  padding: 20px;
  background: linear-gradient(to bottom, #f9f9f9, #fff);
  overflow: hidden;
}

.header {
  grid-area: header;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h1 {
  font-size: clamp(24px, 3vw, 32px);
  color: var(--primary-color);
  margin: 0;
}

.content-area {
  grid-area: content;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.footer {
  grid-area: footer;
  border-top: 1px solid #e8e8e8;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--mid-gray);
}

.section-title {
  color: var(--primary-color);
  margin-top: 0;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: clamp(18px, 2vw, 24px);
  margin-bottom: 15px;
}

.section-title i {
  margin-right: 8px;
  color: var(--accent-color);
}

.info-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e8e8e8;
  height: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  height: 100%;
}

.card-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  height: 100%;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  height: 100%;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  margin-bottom: 8px;
  padding: 8px 10px 8px 28px;
  position: relative;
  line-height: 1.4;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: clamp(14px, 1.5vw, 16px);
}

.feature-list li::before {
  content: "•";
  position: absolute;
  left: 12px;
  color: var(--accent-color);
  font-size: 1.5em;
  line-height: 1;
}

.data-box {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-top: 3px solid var(--primary-color);
}

.data-value {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  color: var(--primary-color);
  margin: 10px 0;
}

.data-label {
  font-size: clamp(14px, 1.5vw, 16px);
  color: var(--mid-gray);
  margin-top: 8px;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.centered-content h1 {
  font-size: clamp(36px, 5vw, 56px);
  color: var(--primary-color);
  margin-bottom: 20px;
}

.centered-content h2 {
  font-size: clamp(20px, 3vw, 28px);
  color: var(--mid-gray);
  font-weight: 400;
  margin-bottom: 40px;
}

@media print {
  .slide-container {
    width: 1280px !important;
    height: 720px !important;
    page-break-after: always;
  }
}
</style>
</head>
<body>
<div class="slide-container">
  <div class="header">
    <h1>页面标题</h1>
  </div>
  
  <div class="content-area">
    <!-- 内容区域 -->
  </div>
  
  <div class="footer">
    <span>数据来源：XXX</span>
    <span>X / ${totalSlides}</span>
  </div>
</div>
</body>
</html>
\`\`\`

## 页面类型

**第1页（封面）**：
- 无header
- content-area使用.centered-content
- 包含主标题、副标题、日期

**第2-${totalSlides - 1}页（内容）**：
- 有header（显示页面标题）
- content-area根据内容选择：
  - .card-grid：多个数据卡片
  - .feature-list：要点列表
  - .data-box：关键数据展示
- footer显示数据来源和页码

**第${totalSlides}页（结束）**：
- 无header
- content-area使用.centered-content
- 显示"谢谢"或总结

## 原始文档

${originalDocument.substring(0, 8000)}

## 文档分析

${analyzedDocument}

## 大纲结构

${outlineFormatted}

## 设计要求（非常重要）

### 1. 内容布局原则
- **横纵平衡**：优先使用2列或3列布局，避免单列纵向排列过长
- **空间利用**：充分利用1280×720的空间，内容要填充但不拥挤
- **分栏布局**：
  - 3-4个要点：使用2列布局（.two-column）
  - 6个要点：使用2×3网格（.card-grid）
  - 9个要点：使用3×3网格（.card-grid-3）
- **高度控制**：每个要点不超过3行文字

### 2. 视觉设计原则
- **去AI化**：避免使用左侧色条、过度圆角等AI常用元素
- **简洁专业**：使用细边框、浅色背景、适度阴影
- **留白艺术**：卡片间距20-30px，内容周围留白充足

### 3. 强制规则
- ✅ **必须**使用上述CSS样式系统
- ✅ **必须**使用Font Awesome图标（适度，不过度）
- ✅ **必须**从原文档提取真实数据
- ✅ **必须**保持所有页面风格一致
- ❌ **禁止**捏造数据
- ❌ **禁止**内容溢出容器（绝对不能有滚动条）
- ❌ **禁止**单列纵向排列超过5个项目
- ❌ **禁止**使用左侧色条装饰

## 输出格式

生成${totalSlides}页HTML，每页用<!-- SLIDE X -->和<!-- END SLIDE X -->包裹。

现在开始生成！`;
}


## 布局优化规则（必须遵守）

### 横纵平衡原则
- **3-4个要点**：使用2列布局（左右各2个）
- **6个要点**：使用2×3网格
- **8-9个要点**：使用3×3网格
- **禁止**：单列纵向排列超过5个项目

### 去AI化设计
- **禁止**：左侧色条装饰（border-left: 4px solid）
- **使用**：细边框（border: 1px solid #e8e8e8）
- **使用**：浅色背景（#f9f9f9）
- **使用**：适度阴影（0 2px 8px rgba(0,0,0,0.08)）

### 内容控制
- **每个卡片**：标题1行 + 内容2-3行
- **列表项**：每项不超过2行
- **数据卡片**：数字 + 单位 + 说明（共3行）
- **绝对禁止**：内容溢出、出现滚动条

### CSS补充
\`\`\`css
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  height: 100%;
}

.card-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  height: 100%;
}
\`\`\`
