import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    // Only activate on drag handle, not the whole card
    activationConstraint: {
      distance: 8,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Clone children and add drag listeners to drag handles
  const childrenWithDragHandles = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        dragListeners: listeners,
        dragAttributes: attributes,
      });
    }
    return child;
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105 z-50 shadow-2xl' : 'hover:shadow-lg'
      }`}
    >
      {childrenWithDragHandles}
    </div>
  );
};