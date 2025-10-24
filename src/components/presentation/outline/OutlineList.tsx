import { Skeleton } from "@/components/ui/skeleton";
import { usePresentationState } from "@/states/presentation-state";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OutlineItem } from "./OutlineItem";

interface OutlineItemType {
  id: string;
  title: string;
}

export function OutlineList() {
  const {
    outline: initialItems,
    setOutline,
    numSlides,
    isGeneratingOutline,
    webSearchEnabled,
  } = usePresentationState();

  const [items, setItems] = useState<OutlineItemType[]>(
    initialItems.map((title, index) => ({
      id: (index + 1).toString(),
      title,
    })),
  );

  useEffect(() => {
    setItems(
      initialItems.map((title, index) => ({
        id: (index + 1).toString(),
        title,
      })),
    );
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update the outline in the store
        setOutline(newItems.map((item) => item.title));
        return newItems;
      });
    }
  }

  const handleTitleChange = (id: string, newTitle: string) => {
    setItems((items) => {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item,
      );
      // Update the outline in the store
      setOutline(newItems.map((item) => item.title));
      return newItems;
    });
  };

  const handleAddCard = () => {
    const newId =
      items.length > 0
        ? (
            Math.max(...items.map((item) => parseInt(item.id, 10))) + 1
          ).toString()
        : "1";
    const newItems = [...items, { id: newId, title: "New Card" }];
    setItems(newItems);
    // Update the outline in the store
    setOutline(newItems.map((item) => item.title));
  };

  const handleDeleteCard = (id: string) => {
    setItems((items) => {
      const newItems = items.filter((item) => item.id !== id);
      // Update the outline in the store
      setOutline(newItems.map((item) => item.title));
      return newItems;
    });
  };

  // Calculate skeleton counts
  const totalSlides = numSlides;
  const loadedCount = items.length;
  const remainingCount = Math.max(0, totalSlides - loadedCount);

  // Show skeleton placeholders when web search is enabled and outline is empty (before generation starts)
  const showSkeletonPlaceholders =
    webSearchEnabled && items.length === 0 && !isGeneratingOutline;
  // Show loading skeletons only when actually generating outline
  const showLoadingSkeletons = isGeneratingOutline && remainingCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">演示大纲</h2>
        {isGeneratingOutline && (
          <span className="animate-pulse text-xs text-muted-foreground">
            正在生成大纲...
          </span>
        )}
        {webSearchEnabled && items.length === 0 && !isGeneratingOutline && (
          <span className="text-xs text-muted-foreground">
            准备好生成
          </span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {/* 2列网格布局 - 更大的卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item, index) => (
              <OutlineItem
                key={item.id}
                id={item.id}
                index={index + 1}
                title={item.title}
                onTitleChange={handleTitleChange}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        </SortableContext>
        {/* Show skeleton placeholders when web search enabled but no outline yet */}
        {showSkeletonPlaceholders && <Skeleton className="h-96 w-full" />}

        {/* Show loading skeletons only when actually generating */}
        {showLoadingSkeletons && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: remainingCount }).map((_, index) => (
              <Skeleton key={`loading-${index}`} className="h-[280px] w-full" />
            ))}
          </div>
        )}
      </DndContext>

      <button
        type="button"
        onClick={handleAddCard}
        disabled={isGeneratingOutline}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-muted/50 py-3 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        <Plus size={20} />
        添加卡片
      </button>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>总计 {items.length} 张幻灯片</span>
        <span>
          {items.reduce((acc, item) => acc + item.title.length, 0)}/20000 字符
        </span>
      </div>
    </div>
  );
}
