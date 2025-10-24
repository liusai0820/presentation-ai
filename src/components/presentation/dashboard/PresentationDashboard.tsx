"use client";

import { createEmptyPresentation } from "@/app/_actions/presentation/presentationActions";
import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { PresentationExamples } from "./PresentationExamples";
import { PresentationHeader } from "./PresentationHeader";
import { PresentationInput } from "./PresentationInput";
import { PresentationsSidebar } from "./PresentationsSidebar";
import { RecentPresentations } from "./RecentPresentations";

export function PresentationDashboard({
  sidebarSide,
}: {
  sidebarSide?: "left" | "right";
}) {
  const router = useRouter();
  const {
    presentationInput,
    isGeneratingOutline,
    language,
    theme,
    resetToInitialState,
  } = usePresentationState();

  useEffect(() => {
    // 完全重置到初始状态，清除所有缓存内容
    resetToInitialState();
  }, [resetToInitialState]);

  const handleGenerate = async () => {
    if (!presentationInput.trim()) {
      toast.error("请输入您的演示文稿主题");
      return;
    }

    const { setIsGeneratingOutline, setCurrentPresentation } = usePresentationState.getState();

    // Set UI loading state
    setIsGeneratingOutline(true);

    try {
      const result = await createEmptyPresentation(
        presentationInput.substring(0, 50) || "未命名演示文稿",
        theme,
        language,
      );

      if (result.success && result.presentation) {
        // Set the current presentation
        setCurrentPresentation(
          result.presentation.id,
          result.presentation.title,
        );
        router.push(`/presentation/generate/${result.presentation.id}`);
      } else {
        setIsGeneratingOutline(false);
        toast.error(result.message || "创建演示文稿失败");
      }
    } catch (error) {
      setIsGeneratingOutline(false);
      console.error("Error creating presentation:", error);
      toast.error("创建演示文稿失败");
    }
  };

  return (
    <div className="notebook-section relative h-full w-full">
      <PresentationsSidebar side={sidebarSide} />
      <div className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <PresentationHeader />

        <div className="space-y-6">
          <PresentationInput handleGenerate={handleGenerate} />

          <div className="flex items-center justify-center pt-2">
            <Button
              onClick={handleGenerate}
              disabled={!presentationInput.trim() || isGeneratingOutline}
              size="lg"
              className="gap-2.5 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {isGeneratingOutline ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  正在生成...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  生成演示文稿
                </>
              )}
            </Button>
          </div>
        </div>

        <PresentationExamples />
        <RecentPresentations />
      </div>
    </div>
  );
}
