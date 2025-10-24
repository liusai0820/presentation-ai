/**
 * 简化版HTML生成Prompt - 强制使用统一模板
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

export function generateHTMLPromptV2(params: PromptParams): string {
    const {
        title,
        originalDocument,
        analyzedDocument,
        outlineFormatted,
        totalSlides,
        currentDate,
    } = params;

    return `你是麦肯锡的资深演示文稿设计师。你的任务是生成${totalSlides}页专业的HTML演示文稿。

## 核心规则（必须严格遵守）

### 1. 使用统一的HTML模板
每一页都必须使用以下模板结构，**不能自己创建HTML**：

\`\`\`html
<!-- SLIDE X -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>第X页 - 标题</title>
    <style>
        /* 基础CSS（固定，不可修改） */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        body {
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            background: #F8F9FA;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* 幻灯片容器（固定尺寸） */
        .slide-container {
            width: 1200px;
            height: 675px;
            background: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        /* 页眉（固定位置） */
        .slide-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 80px;
            padding: 24px 60px;
            border-bottom: 2px solid #E1E8ED;
            z-index: 100;
        }
        .slide-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #2C3E50;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        /* 内容区域（固定位置，不溢出） */
        .slide-content {
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 50px;
            padding: 40px 60px;
            overflow: hidden;
        }
        
        /* 页脚（固定位置） */
        .slide-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            padding: 0 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #E1E8ED;
            z-index: 100;
        }
        .slide-footer .source { font-size: 12px; color: #95A5A6; }
        .slide-footer .page-number { font-size: 14px; color: #7F8C8D; font-weight: 600; }
        
        /* 网格布局 */
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
        .grid-4 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        
        /* 数字卡片 */
        .metric-card {
            background: #F8F9FA;
            border-left: 4px solid #3498DB;
            padding: 32px 24px;
            border-radius: 8px;
            text-align: center;
        }
        .metric-value {
            font-size: 56px;
            font-weight: 700;
            color: #2C3E50;
            line-height: 1;
        }
        .metric-unit {
            font-size: 24px;
            color: #3498DB;
            font-weight: 600;
        }
        .metric-label {
            font-size: 16px;
            color: #7F8C8D;
            margin-top: 12px;
        }
        .metric-description {
            font-size: 14px;
            color: #95A5A6;
            margin-top: 8px;
            line-height: 1.5;
        }
        
        /* 列表 */
        .bullet-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .bullet-list li {
            position: relative;
            padding-left: 32px;
            margin-bottom: 16px;
            font-size: 18px;
            line-height: 1.6;
            color: #2C3E50;
        }
        .bullet-list li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: #3498DB;
            border-radius: 50%;
        }
        
        /* 居中内容（封面页） */
        .centered-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
        }
        .centered-content h1 {
            font-size: 56px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 24px;
        }
        .centered-content h2 {
            font-size: 28px;
            font-weight: 400;
            color: #7F8C8D;
            margin-bottom: 48px;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <!-- 页眉：标准页面有，封面页/结束页没有 -->
        <div class="slide-header">
            <h1>页面标题</h1>
        </div>
        
        <!-- 内容区域：在这里填充内容 -->
        <div class="slide-content">
            <!-- 你的内容 -->
        </div>
        
        <!-- 页脚：每页都有 -->
        <div class="slide-footer">
            <div class="source">数据来源：XXX</div>
            <div class="page-number">X / ${totalSlides}</div>
        </div>
    </div>
</body>
</html>
<!-- END SLIDE X -->
\`\`\`

### 2. 内容填充规则

**封面页（第1页）：**
\`\`\`html
<div class="slide-content">
    <div class="centered-content">
        <h1>${title}</h1>
        <h2>副标题</h2>
        <div class="date">${currentDate}</div>
    </div>
</div>
\`\`\`

**数据展示页：**
\`\`\`html
<div class="slide-content">
    <div class="grid-4">
        <div class="metric-card">
            <div class="metric-label">指标名称</div>
            <div class="metric-value">50<span class="metric-unit">家</span></div>
            <div class="metric-description">说明文字</div>
        </div>
        <!-- 重复3次 -->
    </div>
</div>
\`\`\`

**要点列表页：**
\`\`\`html
<div class="slide-content">
    <ul class="bullet-list">
        <li>要点1</li>
        <li>要点2</li>
        <li>要点3</li>
    </ul>
</div>
\`\`\`

### 3. 质量要求

- ✅ 每页必须使用上述模板结构
- ✅ 页眉高度80px，页脚高度50px，固定不变
- ✅ 内容区域：top: 80px, bottom: 50px，绝对不能溢出
- ✅ 所有文字必须在容器内完全可见
- ✅ 页码格式：X / ${totalSlides}
- ✅ 数据来源：每页底部左侧

### 4. 禁止事项

- ❌ 不能修改基础CSS（容器尺寸、页眉页脚位置）
- ❌ 不能让内容溢出容器
- ❌ 不能使用滚动条
- ❌ 不能捏造数据

## 演示文稿信息

- 标题：${title}
- 总页数：${totalSlides}
- 当前日期：${currentDate}

## 原始文档

${originalDocument}

## 文档分析

${analyzedDocument}

## 大纲结构

${outlineFormatted}

## 输出要求（非常重要！）

**必须**生成${totalSlides}页HTML，**每页必须**用注释标记包裹：

\`\`\`
<!-- SLIDE 1 -->
<!DOCTYPE html>
...完整的HTML...
</html>
<!-- END SLIDE 1 -->

<!-- SLIDE 2 -->
<!DOCTYPE html>
...完整的HTML...
</html>
<!-- END SLIDE 2 -->
\`\`\`

**注意**：
- 第1页：封面页（无页眉，使用.centered-content）
- 第2-${totalSlides - 1}页：内容页（有页眉）
- 第${totalSlides}页：结束页（无页眉，使用.centered-content）
- **每页都必须有<!-- SLIDE X -->和<!-- END SLIDE X -->标记**
- **不要在标记之间添加任何其他文字或解释**

现在开始生成${totalSlides}页HTML！`;
}
