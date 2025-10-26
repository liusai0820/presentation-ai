"use client";

import { usePresentationState } from "@/states/presentation-state";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function HTMLPresentationView() {
  const htmlSlides = usePresentationState((s) => s.htmlSlides);
  const currentSlideIndex = usePresentationState((s) => s.currentSlideIndex);
  const setCurrentSlideIndex = usePresentationState((s) => s.setCurrentSlideIndex);
  const nextSlide = usePresentationState((s) => s.nextSlide);
  const previousSlide = usePresentationState((s) => s.previousSlide);
  const isPresenting = usePresentationState((s) => s.isPresenting);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, previousSlide]);

  if (htmlSlides.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="text-muted-foreground">没有可显示的幻灯片</p>
      </div>
    );
  }

  return (
    <>
      {htmlSlides.map((slide, index) => (
        <div
          key={`${slide.id}-${index}`}
          className={cn(
            "slide-wrapper group/card-container relative z-10 grid w-full place-items-center pb-6",
            isPresenting && "fixed inset-0 pb-0",
            index === currentSlideIndex && isPresenting && "z-[999]",
            index !== currentSlideIndex && "hidden",
          )}
        >
          <div
            className={cn(
              "relative w-full max-w-5xl",
              isPresenting && "h-full w-full max-w-none",
            )}
          >
            {/* 幻灯片内容 */}
            <div
              className={cn(
                "slide-container min-h-[300px] rounded-md border",
                isPresenting && "h-screen w-screen border-0 rounded-none",
              )}
            >
              <iframe
                srcDoc={slide.html}
                className="h-full w-full"
                title={slide.title}
                sandbox="allow-same-origin"
                style={
                  !isPresenting
                    ? { minHeight: "600px", aspectRatio: "16/9" }
                    : undefined
                }
              />
            </div>
          </div>

          {/* 演示模式下的进度条 */}
          {isPresenting && (
            <div className="absolute bottom-0.5 left-1 right-1 z-[1001]">
              <div className="flex h-1.5 w-full gap-1">
                {htmlSlides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-full flex-1 rounded-full transition-all ${
                      idx === currentSlideIndex
                        ? "bg-primary shadow-sm"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`跳转到第 ${idx + 1} 页`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
