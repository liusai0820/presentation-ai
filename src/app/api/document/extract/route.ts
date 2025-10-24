import { type NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
// PDF提取简化版 - 使用更可靠的流程

interface ExtractResponse {
  content: string;
  fileName: string;
  fileType: string;
  charCount: number;
}

/**
 * 提取PDF文件的文本内容
 * 注：PDF提取比较辛苦，我们目前使用一个简化方案
 * 正式的解決案是使用专業的PDF库或每调用外部服务
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // PDF文件有效性检查
  if (buffer.length < 5 || buffer.subarray(0, 4).toString() !== "%PDF") {
    throw new Error("PDF文件不有效，请确保上传的是真实的PDF文件");
  }

  // 目前的解决方案：返回一个PDF效位字符串，演示仚ai分析可以处理PDF
  // 正第的处理应该是使用云端或专业的PDF提取服务
  
  // 为PDF效效，方案是：
  // 1. 使用Cloud API (e.g., AWS Textract, Google Document AI)
  // 2. 或者不过分PDF预提示用户需要两次转换
  const placeholder = `[PDF文档] 消息：正强大的PDF提取需要专求的处理。\n\n建议查看：为PDF文件，你可以\n1. 先转换成Word/Text格式\n2. 或者使用对象存储上传\n3. 程序将通过餐付服务提供PDF支持\n\n替改方案：\n- 上传Word、纯文本或Markdown文件\n- 这些格式宜提取效果更好`;

  return placeholder;
}

/**
 * 提取Word文件的文本内容 - 支持.doc不.docx
 */
async function extractWordText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    const text = result.value || "";
    
    // 如果有错误，岝管它们是警告，但事实上我们仍然有不少文本
    if (result.messages && result.messages.length > 0) {
      console.warn("Word解析警告:", result.messages);
    }
    
    if (!text || text.trim().length === 0) {
      throw new Error("Word文件中没有可提取的文本");
    }
    return text;
  } catch (error) {
    console.error("Word解析错误:", error);
    throw new Error(
      error instanceof Error ? error.message : "无法解析Word文件"
    );
  }
}

/**
 * 提取纯文本文件的内容
 */
async function extractTextFile(buffer: Buffer): Promise<string> {
  try {
    const text = buffer.toString("utf-8");
    if (!text || text.trim().length === 0) {
      throw new Error("文本文件为空");
    }
    return text;
  } catch (error) {
    console.error("文本文件解析错误:", error);
    throw new Error(
      error instanceof Error ? error.message : "无法读取文本文件"
    );
  }
}

/**
 * 清理提取的文本，移除多余的空白和换行
 */
function cleanText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n") // 将多个换行替换为两个
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "没有提供文件" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // 根据文件类型选择解析方式
    if (fileName.endsWith(".pdf")) {
      extractedText = await extractPdfText(buffer);
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      extractedText = await extractWordText(buffer);
    } else if (
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md")
    ) {
      extractedText = await extractTextFile(buffer);
    } else {
      return NextResponse.json(
        { message: `不支持的文件格式: ${fileName}` },
        { status: 400 }
      );
    }

    // 清理文本
    const cleanedText = cleanText(extractedText);

    if (cleanedText.length === 0) {
      return NextResponse.json(
        { message: "文件中没有可提取的内容" },
        { status: 400 }
      );
    }

    const response: ExtractResponse = {
      content: cleanedText,
      fileName: file.name,
      fileType: fileName.split(".").pop() || "unknown",
      charCount: cleanedText.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("文档提取API错误:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "文档解析失败，请重试",
      },
      { status: 500 }
    );
  }
}
