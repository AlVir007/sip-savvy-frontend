import { useState } from 'react';
import { DragEndEvent, DragStartEvent, arrayMove } from '@dnd-kit/sortable';

export function useDragAndDrop<T extends { id: string }>(
  items: T[],
  onReorder?: (newOrder: T[]) => void
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const activeItem = items.find(item => item.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('Drag ended:', { active: active.id, over: over?.id });
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      console.log('Moving from index', oldIndex, 'to', newIndex);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      if (onReorder) {
        console.log('Calling onReorder with new items:', newItems.map(i => i.id));
        onReorder(newItems);
      }
    }
    
    setActiveId(null);
  };

  return {
    handleDragStart,
    handleDragEnd,
    activeId,
    activeItem
  };
}