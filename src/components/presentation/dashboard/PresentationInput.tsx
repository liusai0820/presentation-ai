"use client";

import { usePresentationState } from "@/states/presentation-state";
import { Paperclip, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { type AnalyzedContent } from "@/lib/content-analyzer/types";
import { DocumentPreview } from "./DocumentPreview";
import { WebSearchToggle } from "./WebSearchToggle";
import { GenerationModeSelector } from "./GenerationModeSelector";
import { toast } from "sonner";

export function PresentationInput({
  handleGenerate,
}: {
  handleGenerate: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzed, setAnalyzed] = useState<AnalyzedContent | null>(null);
  const [extractedContent, setExtractedContent] = useState<string>("");
  const [pendingGenerate, setPendingGenerate] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const {
    presentationInput,
    setPresentationInput,
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

  const handleFile = async (file: File) => {
    const supportedFormats = [".docx", ".doc", ".txt", ".md", ".pdf"];
    const fileName = file.name.toLowerCase();
    const isSupported = supportedFormats.some((fmt) => fileName.endsWith(fmt));

    if (!isSupported) {
      toast.error(`不支持的文件格式。请上传: ${supportedFormats.join(", ")}`);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("文件大小不能超过10MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/document/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "文件解析失败");
      }

      const data = await response.json();
      const content = data.content;

      if (!content) {
        throw new Error("无法从文件中提取内容");
      }

      toast.success(`成功提取内容 (${content.length} 字符)`);
      setExtractedContent(content);

      // AI分析
      try {
        toast.loading("正在用AI分析文档...");
        
        const analyzeResponse = await fetch("/api/document/analyze-with-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            fileName: file.name,
            numSlides: 8,
            language: "zh",
          }),
        });

        if (analyzeResponse.ok) {
          const analyzeData = await analyzeResponse.json();
          setAnalyzed(analyzeData.analyzed);
          toast.success(
            `AI分析完成！建议${analyzeData.analyzed.estimatedSlides}张幻灯片`
          );
        }
      } catch (error) {
        console.warn("AI分析失败，继续使用原内容", error);
        toast.error("文档已提取，AI分析失败");
      }

      setPresentationInput(content);
    } catch (error) {
      console.error("文件处理错误:", error);
      toast.error(
        error instanceof Error ? error.message : "文件处理失败,请重试"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          您想要展示什么内容？
        </h2>
      </div>

      {/* 统一输入区域 */}
      {analyzed ? (
        <DocumentPreview
          analyzed={analyzed}
          isConfirming={isConfirming}
          onConfirm={() => {
            if (isConfirming) return;
            setIsConfirming(true);
            
            setAnalyzedDocument(analyzed);
            setOriginalDocumentContent(extractedContent);
            setNumSlides(analyzed.estimatedSlides);
            setPresentationInput(extractedContent);
            setPendingGenerate(true);
          }}
        />
      ) : (
        <div className="relative group">
          <textarea
            value={presentationInput}
            onChange={(e) => setPresentationInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" && e.ctrlKey) || (e.key === "Enter" && e.metaKey)) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onPaste={(e) => {
              const files = e.clipboardData?.files;
              if (files && files.length > 0) {
                const file = files[0];
                if (file) handleFile(file);
              }
            }}
            placeholder="描述主题或粘贴内容... 也可以拖拽文档到这里 (PDF/DOCX/TXT)"
            disabled={isUploading}
            className={`h-48 w-full resize-none rounded-xl border-2 ${
              isDragging
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border/50"
            } bg-card px-5 py-4 pb-16 text-base text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 shadow-sm hover:shadow-md`}
          />

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">正在处理文档...</p>
            </div>
          )}

          {/* 底部工具栏 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-muted/30 backdrop-blur-sm rounded-b-xl border-t border-border/50">
            {/* 左侧：上传按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-background/60 hover:bg-background rounded-lg transition-all disabled:opacity-50 border border-border/50 hover:border-border"
                aria-label="上传文档"
              >
                <Paperclip className="h-4 w-4" />
                <span>上传文档</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                disabled={isUploading}
              />
            </div>

            {/* 右侧：快捷键提示和选项 */}
            <div className="flex items-center gap-3">
              <WebSearchToggle />
              <div className="h-4 w-px bg-border" />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <kbd className="px-2 py-0.5 rounded bg-background text-muted-foreground font-mono text-[11px] border border-border/50 shadow-sm">
                  ⌘K
                </kbd>
                <span>快速生成</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 生成模式选择 */}
      <GenerationModeSelector />
    </div>
  );
}
