import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresentationState } from "@/states/presentation-state";
import { Layout } from "lucide-react";
import { ModelPicker } from "./ModelPicker";

export function PresentationControls({
  shouldShowLabel = true,
}: {
  shouldShowLabel?: boolean;
}) {
  const {
    numSlides,
    setNumSlides,
    language,
    setLanguage,
    pageStyle,
    setPageStyle,
  } = usePresentationState();

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Model Selection */}
      <ModelPicker shouldShowLabel={shouldShowLabel} />

      {/* Number of Slides */}
      <div>
        {shouldShowLabel && (
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            幻灯片数量
          </label>
        )}
        <Select
          value={String(numSlides)}
          onValueChange={(v) => setNumSlides(Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择幻灯片数量" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num} 张
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div>
        {shouldShowLabel && (
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            语言
          </label>
        )}
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="选择语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en-US">英语 (US)</SelectItem>
            <SelectItem value="pt">葡萄牙语</SelectItem>
            <SelectItem value="es">西班牙语</SelectItem>
            <SelectItem value="fr">法语</SelectItem>
            <SelectItem value="de">德语</SelectItem>
            <SelectItem value="it">意大利语</SelectItem>
            <SelectItem value="ja">日语</SelectItem>
            <SelectItem value="ko">韩语</SelectItem>
            <SelectItem value="ru">俄语</SelectItem>
            <SelectItem value="hi">印地语</SelectItem>
            <SelectItem value="ar">阿拉伯语</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Page Style */}
      <div>
        {shouldShowLabel && (
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            页面样式
          </label>
        )}
        <Select value={pageStyle} onValueChange={setPageStyle}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <SelectValue placeholder="选择页面样式" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">
              <div className="flex items-center gap-3">
                <span>默认</span>
              </div>
            </SelectItem>
            <SelectItem value="traditional">
              <div className="flex items-center gap-3">
                <span>传统</span>
              </div>
            </SelectItem>
            <SelectItem value="tall">
              <div className="flex items-center gap-3">
                <span>竖向</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
