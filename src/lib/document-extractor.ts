import mammoth from "mammoth";
import * as pdfParse from "pdf-parse";

export interface ExtractedDocument {
  text: string;
  pageCount?: number;
  format: "pdf" | "docx" | "doc" | "txt" | "md";
}

export async function extractDocumentText(
  buffer: Buffer,
  fileType: string
): Promise<ExtractedDocument> {
  const type = fileType.toLowerCase();

  switch (type) {
    case "pdf":
      return extractPdf(buffer);
    case "docx":
    case "doc":
      return extractWord(buffer, type as "doc" | "docx");
    case "txt":
    case "md":
      return extractText(buffer, type as "txt" | "md");
    default:
      throw new Error(`Unsupported format: ${type}`);
  }
}

async function extractPdf(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    const data = await pdfParse(buffer);
    const text = (data.text || "").trim();

    if (!text) {
      throw new Error("No text content found in PDF");
    }

    return {
      text,
      pageCount: data.numpages,
      format: "pdf",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
    throw new Error("PDF extraction failed");
  }
}

async function extractWord(
  buffer: Buffer,
  type: "doc" | "docx"
): Promise<ExtractedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value || "").trim();

    if (!text) {
      throw new Error("No text content found in document");
    }

    return {
      text,
      format: type,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${type.toUpperCase()} extraction failed: ${error.message}`);
    }
    throw new Error(`${type.toUpperCase()} extraction failed`);
  }
}

function extractText(
  buffer: Buffer,
  type: "txt" | "md"
): ExtractedDocument {
  try {
    const text = buffer.toString("utf-8").trim();

    if (!text) {
      throw new Error("File is empty");
    }

    return {
      text,
      format: type,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }
    throw new Error("Text extraction failed");
  }
}

/**
 * Clean extracted text - normalize whitespace and line breaks
 */
export function cleanText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
