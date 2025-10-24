"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themes, type Themes } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { Palette } from "lucide-react";

// 只显示咨询公司主题
const PRESENTATION_THEMES = ["mckinsey", "bcg", "bain"] as const;
type PresentationTheme = (typeof PRESENTATION_THEMES)[number];
const DEFAULT_THEME: PresentationTheme = "mckinsey";

export function ThemeSelector() {
  const { theme = DEFAULT_THEME, setTheme, setIsThemeCreatorOpen } =
    usePresentationState();

  // 过滤出只有咨询公司主题
  const presentationThemes = Object.entries(themes).filter(([key]) =>
    PRESENTATION_THEMES.includes(key as PresentationTheme)
  );

  // 获取当前选中主题的数据
  const currentTheme = themes[theme as Themes] || themes[DEFAULT_THEME as Themes];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Palette className="h-4 w-4" />
          演示文稿主题
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsThemeCreatorOpen(true)}
        >
          自定义主题
        </Button>
      </div>

      <Select
        value={theme || DEFAULT_THEME}
        onValueChange={(value) => setTheme(value as Themes)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择演示文稿主题" />
        </SelectTrigger>
        <SelectContent>
          {presentationThemes.map(([key, themeData]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{
                    background: `linear-gradient(135deg, ${themeData.colors.light.primary} 0%, ${themeData.colors.light.secondary} 100%)`,
                  }}
                />
                <span>{themeData.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 主题预览 */}
      <div className="rounded-lg border border-border p-4 bg-card">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-lg border"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.light.primary} 0%, ${currentTheme.colors.light.secondary} 100%)`,
            }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium">{currentTheme.name}</div>
            <div className="text-xs text-muted-foreground">
              {currentTheme.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
