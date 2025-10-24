/**
 * V3版本 - 超级简化，强制格式
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

export function generateHTMLPromptV3(params: PromptParams): string {
  const {
    title,
    originalDocument,
    analyzedDocument,
    outlineFormatted,
    totalSlides,
    currentDate,
  } = params;

  return `你是麦肯锡的演示文稿设计师。生成${totalSlides}页专业HTML演示文稿。

## 强制格式（必须严格遵守）

每页HTML必须用注释包裹：
\`\`\`
<!-- SLIDE 1 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>第1页 - 封面</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            background: #F8F9FA;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }
        .slide {
            width: 1200px;
            height: 675px;
            background: #FFF;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 80px;
            padding: 24px 60px;
            border-bottom: 2px solid #E1E8ED;
        }
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #2C3E50;
            margin: 0;
        }
        .content {
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 50px;
            padding: 40px 60px;
            overflow: hidden;
        }
        .footer {
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
        }
        .footer .source { font-size: 12px; color: #95A5A6; }
        .footer .page { font-size: 14px; color: #7F8C8D; font-weight: 600; }
        .centered {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
        }
        .centered h1 { font-size: 56px; font-weight: 700; color: #2C3E50; margin-bottom: 24px; }
        .centered h2 { font-size: 28px; font-weight: 400; color: #7F8C8D; margin-bottom: 48px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
        .grid-4 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .card {
            background: #F8F9FA;
            border-left: 4px solid #3498DB;
            padding: 32px 24px;
            border-radius: 8px;
            text-align: center;
        }
        .card .value {
            font-size: 56px;
            font-weight: 700;
            color: #2C3E50;
            line-height: 1;
        }
        .card .unit { font-size: 24px; color: #3498DB; font-weight: 600; }
        .card .label { font-size: 16px; color: #7F8C8D; margin-top: 12px; }
        .card .desc { font-size: 14px; color: #95A5A6; margin-top: 8px; line-height: 1.5; }
        ul { list-style: none; margin: 0; padding: 0; }
        li {
            position: relative;
            padding-left: 32px;
            margin-bottom: 16px;
            font-size: 18px;
            line-height: 1.6;
            color: #2C3E50;
        }
        li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: #3498DB;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="content">
            <div class="centered">
                <h1>${title}</h1>
                <h2>副标题</h2>
                <div style="font-size: 16px; color: #95A5A6;">${currentDate}</div>
            </div>
        </div>
        <div class="footer">
            <div class="source">数据来源：深圳市科技创新局</div>
            <div class="page">1 / ${totalSlides}</div>
        </div>
    </div>
</body>
</html>
<!-- END SLIDE 1 -->
\`\`\`

## 页面类型

**第1页（封面）**：使用.centered，无.header
**第2-${totalSlides-1}页（内容）**：有.header，内容用.grid-2/.grid-4/.card/ul
**第${totalSlides}页（结束）**：使用.centered，无.header

## 内容来源

从以下文档提取真实内容：

${originalDocument.substring(0, 5000)}

## 大纲

${outlineFormatted}

## 要求

1. **必须**生成${totalSlides}页
2. **必须**用<!-- SLIDE X -->和<!-- END SLIDE X -->包裹
3. **必须**使用上面的CSS（可以微调，但不能改变容器尺寸）
4. **必须**从原文档提取真实数据
5. **禁止**捏造数据
6. **禁止**内容溢出

现在生成${totalSlides}页HTML：`;
}
