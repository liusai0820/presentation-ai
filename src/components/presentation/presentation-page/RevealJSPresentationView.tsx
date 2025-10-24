"use client";

import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { Download, ExternalLink } from "lucide-react";

export function RevealJSPresentationView() {
  const generatedHtml = usePresentationState((s) => s.generatedHtml);
  const currentPresentationTitle = usePresentationState(
    (s) => s.currentPresentationTitle,
  );

  if (!generatedHtml) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="text-muted-foreground">没有可显示的演示文稿</p>
      </div>
    );
  }

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPresentationTitle || "presentation"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4 w-full">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {currentPresentationTitle || "演示文稿"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Reveal.js 演示文稿已生成
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            在新窗口打开
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            下载 HTML
          </Button>
        </div>
      </div>

      {/* 预览区域 - 16:9比例 */}
      <div className="w-full">
        <div
          className="relative w-full overflow-hidden rounded-lg border bg-card shadow-sm mx-auto"
          style={{
            aspectRatio: "16/9",
            maxWidth: "100%",
            height: "calc(100vh - 200px)",
            minHeight: "600px",
          }}
        >
          <iframe
            srcDoc={generatedHtml}
            className="absolute inset-0 w-full h-full border-0"
            title="Presentation Preview"
            sandbox="allow-scripts allow-same-origin allow-fullscreen"
            allowFullScreen
            style={{
              border: "none",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* 提示信息 */}
      <div className="text-sm text-muted-foreground text-center">
        <p>使用方向键 (← →) 翻页 | 按 F 键全屏 | 按 ESC 退出全屏</p>
      </div>
    </div>
  );
}
