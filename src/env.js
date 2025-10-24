import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    TAVILY_API_KEY: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    OPENAI_API_KEY: z.string().optional(),
    TOGETHER_AI_API_KEY: z.string().optional(),
    OPENROUTER_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    UNSPLASH_ACCESS_KEY: z.string().optional(),
    
    // 文档分析模型配置（用于理解文档、生成大纲）
    AI_ANALYZE_PROVIDER: z.string().default("openrouter").describe("文档分析模型提供者"),
    AI_ANALYZE_MODEL: z.string().default("google/gemini-2.5-pro").describe("文档分析模型ID（推荐用高质量模型理解文档）"),
    
    // 演示生成模型配置（用于生成HTML、样式等）
    AI_GENERATE_PROVIDER: z.string().default("openrouter").describe("演示生成模型提供者"),
    AI_GENERATE_MODEL: z.string().default("x-ai/grok-2-fast").describe("演示生成模型ID（可用快速模型）"),
    
    // 通用模型配置（向后兼容）
    AI_MODEL_PROVIDER: z.string().default("openrouter").optional(),
    AI_MODEL_ID: z.string().default("x-ai/grok-2-fast").optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TOGETHER_AI_API_KEY: process.env.TOGETHER_AI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AI_ANALYZE_PROVIDER: process.env.AI_ANALYZE_PROVIDER,
    AI_ANALYZE_MODEL: process.env.AI_ANALYZE_MODEL,
    AI_GENERATE_PROVIDER: process.env.AI_GENERATE_PROVIDER,
    AI_GENERATE_MODEL: process.env.AI_GENERATE_MODEL,
    AI_MODEL_PROVIDER: process.env.AI_MODEL_PROVIDER,
    AI_MODEL_ID: process.env.AI_MODEL_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
