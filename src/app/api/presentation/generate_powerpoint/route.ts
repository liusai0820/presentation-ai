import { type AnalyzedContent } from "@/lib/content-analyzer/types";
import { getUserIdOrDev } from "@/lib/dev-user";
import { getGenerateModel } from "@/lib/get-configured-model";
import { auth } from "@/server/auth";
import { generateText } from "ai";
import { NextResponse } from "next/server";

interface PowerPointRequest {
  title: string;
  prompt: string;
  outline: string[];
  numSlides: number;
  language: string;
  theme?: string;
  searchResults?: Array<{ query: string; results: unknown[] }>;
  analyzedDocument?: AnalyzedContent | null;
  originalDocument?: string | null;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = getUserIdOrDev(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as PowerPointRequest;
    const {
      title,
      prompt: userPrompt,
      outline,
      numSlides,
      language,
      theme = "professional",
      searchResults,
      analyzedDocument,
      originalDocument,
    } = body;

    console.log("📊 PowerPoint生成请求:", {
      title,
      numSlides,
      language,
      theme,
      hasSearchResults: !!searchResults,
      hasDocument: !!analyzedDocument,
    });

    // 格式化大纲
    const outlineFormatted = outline
      .map((item, index) => `${index + 1}. ${item}`)
      .join("\n");

    // 格式化搜索结果
    let searchContext = "";
    if (searchResults && searchResults.length > 0) {
      searchContext = searchResults
        .map((sr) => {
          const results = sr.results as Array<{
            title?: string;
            content?: string;
            url?: string;
          }>;
          return `查询: ${sr.query}\n结果:\n${results
            .map(
              (r, i) =>
                `${i + 1}. ${r.title || "无标题"}\n   ${r.content || "无内容"}\n   来源: ${r.url || "未知"}`,
            )
            .join("\n")}`;
        })
        .join("\n\n");
    }

    // 格式化文档分析
    let documentContext = "";
    if (analyzedDocument) {
      documentContext = `
文档标题: ${analyzedDocument.title}
文档摘要: ${analyzedDocument.summary}
主要章节:
${analyzedDocument.sections
          .map(
            (section, i) =>
              `${i + 1}. ${section.heading}\n   关键点: ${section.keyPoints.join(", ")}`,
          )
          .join("\n")}
`;
    }

    // 当前日期
    const currentDate = new Date().toLocaleDateString(
      language === "zh" ? "zh-CN" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const systemPrompt = `You are a professional PowerPoint presentation designer specializing in creating visually rich, component-based layouts. CRITICAL: Every slide MUST include special visual components (BULLETS, COLUMNS, ARROWS, TABLE, PYRAMID, TIMELINE, ICONS). NO pure text pages allowed!

## Mandatory Component Rules
Slide 1-2: COVER + plain content with narrative
Slide 3-4: MUST use BULLETS and COLUMNS (different types)
Slide 5: MUST use ARROWS for process/workflow
Slide 6: MUST use TABLE with real data
Slide 7: MUST use PYRAMID or TIMELINE
Slide 8: MUST use ICONS for conclusions
Every adjacent pair of slides must have DIFFERENT component types.

## Component Examples
<BULLETS><DIV><H3>Point</H3><P>Detailed explanation 200 words</P></DIV></BULLETS>
<COLUMNS><COLUMN><H3>Left Side</H3><P>Content</P></COLUMN><COLUMN><H3>Right</H3><P>More</P></COLUMN></COLUMNS>
<ARROWS><DIV><H3>Phase 1</H3><P>Details</P></DIV><DIV><H3>Phase 2</H3><P>Next step</P></DIV></ARROWS>
<TABLE><TR><TH>Header1</TH><TH>Header2</TH></TR><TR><TD>Data1</TD><TD>Data2</TD></TR></TABLE>
<PYRAMID><DIV><H3>Top</H3><P>Most important</P></DIV><DIV><H3>Base</H3><P>Foundation</P></DIV></PYRAMID>
<TIMELINE><DIV><H3>2024</H3><P>Event</P></DIV><DIV><H3>2025</H3><P>Future</P></DIV></TIMELINE>
<ICONS><ICON query="check"><H3>Benefit1</H3><P>Explanation</P></ICON><ICON query="target"><H3>Goal</H3><P>Target</P></ICON></ICONS>

## Image Query Format (MUST be English)
[Main Subject] [Action/Setting] [Style] [Mood/Atmosphere]
Example: modern business team collaborating in open office workspace, professional corporate photography, bright minimalist aesthetic, warm natural lighting

## Output Structure
<PRESENTATION>
  <SECTION>
    <H1>Main Title</H1>
    <BULLETS>
      <DIV><H3>Key Point 1</H3><P>Detailed explanation with specific examples or data. 150-200 words minimum.</P></DIV>
      <DIV><H3>Key Point 2</H3><P>Another detailed point with supporting information and practical examples.</P></DIV>
    </BULLETS>
    <IMG query="detailed English image description here" />
  </SECTION>
</PRESENTATION>

KEY REQUIREMENTS:
- Each slide MUST have 200-300 words minimum
- Every slide MUST have exactly ONE special component
- Every slide MUST have one IMG tag with English query
- Each component must be DIFFERENT from adjacent slides
- All tags must be properly closed
- No custom tags or attributes on SECTION tags`;

    const userPromptText = `
## Presentation Details
- Title: ${title}
- User Request: ${userPrompt}
- Date: ${currentDate}
- Language: ${language}
- Theme: ${theme}
- Total Slides Needed: ${numSlides}

## Outline to Follow
${outlineFormatted}

${searchContext ? `## Research Background\n${searchContext}\n` : ""}
${documentContext ? `## Document Analysis\n${documentContext}\n` : ""}
${originalDocument ? `## Original Document\n${originalDocument.substring(0, 2000)}...\n` : ""}

Generate ${numSlides} professional PowerPoint slides in XML format. 
CRITICAL: Apply the mandatory component rules strictly - vary components across slides, use rich layouts, include data-driven components like tables and charts.
Remember:
1. Use correct XML format with SECTION tags (no attributes)
2. Each slide 200-300 words
3. Use diverse special components (BULLETS, COLUMNS, ARROWS, TABLE, PYRAMID, TIMELINE, ICONS)
4. Every image query must be detailed and in English
5. Content must be professional and comprehensive
`;

    console.log("🤖 开始调用AI生成PowerPoint XML...");

    // 使用环境变量配置的生成模型
    const model = getGenerateModel();

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: userPromptText,
      temperature: 0.7,
      // 不限制 maxTokens，让模型生成尽可能详细的内容
    });

    console.log("✅ PowerPoint XML生成完成");
    console.log("📄 XML长度:", text.length);

    // 返回纯文本XML
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ PowerPoint生成错误:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PowerPoint",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
