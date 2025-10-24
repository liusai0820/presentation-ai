import { getUserIdOrDev } from "@/lib/dev-user";
import { getGenerateModel } from "@/lib/get-configured-model";
import { generateHTMLPromptV5 } from "@/lib/prompts/html-generation-prompt-v5";
import { auth } from "@/server/auth";
import { streamText } from "ai";
import { NextResponse } from "next/server";

import { type AnalyzedContent } from "@/lib/content-analyzer/types";

interface HTMLSlidesRequest {
  title: string;
  prompt: string;
  outline: string[];
  language: string;
  theme?: string;
  searchResults?: Array<{ query: string; results: unknown[] }>;
  analyzedDocument?: AnalyzedContent | null;
  originalDocumentContent?: string | null;
}

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
    } = (await req.json()) as HTMLSlidesRequest;

    if (!title || !outline || !Array.isArray(outline) || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(`🎨 开始生成HTML演示文稿: ${title}`);
    console.log(`   - 页数: ${outline.length}`);
    console.log(`   - 主题: ${theme}`);
    console.log(`   - 文档分析: ${analyzedDocument ? "有" : "无"}`);
    console.log(`   - 原始文档: ${originalDocumentContent ? `${originalDocumentContent.length}字符` : "无"}`);

    // Format search results
    let searchResultsText = "暂无研究数据";
    if (searchResults && searchResults.length > 0) {
      const searchData = searchResults
        .map((searchItem, index: number) => {
          const query = searchItem.query || `搜索 ${index + 1}`;
          const results = Array.isArray(searchItem.results)
            ? searchItem.results
            : [];

          if (results.length === 0) return "";

          const formattedResults = results
            .slice(0, 3) // 只取前3个结果
            .map((result: unknown) => {
              const resultObj = result as Record<string, unknown>;
              return `- ${resultObj.title || "无标题"}\n  ${resultObj.content || "无内容"}`;
            })
            .join("\n");

          return `**搜索 ${index + 1}:** ${query}\n${formattedResults}`;
        })
        .filter(Boolean)
        .join("\n\n");

      if (searchData) {
        searchResultsText = searchData;
      }
    }

    // Format original document content - 保留完整文档，不截断
    let originalDocumentText = "无原始文档";
    if (originalDocumentContent && originalDocumentContent.trim().length > 0) {
      originalDocumentText = originalDocumentContent;
      console.log(`   - 文档完整长度: ${originalDocumentContent.length}字符`);
    }

    // Format analyzed document
    let analyzedDocumentText = "无文档分析数据";
    if (analyzedDocument) {
      analyzedDocumentText = `
**文档标题**: ${analyzedDocument.title}
**文档摘要**: ${analyzedDocument.summary}
**建议演示风格**: ${analyzedDocument.presentationStyle}
**建议幻灯片数**: ${analyzedDocument.estimatedSlides}

**章节详情**:
${analyzedDocument.sections
          .map(
            (section, idx) => `
### ${idx + 1}. ${section.heading}

**关键要点**:
${section.keyPoints.map((point) => `- ${point}`).join("\n")}

**可视化建议**: ${section.suggestions}
`,
          )
          .join("\n")}
`;
    }

    const currentDate = new Date().toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const model = getGenerateModel();

    // Generate the prompt using the V5 optimized design system
    const formattedPrompt = generateHTMLPromptV5({
      title,
      userPrompt: userPrompt || "无特定需求",
      currentDate,
      language: language === "zh" ? "中文" : "英文",
      theme,
      originalDocument: originalDocumentText,
      analyzedDocument: analyzedDocumentText,
      outlineFormatted: outline.join("\n\n"),
      totalSlides: outline.length,
      searchResults: searchResultsText,
    });

    console.log(`🚀 调用AI生成HTML...`);

    const result = streamText({
      model,
      prompt: formattedPrompt,
      maxTokens: 8000,
      temperature: 0.8,
      abortSignal: AbortSignal.timeout(120000), // 120秒超时
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("❌ HTML演示文稿生成错误:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "HTML演示文稿生成失败",
      },
      { status: 500 },
    );
  }
}
