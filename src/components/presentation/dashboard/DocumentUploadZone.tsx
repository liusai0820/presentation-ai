"use client";

import { Upload, Loader2, FileText, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type AnalyzedContent } from "@/lib/content-analyzer/types";

interface DocumentUploadZoneProps {
  onContentExtracted: (content: string) => void;
  onAnalyzed?: (analyzed: AnalyzedContent) => void;
}

export function DocumentUploadZone({
  onContentExtracted,
  onAnalyzed,
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // 当前最优支持: Word、纯文本、Markdown
  // PDF可上传但需要事先转换为Word/Text格式
  const supportedFormats = [".docx", ".doc", ".txt", ".md", ".pdf"];

  const handleFile = useCallback(
    async (file: File) => {
      // 验证文件格式
      const fileName = file.name.toLowerCase();
      const isSupported = supportedFormats.some((fmt) =>
        fileName.endsWith(fmt)
      );

      if (!isSupported) {
        toast.error(
          `不支持的文件格式。请上传: ${supportedFormats.join(", ")}`
        );
        return;
      }

      // 验证文件大小 (限制为10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("文件大小不能超过10MB");
        return;
      }

      setUploadedFile(file);
      setIsLoading(true);

      try {
        // 创建FormData
        const formData = new FormData();
        formData.append("file", file);

        // 上传并解析文件
        const response = await fetch("/api/document/extract", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "文件解析失败");
        }

        const data = await response.json();
        const extractedContent = data.content;

        if (!extractedContent) {
          throw new Error("无法从文件中提取内容");
        }

        toast.success(`成功提取内容 (${extractedContent.length} 字符)`);

        // 第二步：用AI分析文档并生成大纲
        if (onAnalyzed) {
          try {
            toast.loading("正在用AI分析文档...");
            
            const analyzeResponse = await fetch("/api/document/analyze-with-ai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: extractedContent,
                fileName: file.name,
                numSlides: 8,
                language: "zh",
              }),
            });

            if (analyzeResponse.ok) {
              const analyzeData = await analyzeResponse.json();
              onAnalyzed(analyzeData.analyzed);
              toast.success(
                `AI分析完成！建议${analyzeData.analyzed.estimatedSlides}张幻灯片 (${analyzeData.analyzed.presentationStyle})`
              );
            } else {
              const error = await analyzeResponse.json();
              throw new Error(error.message);
            }
          } catch (error) {
            console.warn("AI分析失败，继续使用原内容", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "AI分析失败，请检查API配置是否正常"
            );
          }
        }

        // 调用回调函数，传递提取的内容
        onContentExtracted(extractedContent);
      } catch (error) {
        console.error("文件处理错误:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "文件处理失败,请重试"
        );
        setUploadedFile(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onContentExtracted]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0 && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* 拖拽上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${ isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground"
        } cursor-pointer`}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleFileSelect}
          accept={supportedFormats.join(",")}
          className="hidden"
          disabled={isLoading}
        />

        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center gap-3 px-6 py-12 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  正在解析文件...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFile?.name}
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  拖拽文件到这里或点击选择
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  最好效果: Word, 纯文本, Markdown | 也支持PDF
                </p>
              </div>
            </>
          )}
        </label>
      </div>

      {/* 已上传文件显示 */}
      {uploadedFile && !isLoading && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-foreground">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 支持的格式说明 */}
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">支持的格式:</span>
        </p>
        <ul className="mt-2 space-y-1">
          <li className="text-xs text-muted-foreground">
            🌟 <span className="font-mono font-bold">.docx, .doc</span> - Word文档 (推荐)
          </li>
          <li className="text-xs text-muted-foreground">
            🌟 <span className="font-mono font-bold">.txt</span> - 纯文本 (推荐)
          </li>
          <li className="text-xs text-muted-foreground">
            🌟 <span className="font-mono font-bold">.md</span> - Markdown (推荐)
          </li>
          <li className="text-xs text-muted-foreground">
            • <span className="font-mono">.pdf</span> - PDF (需转换为Word归效果更优)
          </li>
          <li className="text-xs text-muted-foreground">
            • 文件大小限制: 10MB
          </li>
        </ul>
      </div>

      {/* 提示 */}
      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          💡 <span className="font-medium">提示:</span> 上传文件后,系统会自动提取内容,然后您可以编辑或直接生成演示文稿。
        </p>
      </div>
    </div>
  );
}
