"use client";

import { usePresentationState } from "@/states/presentation-state";
import { FileText, Code, Presentation } from "lucide-react";

export function GenerationModeSelector() {
  const { generationMode, setGenerationMode } = usePresentationState();

  const modes = [
    {
      value: "revealjs" as const,
      label: "Reveal.js",
      icon: FileText,
      description: "专业网页演示",
    },
    {
      value: "html" as const,
      label: "HTML",
      icon: Code,
      description: "自定义网页演示",
    },
    {
      value: "xml" as const,
      label: "PowerPoint",
      icon: Presentation,
      description: "传统PPT文件",
    },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-primary" />
        生成模式
      </label>
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = generationMode === mode.value;
          
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => setGenerationMode(mode.value)}
              className={`
                relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all group
                ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:bg-card hover:shadow-sm"
                }
              `}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isSelected ? "bg-primary/10" : "bg-muted/50 group-hover:bg-muted"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-0.5">{mode.label}</div>
                <div className="text-xs opacity-70 leading-snug">{mode.description}</div>
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {generationMode === "revealjs" && (
        <div className="text-xs text-primary/80 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <strong className="text-primary font-semibold">Reveal.js 模式</strong>
              <p className="mt-0.5 text-muted-foreground">麦肯锡级别专业演示，支持键盘导航、全屏演示、数据可视化</p>
            </div>
          </div>
        </div>
      )}
      {generationMode === "html" && (
        <div className="text-xs text-primary/80 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10">
              <Code className="h-4 w-4 text-primary" />
            </div>
            <div>
              <strong className="text-primary font-semibold">HTML 模式</strong>
              <p className="mt-0.5 text-muted-foreground">灵活的网页演示，支持自定义样式、嵌入网页、响应式布局</p>
            </div>
          </div>
        </div>
      )}
      {generationMode === "xml" && (
        <div className="text-xs text-primary/80 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10">
              <Presentation className="h-4 w-4 text-primary" />
            </div>
            <div>
              <strong className="text-primary font-semibold">PowerPoint 模式</strong>
              <p className="mt-0.5 text-muted-foreground">传统PPTX文件，兼容Office和WPS，方便离线编辑和分享</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
