/**
 * AI分析后的文档内容类型定义
 */

export interface AnalyzedSection {
  heading: string;
  keyPoints: string[];
  suggestions: string;
}

export interface AnalyzedContent {
  title: string;
  summary: string;
  sections: AnalyzedSection[];
  estimatedSlides: number;
  presentationStyle: string;
}
