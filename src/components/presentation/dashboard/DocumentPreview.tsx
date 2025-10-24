"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";
import { type AnalyzedContent } from "@/lib/content-analyzer/types";

interface DocumentPreviewProps {
  analyzed: AnalyzedContent;
  onConfirm?: () => void;
  isConfirming?: boolean;
}

export function DocumentPreview({
  analyzed,
  onConfirm,
  isConfirming = false,
}: DocumentPreviewProps) {

  return (
    <div className="space-y-4">
      {/* 头部信息 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-lg font-semibold text-foreground">
          {analyzed.title || "无标题"}
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">推荐幻灯片数</p>
            <p className="text-2xl font-bold text-primary">
              {analyzed.estimatedSlides}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">章节数</p>
            <p className="text-2xl font-bold text-primary">
              {analyzed.sections.length}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">演示风格</p>
            <p className="text-sm font-medium text-primary">
              {analyzed.presentationStyle}
            </p>
          </div>
        </div>

        {/* 摘要 */}
        {analyzed.summary && (
          <div className="mt-3">
            <p className="text-xs font-medium text-muted-foreground">内容摘要</p>
            <p className="mt-1 text-sm text-foreground">
              {analyzed.summary}
            </p>
          </div>
        )}
      </div>

      {/* 演示章节 */}
      {analyzed.sections && Array.isArray(analyzed.sections) && analyzed.sections.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-medium text-foreground">📄 演示章节结构</h4>
          <div className="mt-3 space-y-3">
            {analyzed.sections.map((section, index: number) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <p className="font-medium text-foreground">
                  {index + 1}. {section.heading}
                </p>
                <ul className="mt-1 space-y-1">
                  {section.keyPoints && Array.isArray(section.keyPoints) && section.keyPoints.map((point: string, pIndex: number) => (
                    <li key={pIndex} className="text-xs text-muted-foreground">
                      • {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <span className="font-medium">📈 建议:</span> {section.suggestions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 歩骤总结 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="font-medium text-foreground">📋 内容总结</h4>

        <div className="mt-3 space-y-2">
          {analyzed.sections.map((section, index) => (
            <div key={index} className="border-l-2 border-muted-foreground/30 pl-3">
              <p className="font-medium text-sm text-foreground">{index + 1}. {section.heading}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 提示信息 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-900 dark:text-blue-100">
            系统已识别出文档结构,点击下方"一键生成"按钮将基于此结构自动生成演示大纲。
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <Button
          onClick={onConfirm}
          className="flex-1 gap-2"
          size="lg"
          disabled={isConfirming}
        >
          <Check className="h-4 w-4" />
          {isConfirming ? "正在生成..." : "一键生成演示"}
        </Button>
      </div>
    </div>
  );
}
