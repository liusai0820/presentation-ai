"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Maximize2 } from "lucide-react";
import { useState } from "react";

interface HTMLSlide {
  id: string;
  index: number;
  html: string;
  title: string;
}

interface HTMLSlideViewerProps {
  slides: HTMLSlide[];
  onExportPDF?: () => void;
}

export function HTMLSlideViewer({ slides, onExportPDF }: HTMLSlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = slides[currentIndex];

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      goToNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === "Escape" && isFullscreen) {
      toggleFullscreen();
    }
  };

  if (!currentSlide) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">没有可显示的幻灯片</p>
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentIndex === slides.length - 1}
          >
            下一页
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="ml-4 text-sm text-muted-foreground">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
            全屏
          </Button>
          {onExportPDF && (
            <Button variant="default" size="sm" onClick={onExportPDF}>
              <Download className="h-4 w-4" />
              导出PDF
            </Button>
          )}
        </div>
      </div>

      {/* 幻灯片预览区域 */}
      <div className="flex-1 overflow-hidden bg-gray-100 p-8">
        <div className="mx-auto h-full max-w-6xl">
          <iframe
            srcDoc={currentSlide.html}
            className="h-full w-full rounded-lg border-2 border-gray-300 bg-white shadow-2xl"
            title={currentSlide.title}
            sandbox="allow-same-origin"
          />
        </div>
      </div>

      {/* 缩略图导航 */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-2 overflow-x-auto">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 rounded border-2 p-2 transition-all ${
                index === currentIndex
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="h-16 w-28 overflow-hidden rounded bg-white">
                <iframe
                  srcDoc={slide.html}
                  className="pointer-events-none h-full w-full scale-[0.2] origin-top-left"
                  title={`缩略图 ${index + 1}`}
                  sandbox="allow-same-origin"
                  style={{ width: "500%", height: "500%" }}
                />
              </div>
              <p className="mt-1 text-xs text-center">{index + 1}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
