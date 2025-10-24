"use client";

import { useEffect, useState } from "react";
import { ThemeBackground } from "../theme/ThemeBackground";

export function LoadingState() {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = ["分析内容结构", "生成幻灯片", "应用主题样式", "完善细节"];

  useEffect(() => {
    // 45-60秒完成，每秒增加约1.7-2.2%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 0.03; // 每100ms增加0.03%，约50秒完成
        const newProgress = prev + increment;

        // 更新阶段
        const newPhase = Math.floor(newProgress / 25);
        setCurrentPhase(Math.min(newPhase, phases.length - 1));

        // 到达100%后重置（用于演示）
        return newProgress >= 100 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [phases.length]);

  return (
    <ThemeBackground>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-16">
          {/* 主标题 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light text-foreground tracking-wide">
              正在生成演示文稿
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              {phases[currentPhase]}
            </p>
          </div>

          {/* 简洁的加载动画 */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              {/* 外圈 */}
              <div className="absolute inset-0 rounded-full border border-border/20" />

              {/* 进度圈 */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary/30"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-300 ease-out"
                  strokeLinecap="round"
                />
              </svg>

              {/* 中心点 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* 进度信息 */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-2xl font-light text-foreground">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-muted-foreground">
                预计还需 {Math.max(1, Math.round((100 - progress) * 0.5))} 秒
              </div>
            </div>

            {/* 阶段指示点 */}
            <div className="flex justify-center space-x-3">
              {phases.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index <= currentPhase
                      ? "bg-primary scale-125"
                      : "bg-border scale-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ThemeBackground>
  );
}
