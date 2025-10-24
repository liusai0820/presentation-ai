"use client";

import { usePresentationState } from "@/states/presentation-state";
import { FileText, Code, Presentation } from "lucide-react";

export function GenerationModeSelector() {
  const { generationMode, setGenerationMode } = usePresentationState();

  const modes = [
    {
      value: "xml" as const,
      label: "PowerPoint",
      icon: Presentation,
      description: "传统PPT文件",
    },
    {
      value: "html" as const,
      label: "HTML",
      icon: Code,
      description: "自定义样式",
    },
    {
      value: "revealjs" as const,
      label: "Reveal.js",
      icon: FileText,
      description: "专业演示",
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        生成模式
      </label>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = generationMode === mode.value;
          
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => setGenerationMode(mode.value)}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                ${isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium">{mode.label}</div>
                <div className="text-xs opacity-70">{mode.description}</div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      
      {generationMode === "revealjs" && (
        <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
          ✨ <strong>Reveal.js模式：</strong>麦肯锡级别专业演示，支持键盘导航、全屏演示、数据可视化
        </div>
      )}
    </div>
  );
}
