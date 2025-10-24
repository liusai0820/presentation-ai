import ProseMirrorEditor from "@/components/prose-mirror/ProseMirrorEditor";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { usePresentationState } from "@/states/presentation-state";
import { themes } from "@/lib/presentation/themes";

interface OutlineItemProps {
  id: string;
  index: number;
  title: string;
  onTitleChange: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

// Wrap the component with memo to prevent unnecessary re-renders
export const OutlineItem = memo(function OutlineItem({
  id,
  index,
  title,
  onTitleChange,
  onDelete,
}: OutlineItemProps) {
  // Always editable, no need for isEditing state
  const [editedTitle, setEditedTitle] = useState(title);
  const theme = usePresentationState((state) => state.theme);
  
  // 获取当前主题的主色
  const getThemeColor = () => {
    const themeKey = theme as keyof typeof themes;
    if (themes[themeKey]) {
      return themes[themeKey].colors.light.primary;
    }
    return "#4f46e5"; // 默认颜色
  };
  
  const themeColor = getThemeColor();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Update editedTitle when title prop changes
  useEffect(() => {
    setTimeout(() => {
      setEditedTitle(title);
    }, 0);
  }, [title]);

  const handleProseMirrorChange = (newContent: string) => {
    setEditedTitle(newContent);
  };

  const handleProseMirrorBlur = () => {
    if (editedTitle.trim() !== title) {
      onTitleChange(id, editedTitle);
    }
  };

  // 解析内容：标题、要点、布局建议
  const parseContent = (content: string) => {
    // 移除HTML标签
    const text = content.replace(/<[^>]*>/g, '\n');
    const lines = text.split('\n').filter(line => line.trim());
    
    let heading = '';
    const points: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        // 标题
        heading = trimmed.replace(/^#+\s*/, '');
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        // 要点
        points.push(trimmed.replace(/^[-•]\s*/, ''));
      } else if (trimmed.length > 0 && !heading) {
        // 如果没有标题，第一行作为标题
        heading = trimmed;
      }
    }
    
    return { heading, points };
  };

  const { heading, points } = parseContent(editedTitle);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg bg-gradient-to-br from-card to-card/80 border-2 border-border hover:border-indigo-400/50 transition-all overflow-hidden",
        "min-h-[280px]", // 固定最小高度
        isDragging && "opacity-50 scale-95",
      )}
    >
      {/* 页码标签 */}
      <div 
        className="absolute left-0 top-0 text-white px-3 py-1 text-sm font-bold rounded-br-lg transition-colors duration-300"
        style={{ backgroundColor: themeColor }}
      >
        {index}
      </div>

      {/* 拖拽手柄 */}
      <div
        {...attributes}
        {...listeners}
        className="absolute right-10 top-2 cursor-move text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical size={18} />
      </div>

      {/* 删除按钮 */}
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="absolute right-2 top-2 text-muted-foreground/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="删除此项"
      >
        <X size={18} />
      </button>

      {/* 内容区域 */}
      <div className="flex flex-col h-full p-6 pt-10">
        {/* 标题编辑区 */}
        <div className="mb-4">
          <ProseMirrorEditor
            content={editedTitle}
            onChange={handleProseMirrorChange}
            isEditing={true}
            onBlur={handleProseMirrorBlur}
            className="prose-headings:m-0 prose-headings:text-lg prose-headings:font-bold prose-headings:text-foreground prose-p:m-0 prose-p:text-sm prose-p:text-muted-foreground prose-p:mt-2 prose-ul:mt-3 prose-ul:space-y-1 prose-li:text-sm prose-li:text-muted-foreground"
            showFloatingToolbar={false}
          />
        </div>

        {/* 如果有要点，显示预览 */}
        {points.length > 0 && (
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground/70">
              {points.length} 个要点
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
    </div>
  );
});

// Add a display name for debugging purposes
OutlineItem.displayName = "OutlineItem";
