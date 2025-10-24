import { usePresentationState } from "@/states/presentation-state";

import { useState } from "react";

export function PromptInput() {
  const { analyzedDocument, startOutlineGeneration, isGeneratingOutline } =
    usePresentationState();

  const [customRequirements, setCustomRequirements] = useState("");

  const handleGenerateOutline = () => {
    startOutlineGeneration();
  };

  // 如果有文档分析结果，显示不同的UI
  if (analyzedDocument) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              文档分析结果
            </h3>
            <span className="text-xs text-muted-foreground">
              {analyzedDocument.estimatedSlides} 页 ·{" "}
              {analyzedDocument.presentationStyle}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {analyzedDocument.summary}
          </p>
        </div>

        <div className="relative">
          <textarea
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            className="w-full rounded-md bg-muted px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            placeholder="输入个性化要求（可选）&#10;例如：强调数据可视化、使用商务风格、突出时间线等..."
            disabled={isGeneratingOutline}
            rows={3}
          />
        </div>
      </div>
    );
  }

  // 没有文档分析结果时，保持原有UI
  return (
    <div className="relative">
      <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
        正在准备生成大纲...
      </div>
    </div>
  );
}
