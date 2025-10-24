"use client";

import { Spinner } from "@/components/ui/spinner";
import { ThemeBackground } from "../theme/ThemeBackground";
import { useEffect, useState } from "react";
import { CheckCircle2, Zap, MessageCircle } from "lucide-react";

const LOADING_TIPS = [
  "💡 提示：你可以在生成期间浏览演示文稿",
  "🎨 McKinsey、BCG 和 Bain 主题都是顶级设计师精心打磨的",
  "⚡ 高质量的演示文稿需要时间，但我们会尽快为你完成",
  "📊 AI正在为你的内容进行智能排版和优化",
  "🚀 这个过程通常需要30-60秒，请耐心等待",
];

export function LoadingState() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % 3);
    }, 1500);

    return () => clearInterval(phaseInterval);
  }, []);

  const phases = [
    { icon: "✨", label: "正在生成内容" },
    { icon: "🎨", label: "应用专业主题" },
    { icon: "📐", label: "优化布局样式" },
  ];

  return (
    <ThemeBackground>
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center px-4">
        {/* 动画加载指示器 */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative h-20 w-20 mb-8">
            {/* 外圈旋转环 */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary opacity-30 animate-spin" />
            {/* 中圈慢速旋转 */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary opacity-20 animate-spin" style={{ animationDirection: "reverse", animationDuration: "3s" }} />
            {/* 中心 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* 当前阶段指示 */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              {phases[loadingPhase].icon} {phases[loadingPhase].label}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">AI 正在为你精心准备演示文稿</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full max-w-md mb-12">
          <div className="flex gap-2 mb-3">
            {phases.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx <= loadingPhase
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">处理进度</p>
        </div>

        {/* 贴士卡片 */}
        <div className="w-full max-w-md rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4 mb-8">
          <div className="flex gap-3">
            <MessageCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">小贴士</p>
              <p className="text-sm text-muted-foreground transition-opacity duration-500">
                {LOADING_TIPS[currentTipIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* 检查清单 */}
        <div className="w-full max-w-md space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">准备中的项目</p>
          <div className="space-y-2">
            {[
              "分析你的内容结构",
              "应用专业排版规则",
              "生成高质量幻灯片",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className={`w-4 h-4 rounded-full border transition-all duration-500 flex items-center justify-center ${
                    idx <= loadingPhase
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {idx <= loadingPhase && (
                    <CheckCircle2 className="w-3 h-3 text-background" />
                  )}
                </div>
                <span className={idx <= loadingPhase ? "text-foreground font-medium" : ""}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeBackground>
  );
}
