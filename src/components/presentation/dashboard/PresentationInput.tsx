"use client";

import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { Sparkles, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { type AnalyzedContent } from "@/lib/content-analyzer/types";
import { DocumentUploadZone } from "./DocumentUploadZone";
import { DocumentPreview } from "./DocumentPreview";
import { WebSearchToggle } from "./WebSearchToggle";
import { GenerationModeSelector } from "./GenerationModeSelector";

export function PresentationInput({
  handleGenerate,
}: {
  handleGenerate: () => void;
}) {
  const [inputMode, setInputMode] = useState<"text" | "document">("text");
  const [analyzed, setAnalyzed] = useState<AnalyzedContent | null>(null);
  const [extractedContent, setExtractedContent] = useState<string>("");
  const [pendingGenerate, setPendingGenerate] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const {
    presentationInput,
    setPresentationInput,
    setShowTemplates,
    setAnalyzedDocument,
    setOriginalDocumentContent,
    setNumSlides,
  } = usePresentationState();

  // 当pendingGenerate为true时，触发生成
  useEffect(() => {
    if (pendingGenerate && extractedContent) {
      setPendingGenerate(false);
      setIsConfirming(false);
      handleGenerate();
    }
  }, [pendingGenerate, extractedContent, handleGenerate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          您想要展示什么内容？
        </h2>
        <div className="flex items-center gap-2">
          {/* Tab 切换 */}
          <div className="inline-flex rounded-lg border border-border bg-muted p-1">
            <button
              onClick={() => setInputMode("text")}
              className={`px-3 py-1.5 text-sm font-medium transition-all ${
                inputMode === "text"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              文本输入
            </button>
            <button
              onClick={() => setInputMode("document")}
              className={`px-3 py-1.5 text-sm font-medium transition-all ${
                inputMode === "document"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="mr-1 inline-block h-4 w-4" />
              上传文档
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
            className="gap-2 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            模板
          </Button>
        </div>
      </div>

      {/* 文本输入 Tab */}
      {inputMode === "text" && (
        <div className="relative group">
          <textarea
            value={presentationInput}
            onChange={(e) => setPresentationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="请描述您的主题或粘贴您的内容。我们的AI将其构建成一个引人注目的演示文稿。"
            className="h-40 w-full resize-none rounded-lg border border-border bg-card px-4 py-3.5 pb-14 text-base text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />

          <div className="absolute flex justify-between items-center bottom-3 inset-x-3 z-10">
            <p className="text-xs text-muted-foreground">
              按{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px] border border-border">
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px] border border-border">
                Enter
              </kbd>{" "}
              生成
            </p>
            <div className="flex items-center gap-2">
              <WebSearchToggle />
            </div>
          </div>
        </div>
      )}
      
      {/* 生成模式选择 */}
      <GenerationModeSelector />

      {/* 文档上传 Tab */}
      {inputMode === "document" && (
        <div className="space-y-4">
          {analyzed ? (
            <DocumentPreview
              analyzed={analyzed}
              isConfirming={isConfirming}
              onConfirm={() => {
                if (isConfirming) return; // 防止重复点击
                setIsConfirming(true);
                
                // 保存分析结果
                setAnalyzedDocument(analyzed);
                // 保存原始文档内容
                setOriginalDocumentContent(extractedContent);
                // 根据分析结果设置幻灯片数量
                setNumSlides(analyzed.estimatedSlides);
                // 确保文本内容已设置
                setPresentationInput(extractedContent);
                // 触发生成
                setPendingGenerate(true);
              }}
            />
          ) : (
            <DocumentUploadZone
              onContentExtracted={(content) => {
                setPresentationInput(content);
                setExtractedContent(content);
              }}
              onAnalyzed={(analyzedData) => {
                setAnalyzed(analyzedData);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
