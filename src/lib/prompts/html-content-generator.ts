/**
 * 内容生成器 - AI只负责生成HTML结构和内容
 * CSS由主题系统提供
 */

interface ContentPromptParams {
  title: string;
  originalDocument: string;
  outlineFormatted: string;
  totalSlides: number;
  currentDate: string;
}

export function generateContentPrompt(params: ContentPromptParams): string {
  const {
    title,
    originalDocument,
    outlineFormatted,
    totalSlides,
    currentDate,
  } = params;

  return `你是麦肯锡的内容策划师。为"${title}"生成${totalSlides}页演示文稿的HTML内容。

## 你的工具箱（可用的CSS类）

### 布局类
- \`.two-col\` - 2列布局（左右分栏）
- \`.three-col\` - 3列布局
- \`.grid-2x2\` - 2×2网格（4个卡片）
- \`.centered\` - 居中内容（封面/结束页）

### 组件类
- \`.card\` - 内容卡片
- \`.data-card\` - 数据展示卡片
- \`.data-value\` - 大号数字
- \`.data-unit\` - 数字单位
- \`.data-label\` - 数据标签
- \`<ul>\` + \`<li>\` - 要点列表

## 输出格式

每页用注释包裹，只生成<body>内的内容：

\`\`\`html
<!-- SLIDE 1 -->
<div class="slide">
  <div class="content">
    <div class="centered">
      <h1>${title}</h1>
      <h2>副标题</h2>
      <div style="font-size: 16px; color: #888;">${currentDate}</div>
    </div>
  </div>
  <div class="footer">
    <span></span>
    <span>1 / ${totalSlides}</span>
  </div>
</div>
<!-- END SLIDE 1 -->

<!-- SLIDE 2 -->
<div class="slide">
  <div class="header"><h1>页面标题</h1></div>
  <div class="content">
    <div class="grid-2x2">
      <div class="data-card">
        <div class="data-label">指标名称</div>
        <div class="data-value">50<span class="data-unit">家</span></div>
      </div>
      <div class="data-card">
        <div class="data-label">指标名称</div>
        <div class="data-value">30<span class="data-unit">亿元</span></div>
      </div>
      <div class="data-card">
        <div class="data-label">指标名称</div>
        <div class="data-value">2<span class="data-unit">个</span></div>
      </div>
      <div class="data-card">
        <div class="data-label">指标名称</div>
        <div class="data-value">5<span class="data-unit">家</span></div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>数据来源：深圳市科技创新局</span>
    <span>2 / ${totalSlides}</span>
  </div>
</div>
<!-- END SLIDE 2 -->
\`\`\`

## 布局选择规则

**根据要点数量选择布局：**
- 2-4个要点 → \`.two-col\`（左右分栏）
- 4个数据 → \`.grid-2x2\`（2×2网格）
- 6-9个要点 → \`.three-col\`（3列）
- 封面/结束 → \`.centered\`（居中）

**内容控制：**
- 每个卡片：标题1行 + 内容2-3行
- 列表项：每项1-2行
- 数据卡片：标签 + 数字 + 单位

## 原始文档

${originalDocument.substring(0, 8000)}

## 大纲

${outlineFormatted}

## 强制规则

✅ 只生成<body>内的HTML结构
✅ 使用提供的CSS类名
✅ 从原文提取真实数据
✅ 横向布局优先
✅ 每页用<!-- SLIDE X -->包裹
❌ 不要写<style>标签
❌ 不要写<head>部分
❌ 禁止内容溢出
❌ 禁止单列超过5项

生成${totalSlides}页内容！`;
}
