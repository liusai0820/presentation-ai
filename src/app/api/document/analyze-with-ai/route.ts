import { getUserIdOrDev } from "@/lib/dev-user";
import { getAnalyzeModel } from "@/lib/get-configured-model";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { generateObject } from "ai";
import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";

/**
 * AI驱动的文档分析
 * 让AI充分理解文档内容，生成高质量的演示大纲和建议
 */

const outlineSchema = z.object({
  title: z.string().describe("文档主题/演示标题"),
  summary: z.string().describe("文档内容摘要"),
  sections: z.array(
    z.object({
      heading: z.string().describe("章节标题"),
      keyPoints: z.array(z.string()).describe("该章节的3-5个关键要点"),
      suggestions: z.string().describe("该章节可视化建议（如图表、列表等）"),
    })
  ).describe("演示内容章节"),
  estimatedSlides: z.number().describe("建议的幻灯片总数"),
  presentationStyle: z.string().describe("建议的演示风格"),
});

const systemPrompt = `你是一位资深的演示文稿设计师和内容策划师。

你的任务是分析提供的文档内容，理解其核心内容和逻辑关系，然后将其转化为一份高效、吸引人的演示大纲。

## 你的目标：
1. **深入理解** - 完全理解文档的核心主题、主要论点和关键信息
2. **优化结构** - 将冗长的文档重新组织成清晰、逻辑严密的演示结构
3. **提取精华** - 从详细的文本中提炼最重要的要点
4. **可视化建议** - 为每个章节建议最有效的可视化方式
5. **控制篇幅** - 建议合理的幻灯片数量

## 演示设计原则：
- 每张幻灯片一个核心思想
- 3-5个关键要点就足够了（不要超载信息）
- 考虑政府/企业受众：正式、专业、数据驱动
- 标题和要点应该独立成句，不需要看文档也能理解

## 输出要求：
1. 生成5-12张幻灯片的结构
2. 每张幻灯片包含：标题、3-5个关键要点、可视化建议
3. 确保逻辑流畅：引言→主体→结论
4. 考虑时间限制：1张幻灯片约1-2分钟，合理规划篇幅`;

export async function POST(request: NextRequest) {
  try {
    // 开发阶段暂时跳过用户验证
    // const session = await auth();
    // await getUserIdOrDev(session);

    const body = await request.json();
    const { content, fileName, numSlides = 8, language = "zh" } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: "文档内容为空" },
        { status: 400 }
      );
    }

    // 根据文档长度调整prompt
    const contentLength = content.length;
    let adjustedNumSlides = numSlides;
    
    // 根据内容量自动调整幻灯片数量
    if (contentLength < 1000) {
      adjustedNumSlides = Math.max(3, Math.min(5, numSlides));
    } else if (contentLength > 5000) {
      adjustedNumSlides = Math.max(8, Math.min(15, numSlides));
    }

    const userPrompt = `请分析以下文档，为演示制作提供大纲建议。

【文档标题】${fileName || "未命名文档"}

【文档内容】
${content}

【要求】
- 生成约${adjustedNumSlides}张幻灯片的结构
- 语言: ${language === "zh" ? "中文" : "英文"}
- 适用于政府/企业演示（正式、专业）
- 每个要点必须清晰、独立、可操作

请输出结构化的大纲建议。`;

    console.log(`🤖 使用AI分析文档: ${fileName || "未命名"}`);
    console.log(`   - 内容长度: ${contentLength} 字符`);
    console.log(`   - 建议幻灯片数: ${adjustedNumSlides}`);

    // 使用配置的分析模型
    const model = getAnalyzeModel();

    // 使用AI生成结构化大纲
    const result = await generateObject({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      schema: outlineSchema,
    });

    const analyzed = result.object;

    console.log(`✅ AI分析完成`);
    console.log(`   - 标题: ${analyzed.title}`);
    console.log(`   - 章节数: ${analyzed.sections.length}`);
    console.log(`   - 建议幻灯片: ${analyzed.estimatedSlides}`);

    // 将AI输出转换为大纲格式
    const outline = convertToOutlineFormat(analyzed);

    return NextResponse.json({
      analyzed,
      outline,
      metadata: {
        fileName,
        contentLength,
        model: `${env.AI_ANALYZE_PROVIDER}/${env.AI_ANALYZE_MODEL}`,
        language,
      },
    });
  } catch (error) {
    console.error("❌ AI文档分析错误:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "文档分析失败，请检查配置的API密钥是否有效",
      },
      { status: 500 }
    );
  }
}

/**
 * 将AI输出转换为大纲格式
 */
function convertToOutlineFormat(analyzed: z.infer<typeof outlineSchema>): string[] {
  const outline: string[] = [];

  // 标题
  outline.push(`# ${analyzed.title}`);

  // 各章节
  analyzed.sections.forEach((section, index) => {
    outline.push(`\n## ${index + 1}. ${section.heading}`);
    section.keyPoints.forEach((point) => {
      outline.push(`- ${point}`);
    });
  });

  return outline;
}
