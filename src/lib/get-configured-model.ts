import { env } from "@/env";
import { modelPicker } from "./model-picker";
import { type LanguageModelV1 } from "ai";

/**
 * 获取文档分析模型
 * 使用于理解文档内容、提取大纲、氙化等
 * 推荐用高质量模型（如Claude、Gemini等）
 */
export function getAnalyzeModel(): LanguageModelV1 {
  const modelProvider = env.AI_ANALYZE_PROVIDER;
  const modelId = env.AI_ANALYZE_MODEL;

  console.log(`📚 使用文档分析模型: ${modelProvider}/${modelId}`);

  return modelPicker(modelProvider, modelId);
}

/**
 * 获取演示生成模型
 * 使用于样式、标记、HTML等生成
 * 可以用快速模型（不需要高质量）
 */
export function getGenerateModel(): LanguageModelV1 {
  const modelProvider = env.AI_GENERATE_PROVIDER;
  const modelId = env.AI_GENERATE_MODEL;

  console.log(`🌨️ 使用演示生成模型: ${modelProvider}/${modelId}`);

  return modelPicker(modelProvider, modelId);
}

/**
 * 获取配置的AI模型（通用）
 * 使用env中的AI_MODEL_PROVIDER和AI_MODEL_ID
 * 向后兼容原来的代码
 */
export function getConfiguredModel(): LanguageModelV1 {
  const modelProvider = env.AI_MODEL_PROVIDER || env.AI_ANALYZE_PROVIDER;
  const modelId = env.AI_MODEL_ID || env.AI_ANALYZE_MODEL;

  console.log(`📎 使用配置的模型: ${modelProvider}/${modelId}`);

  return modelPicker(modelProvider, modelId);
}
