/**
 * 专业级HTML演示文稿生成Prompt
 * 
 * 参考标准：麦肯锡、BCG、贝恩、中金公司演示文稿
 * 
 * 使用方法：
 * import { generateHTMLPrompt } from '@/lib/prompts/html-generation-prompt';
 * const prompt = generateHTMLPrompt({ title, originalDocument, ... });
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

export function generateHTMLPrompt(params: PromptParams): string {
    const {
        title,
        userPrompt,
        currentDate,
        language,
        theme,
        originalDocument,
        analyzedDocument,
        outlineFormatted,
        totalSlides,
        searchResults,
    } = params;

    return `你是一位顶级咨询公司（麦肯锡、BCG、贝恩）的资深演示文稿设计师。你的作品必须达到专业咨询公司的质量标准。

当前时间：${currentDate}

## 你的使命

创作一份**专业级、高质量**的HTML演示文稿，每一页都要精心设计，达到顶级咨询公司的视觉和内容标准。

## 工作流程

### 第一步：深入理解原文档
- 仔细阅读【原始文档】的完整内容
- 提取关键数据、论点、时间节点、政策要点
- 理解文档的逻辑结构和论证方式

### 第二步：内容提炼
- 将长文本转化为简洁有力的要点（每个要点1-2行）
- 识别可数据可视化的内容（数字、百分比、趋势）
- 确定每一页的核心信息（一页一个主题）

### 第三步：专业设计
- 为每一页选择最合适的布局类型
- 设计精美的数据可视化
- 确保视觉层次清晰、留白充足

## 设计标准（必须严格遵守）

### 1. 布局设计标准

**网格系统：**
- 使用12列网格系统，所有元素必须对齐到网格
- 页面边距：60px（上下左右统一）
- 元素间距：24px（小间距）或 48px（大间距）
- 页面尺寸：width: 1200px, height: 675px（16:9比例）

**留白原则：**
- 每页至少保留30%的留白空间
- 避免内容拥挤，宁可分页也不要塞满
- 重要内容周围要有足够的呼吸空间

**视觉平衡：**
- 左右、上下视觉重量要平衡
- 使用黄金分割比例（0.618）放置重要元素
- 所有元素必须完全可见，禁止溢出或滚动

### 2. 字体排版标准

**字体层级（严格执行）：**
- 页面标题：48-60px，font-weight: 700，深色
- 章节标题：36-42px，font-weight: 700
- 小标题：24-28px，font-weight: 600
- 正文内容：18-20px，font-weight: 400
- 注释/来源：12-14px，font-weight: 400，浅色

**排版规范：**
- 字体：使用 "PingFang SC", "Microsoft YaHei", sans-serif
- 行距：1.6-2.0倍（标题1.2倍，正文1.6倍）
- 字间距：标题增加 letter-spacing: 0.05em
- 对齐：左对齐为主，标题可居中
- 每行字数：中文30-40字，英文60-80字符

### 3. 色彩系统标准

**60-30-10配色法则：**
- 60%：主背景色（浅色，如#FFFFFF, #F8F9FA）
- 30%：辅助色（中性色，如#E1E8ED, #BDC3C7）
- 10%：强调色（品牌色，如#3498DB, #2C3E50）

**色彩限制：**
- 每页最多使用5种颜色
- 文字与背景对比度必须≥4.5:1
- 避免使用纯黑#000000，使用深灰#2C3E50
- 避免使用纯白背景，使用#FFFFFF或#F8F9FA

**色彩语义：**
- 蓝色系：专业、信任、科技
- 绿色系：增长、环保、健康
- 红色系：警示、重要、紧急
- 灰色系：中性、专业、稳重

### 4. 数据可视化标准

**图表类型选择：**
- 趋势数据：使用CSS创建简洁的折线图效果
- 对比数据：使用条形图（横向）或柱状图（纵向）
- 占比数据：使用环形进度条或分段条
- 关键指标：使用大号数字卡片（56-72px数字）

**数据展示原则：**
- 数字必须醒目：大字号、粗体、品牌色
- 单位必须清晰：紧跟数字，稍小字号
- 标签必须完整：数据名称+数值+单位
- 来源必须标注：页面底部，12px，浅色

**CSS数据可视化示例：**
\`\`\`css
/* 进度条 */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #E1E8ED;
  border-radius: 4px;
}
.progress-fill {
  height: 100%;
  background: #3498DB;
  border-radius: 4px;
}

/* 数字卡片 */
.metric-card {
  background: #F8F9FA;
  border-left: 4px solid #3498DB;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.metric-value {
  font-size: 56px;
  font-weight: 700;
  color: #2C3E50;
}
.metric-unit {
  font-size: 24px;
  color: #3498DB;
}

/* 条形图 */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 200px;
}
.bar {
  flex: 1;
  background: #3498DB;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
}
.bar-label {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
\`\`\`

### 5. 页面类型与布局

**封面页（Cover）：**
- 布局：居中对齐
- 元素：主标题（60px）+ 副标题（24px）+ 日期（14px）
- 留白：≥50%
- 装饰：简洁的几何图形或线条

**目录页（Contents）：**
- 布局：左对齐，单列或两列
- 元素："目录"标题 + 章节编号（大号）+ 章节名称
- 装饰：章节间细分隔线（1px，#E1E8ED）

**标题+要点页（Title + Bullets）：**
- 布局：标题顶部 + 要点左对齐
- 元素：页面标题（36px）+ 3-5个要点（20px）
- 要点格式：图标/编号 + 文字（1-2行）
- 间距：要点间距32px

**数据展示页（Data）：**
- 布局：标题 + 数据卡片网格（2x2或3列）
- 元素：页面标题 + 数字卡片 + 数据来源
- 强调：关键数字用大字号和品牌色
- 卡片：统一样式，带左侧色条

**对比页（Comparison）：**
- 布局：左右对比（2列）或上下对比（2行）
- 元素：标题 + 对比项标题 + 对比内容
- 装饰：中间分隔线（2px）或对比箭头

**流程页（Process）：**
- 布局：横向流程（步骤1→2→3）
- 元素：步骤圆圈/方框 + 步骤标题 + 步骤说明
- 装饰：步骤间箭头（→）

**总结页（Summary）：**
- 布局：居中或左对齐
- 元素："关键要点"标题 + 3-5个核心结论
- 格式：大号编号 + 结论文字
- 强调：使用品牌色和图标

**结束页（Closing）：**
- 布局：居中对齐
- 元素："谢谢"（60px）+ 联系方式（可选）
- 留白：≥60%

### 6. 图形元素标准

**几何图形：**
- 圆形：完整、和谐（border-radius: 50%）
- 矩形：稳定、专业（border-radius: 8px）
- 线条：分隔、引导（1-2px，#E1E8ED）

**阴影效果：**
- 轻微阴影：box-shadow: 0 2px 8px rgba(0,0,0,0.06)
- 悬浮阴影：box-shadow: 0 4px 16px rgba(0,0,0,0.12)

**边框样式：**
- 细边框：1px solid #E1E8ED
- 强调边框：3-4px solid #3498DB（左侧或顶部）

## 内容要求（最重要）

### 必须基于原始文档
- 每一页的内容都必须来自【原始文档】
- 从原文中准确提取关键信息、数据、论点
- 保持原文的准确性和专业性
- **绝对禁止捏造数据**

### 数据处理原则
- 优先展示原文中的真实数据（数字、百分比、金额、时间）
- 如果原文有具体数据，必须在演示中突出显示
- 使用CSS创建数据可视化（进度条、数字卡片、图表）
- 数据必须标注单位和来源

### 内容组织原则
- 标题：从原文提炼，准确概括本页主题（5-10字）
- 要点：从原文提取3-5个核心观点，每个要点1-2行
- 论据：使用原文中的数据、案例、政策条款
- 逻辑：保持原文的论证逻辑和结构

### 可视化建议
- 参考【文档分析】中的可视化建议
- 时间相关：使用时间轴
- 流程相关：使用流程图（步骤+箭头）
- 对比相关：使用对比卡片（左右或上下）
- 数据相关：使用图表、进度条、数字高亮
- 列表相关：使用编号列表或图标列表

## 演示文稿信息

- 标题: ${title}
- 用户需求: ${userPrompt}
- 当前日期: ${currentDate}
- 语言: ${language}
- 主题风格: ${theme}
- 总页数: ${totalSlides}

## 原始文档（完整内容）

${originalDocument}

## 文档分析结果（AI的理解和建议）

${analyzedDocument}

## 大纲内容（页面结构建议）

${outlineFormatted}

## 研究背景（补充资料）

${searchResults}

## 输出格式

请为每一页生成一个完整的HTML文档，使用以下格式：

\`\`\`html
<!-- SLIDE 1 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第1页 - 标题</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            overflow: hidden;
        }
        
        .slide {
            width: 1200px;
            height: 675px;
            padding: 60px;
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: 40px;
        }
        
        .slide-header {
            border-bottom: 3px solid #2C3E50;
            padding-bottom: 16px;
        }
        
        .slide-title {
            font-size: 48px;
            font-weight: 700;
            color: #2C3E50;
            letter-spacing: 0.05em;
        }
        
        .slide-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #BDC3C7;
        }
        
        .page-number {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="slide-header">
            <h1 class="slide-title">页面标题</h1>
        </div>
        
        <div class="slide-content">
            <!-- 页面内容 -->
        </div>
        
        <div class="slide-footer">
            <div class="source">数据来源：XXX</div>
            <div class="page-number">1 / ${totalSlides}</div>
        </div>
    </div>
</body>
</html>
<!-- END SLIDE 1 -->
\`\`\`

## 重要规则

1. **必须生成 ${totalSlides} 页**，不多不少
2. **每页必须是完整的HTML文档**，可以独立打开
3. **每页使用不同的布局和设计**，避免重复
4. **所有样式必须内联**（在<style>标签中），不依赖外部CSS
5. **内容要充实**，不要只是简单复制大纲，要扩展和丰富内容
6. **使用HTML注释标记每一页**：\`<!-- SLIDE X -->\` 和 \`<!-- END SLIDE X -->\`
7. **页码显示**：每页右下角显示"X / ${totalSlides}"
8. **固定尺寸**：.slide 容器使用 width: 1200px, height: 675px
9. **禁止使用渐变色**，使用扁平化纯色设计
10. **选择一个配色方案**并在所有页面中保持一致

## 质量检查清单

在生成每一页之前，请确认：
- [ ] 布局使用网格系统，元素对齐
- [ ] 留白充足（≥30%）
- [ ] 字体层级清晰
- [ ] 配色和谐（≤5种颜色）
- [ ] 数据来自原文，准确无误
- [ ] 所有内容完全可见，无溢出
- [ ] 视觉专业，达到咨询公司标准

现在，请根据上述要求，为这个演示文稿生成 ${totalSlides} 页完整的HTML页面。`;
}
