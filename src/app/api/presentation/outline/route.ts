import { getUserIdOrDev } from "@/lib/dev-user";
import { modelPicker } from "@/lib/model-picker";
import { auth } from "@/server/auth";
import { streamText } from "ai";
import { NextResponse } from "next/server";

interface OutlineRequest {
  prompt: string;
  numberOfCards: number;
  language: string;
  modelProvider?: string;
  modelId?: string;
}

const outlineTemplate = `Given the following presentation topic and requirements, generate a structured outline with {numberOfCards} main topics in markdown format.
The outline should be in {language} language and it very important.

Current Date: {currentDate}
Topic: {prompt}

First, generate an appropriate title for the presentation, then create exactly {numberOfCards} main topics that would make for an engaging and well-structured presentation.

Format the response starting with the title in XML tags, followed by markdown content with each topic as a heading and 2-3 bullet points describing the key content.

Example format:
<TITLE>Your Generated Presentation Title Here</TITLE>

# First Main Topic
- Key point or data to highlight
- Visual element suggestion (chart/image/list)
- Main takeaway message

# Second Main Topic
- Core concept to explain
- Supporting evidence or example
- Layout recommendation

# Third Main Topic
- Primary insight
- Data visualization idea
- Conclusion or impact

Make sure the topics:
1. Flow logically from one to another
2. Cover the key aspects of the main topic
3. Have clear, concise headings (5-10 words)
4. Include 2-3 bullet points per topic describing:
   - Key content/data to show
   - Suggested visual elements (charts, images, lists, timelines, etc.)
   - Layout or design recommendations
5. Keep bullet points brief (one sentence each)
6. Do not use bold, italic or underline
7. Focus on actionable content that helps design the slide`;

export async function POST(req: Request) {
  try {
    const session = await auth();
    // 开发模式:确保测试用户存在
    await getUserIdOrDev(session);

    const {
      prompt,
      numberOfCards,
      language,
      modelProvider = "openrouter",
      modelId = "google/gemini-2.5-flash",
    } = (await req.json()) as OutlineRequest;

    console.log(`🎯 大纲生成请求:`, {
      prompt: prompt?.substring(0, 100) + "...",
      numberOfCards,
      language,
      modelProvider,
      modelId
    });

    if (!prompt || !numberOfCards || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const languageMap: Record<string, string> = {
      "en-US": "English (US)",
      pt: "Portuguese",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      ru: "Russian",
      hi: "Hindi",
      ar: "Arabic",
    };

    const actualLanguage = languageMap[language] ?? language; // Fallback to the original if not found
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const model = modelPicker(modelProvider, modelId);
    console.log(`📚 使用大纲生成模型: ${modelProvider}/${modelId}`);

    // Format the prompt with template variables
    const formattedPrompt = outlineTemplate
      .replace(/{numberOfCards}/g, numberOfCards.toString())
      .replace(/{language}/g, actualLanguage)
      .replace(/{currentDate}/g, currentDate)
      .replace(/{prompt}/g, prompt);

    console.log(`🚀 开始生成大纲...`);
    const result = streamText({
      model,
      prompt: formattedPrompt,
      maxTokens: 2000,
      temperature: 0.7,
      abortSignal: AbortSignal.timeout(60000), // 60秒超时
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in outline generation:", error);
    return NextResponse.json(
      { error: "Failed to generate outline" },
      { status: 500 },
    );
  }
}
