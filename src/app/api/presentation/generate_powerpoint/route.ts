import { type AnalyzedContent } from "@/lib/content-analyzer/types";
import { getUserIdOrDev } from "@/lib/dev-user";
import { getGenerateModelWithFallback } from "@/lib/get-configured-model";
import { auth } from "@/server/auth";
import { generateText } from "ai";
import { NextResponse } from "next/server";

interface PowerPointRequest {
  title: string;
  prompt: string;
  outline: string[];
  language: string;
  theme?: string;
  searchResults?: Array<{ query: string; results: unknown[] }>;
  analyzedDocument?: AnalyzedContent | null;
  originalDocumentContent?: string | null;
}

// PowerPoint专用模板 - 针对16:9比例和演讲者需求优化
const powerpointTemplate = `
你是一位专业的演示文稿设计专家和演讲顾问。你的任务是创建一个专业的PowerPoint演示文稿，严格按照16:9比例设计，并从演讲者的角度优化内容结构和视觉效果。

## 核心要求

1. **格式**: 使用 <SECTION> 标签创建每张幻灯片
2. **比例**: 严格按照16:9宽屏比例设计（1920x1080像素标准）
3. **演讲者视角**: 内容应便于演讲者讲解，包含演讲提示和逻辑流程
4. **视觉优化**: 每张幻灯片都要有高质量的配图，通过Unsplash获取
5. **内容深度**: 不要简单复制大纲，要扩展并添加实例、数据和上下文

## 演示文稿信息
- 标题: {TITLE}
- 用户需求: {PROMPT}
- 当前日期: {CURRENT_DATE}
- 大纲参考: {OUTLINE_FORMATTED}
- 语言: {LANGUAGE}
- 主题风格: {THEME}
- 总幻灯片数: {TOTAL_SLIDES}

## 研究背景
{SEARCH_RESULTS}

## 文档分析结果
{DOCUMENT_ANALYSIS}

## PowerPoint结构
\`\`\`xml
<PRESENTATION>

<!-- 每张幻灯片必须遵循此结构，针对16:9比例优化 -->
<SECTION layout="title" | "content" | "image-left" | "image-right" | "full-image" | "split" | "conclusion">
  <!-- 必需：包含一个布局组件 -->
  <!-- 必需：包含至少一个详细的图片查询 -->
  <!-- 推荐：包含演讲者备注 -->
</SECTION>

</PRESENTATION>
\`\`\`

## 幻灯片布局类型（针对16:9优化）

### 1. 标题页 (layout="title")
用于开场和章节分隔
\`\`\`xml
<SECTION layout="title">
  <TITLE-SLIDE>
    <H1>主标题</H1>
    <H2>副标题或描述</H2>
    <IMG query="professional business background with modern office or relevant industry imagery" />
    <SPEAKER-NOTE>开场白建议：介绍自己，概述演讲内容，预告关键收获</SPEAKER-NOTE>
  </TITLE-SLIDE>
</SECTION>
\`\`\`

### 2. 内容页 (layout="content")
主要内容展示，左右布局优化
\`\`\`xml
<SECTION layout="content">
  <CONTENT-SLIDE>
    <H2>幻灯片标题</H2>
    <BULLETS>
      <DIV><H3>要点1</H3><P>详细说明和实例</P></DIV>
      <DIV><H3>要点2</H3><P>详细说明和实例</P></DIV>
      <DIV><H3>要点3</H3><P>详细说明和实例</P></DIV>
    </BULLETS>
    <IMG query="relevant professional imagery that supports the content theme" />
    <SPEAKER-NOTE>演讲提示：强调关键数据，准备互动问题，注意时间控制</SPEAKER-NOTE>
  </CONTENT-SLIDE>
</SECTION>
\`\`\`

### 3. 图片主导-左侧 (layout="image-left")
图片在左，内容在右，适合产品展示
\`\`\`xml
<SECTION layout="image-left">
  <IMAGE-LEFT-SLIDE>
    <IMG query="high-quality product shot or relevant professional imagery in 16:9 aspect ratio" />
    <CONTENT>
      <H2>标题</H2>
      <P>核心内容描述</P>
      <BULLETS>
        <DIV><H3>特点1</H3><P>说明</P></DIV>
        <DIV><H3>特点2</H3><P>说明</P></DIV>
      </BULLETS>
    </CONTENT>
    <SPEAKER-NOTE>指向图片进行说明，与观众建立视觉连接</SPEAKER-NOTE>
  </IMAGE-LEFT-SLIDE>
</SECTION>
\`\`\`

### 4. 图片主导-右侧 (layout="image-right")
内容在左，图片在右
\`\`\`xml
<SECTION layout="image-right">
  <IMAGE-RIGHT-SLIDE>
    <CONTENT>
      <H2>标题</H2>
      <P>核心内容</P>
      <BULLETS>
        <DIV><H3>要点1</H3><P>详细说明</P></DIV>
        <DIV><H3>要点2</H3><P>详细说明</P></DIV>
      </BULLETS>
    </CONTENT>
    <IMG query="supporting visual that complements the content in professional style" />
    <SPEAKER-NOTE>先讲解内容要点，再引导观众看图片进行总结</SPEAKER-NOTE>
  </IMAGE-RIGHT-SLIDE>
</SECTION>
\`\`\`

### 5. 全屏图片 (layout="full-image")
用于强烈的视觉冲击
\`\`\`xml
<SECTION layout="full-image">
  <FULL-IMAGE-SLIDE>
    <IMG query="stunning high-resolution image that captures the essence of the topic in 16:9 format" />
    <OVERLAY-TEXT>
      <H1>核心信息</H1>
      <H2>支持性文字</H2>
    </OVERLAY-TEXT>
    <SPEAKER-NOTE>利用视觉冲击力，暂停让观众消化，然后提出关键问题</SPEAKER-NOTE>
  </FULL-IMAGE-SLIDE>
</SECTION>
\`\`\`

### 6. 分屏对比 (layout="split")
左右对比展示
\`\`\`xml
<SECTION layout="split">
  <SPLIT-SLIDE>
    <LEFT-PANEL>
      <H3>方案A / 现状</H3>
      <P>描述内容</P>
      <IMG query="image representing current state or option A" />
    </LEFT-PANEL>
    <RIGHT-PANEL>
      <H3>方案B / 未来</H3>
      <P>描述内容</P>
      <IMG query="image representing future state or option B" />
    </RIGHT-PANEL>
    <SPEAKER-NOTE>先介绍左侧，再对比右侧，强调差异和优势</SPEAKER-NOTE>
  </SPLIT-SLIDE>
</SECTION>
\`\`\`

### 7. 结论页 (layout="conclusion")
总结和行动号召
\`\`\`xml
<SECTION layout="conclusion">
  <CONCLUSION-SLIDE>
    <H2>核心结论</H2>
    <KEY-TAKEAWAYS>
      <DIV><H3>关键收获1</H3><P>简洁总结</P></DIV>
      <DIV><H3>关键收获2</H3><P>简洁总结</P></DIV>
      <DIV><H3>下一步行动</H3><P>具体建议</P></DIV>
    </KEY-TAKEAWAYS>
    <IMG query="inspiring professional image that motivates action and success" />
    <SPEAKER-NOTE>总结要点，提出明确的行动建议，邀请问答互动</SPEAKER-NOTE>
  </CONCLUSION-SLIDE>
</SECTION>
\`\`\`

## 数据可视化组件

### 图表 (适合16:9比例)
\`\`\`xml
<CHART charttype="bar|pie|line|area" title="图表标题">
  <DATA><LABEL>标签1</LABEL><VALUE>数值1</VALUE></DATA>
  <DATA><LABEL>标签2</LABEL><VALUE>数值2</VALUE></DATA>
</CHART>
\`\`\`

### 表格 (优化宽屏显示)
\`\`\`xml
<TABLE title="表格标题">
  <TR><TH>列标题1</TH><TH>列标题2</TH><TH>列标题3</TH></TR>
  <TR><TD>数据1</TD><TD>数据2</TD><TD>数据3</TD></TR>
</TABLE>
\`\`\`

## 图片查询指南

为Unsplash API优化的查询示例：
- "modern office meeting room with large windows and professional lighting"
- "diverse business team collaborating around conference table in bright office"
- "clean minimalist workspace with laptop and coffee in natural light"
- "abstract technology background with blue and white geometric patterns"
- "professional handshake in modern corporate environment"

## 演讲者优化原则

1. **逻辑流程**: 每张幻灯片都要有清晰的逻辑连接
2. **演讲提示**: 包含具体的演讲建议和互动提示
3. **时间控制**: 考虑每张幻灯片的演讲时长
4. **视觉引导**: 图片和文字的配合要便于演讲者引导观众注意力
5. **互动设计**: 适当的问题和停顿点

## 严格规则

1. 生成恰好 {TOTAL_SLIDES} 张幻灯片，不多不少
2. 每张幻灯片必须包含高质量的图片查询
3. 所有布局必须针对16:9比例优化
4. 必须包含演讲者备注 (SPEAKER-NOTE)
5. 内容要从演讲者角度组织，便于现场演讲
6. 图片查询要详细具体，适合Unsplash搜索
7. 使用多样化的布局类型，避免单调
8. 只使用上述定义的XML标签，不要创造新标签

## 重要输出要求

请直接输出XML格式的PowerPoint演示文稿，不要包含任何解释、思考过程或其他文字。

**重要：不要使用markdown代码块，直接输出纯XML内容！**

输出格式必须严格按照以下结构（示例）：

&lt;PRESENTATION&gt;
&lt;SECTION layout="title"&gt;
  &lt;TITLE-SLIDE&gt;
    &lt;H1&gt;主标题&lt;/H1&gt;
    &lt;H2&gt;副标题&lt;/H2&gt;
    &lt;IMG query="详细的图片描述" /&gt;
    &lt;SPEAKER-NOTE&gt;演讲者备注&lt;/SPEAKER-NOTE&gt;
  &lt;/TITLE-SLIDE&gt;
&lt;/SECTION&gt;

&lt;SECTION layout="content"&gt;
  &lt;!-- 其他幻灯片内容 --&gt;
&lt;/SECTION&gt;

&lt;!-- 更多SECTION标签，总共 {TOTAL_SLIDES} 张 --&gt;
&lt;/PRESENTATION&gt;

现在请直接输出包含 {TOTAL_SLIDES} 张幻灯片的完整XML内容，不要添加任何其他文字、标签或markdown格式：
`;

export async function POST(req: Request) {
  try {
    const session = await auth();
    await getUserIdOrDev(session);

    const {
      title,
      prompt: userPrompt,
      outline,
      language,
      theme = "professional",
      searchResults,
      analyzedDocument,
      originalDocumentContent,
    } = (await req.json()) as PowerPointRequest;

    if (!title || !outline || !Array.isArray(outline) || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 格式化搜索结果
    let searchResultsText = "暂无研究数据。";
    if (searchResults && searchResults.length > 0) {
      const searchData = searchResults
        .map((searchItem, index: number) => {
          const query = searchItem.query || `搜索 ${index + 1}`;
          const results = Array.isArray(searchItem.results)
            ? searchItem.results
            : [];

          if (results.length === 0) return "";

          const formattedResults = results
            .map((result: unknown) => {
              const resultObj = result as Record<string, unknown>;
              return `- ${resultObj.title || "无标题"}\n  ${resultObj.content || "无内容"}\n  ${resultObj.url || "无链接"}`;
            })
            .join("\n");

          return `**搜索查询 ${index + 1}:** ${query}\n**结果:**\n${formattedResults}\n---`;
        })
        .filter(Boolean)
        .join("\n\n");

      if (searchData) {
        searchResultsText = `在大纲生成过程中进行了以下研究:\n\n${searchData}`;
      }
    }

    // 格式化文档分析结果
    let documentAnalysisText = "无文档分析数据。";
    if (analyzedDocument) {
      documentAnalysisText = `
**文档分析结果:**
- 文档类型: ${(analyzedDocument as any).documentType || "未知"}
- 主要主题: ${(analyzedDocument as any).mainTopics?.join(", ") || "无"}
- 关键概念: ${(analyzedDocument as any).keyConcepts?.join(", ") || "无"}
- 结构信息: ${(analyzedDocument as any).structure ? JSON.stringify((analyzedDocument as any).structure) : "无"}

${originalDocumentContent ? `**原始文档内容摘要:**\n${originalDocumentContent.substring(0, 1000)}...` : ""}
      `.trim();
    }

    const currentDate = new Date().toLocaleDateString(
      language === "zh" ? "zh-CN" : "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const model = await getGenerateModelWithFallback();

    // 使用模板变量格式化提示
    const formattedPrompt = powerpointTemplate
      .replace(/{TITLE}/g, title)
      .replace(/{PROMPT}/g, userPrompt || "无特定需求")
      .replace(/{CURRENT_DATE}/g, currentDate)
      .replace(/{LANGUAGE}/g, language === "zh" ? "中文" : "英文")
      .replace(/{THEME}/g, theme)
      .replace(/{OUTLINE_FORMATTED}/g, outline.join("\n\n"))
      .replace(/{TOTAL_SLIDES}/g, outline.length.toString())
      .replace(/{SEARCH_RESULTS}/g, searchResultsText)
      .replace(/{DOCUMENT_ANALYSIS}/g, documentAnalysisText);

    console.log(`🎨 生成PowerPoint演示文稿: ${title}`);
    console.log(`📊 幻灯片数量: ${outline.length}`);
    console.log(`🎯 主题风格: ${theme}`);

    const result = await generateText({
      model,
      prompt: formattedPrompt,
    });

    console.log("✅ PowerPoint XML生成完成");
    console.log(`📊 生成内容长度: ${result.text.length} 字符`);
    console.log(`🔤 前100字符: ${result.text.substring(0, 100)}...`);

    // 返回完整的XML内容
    return new Response(result.text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("PowerPoint生成错误:", error);
    return NextResponse.json(
      { error: "生成PowerPoint演示文稿失败" },
      { status: 500 },
    );
  }
}
