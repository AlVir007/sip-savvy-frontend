// Update src/components/PersonasDraggableGrid.tsx
import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCardOrder } from '@/hooks/useCardOrder';
import { DraggableCard } from '@/components/DraggableCard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { Persona } from '@/types';

interface PersonasDraggableGridProps {
  personas: Persona[];
  onEditPersona: (persona: Persona) => void;
  onDeletePersona: (persona: Persona) => void;
  onReorder?: (newOrder: Persona[]) => void;
}

export const PersonasDraggableGrid: React.FC<PersonasDraggableGridProps> = ({
  personas: initialPersonas,
  onEditPersona,
  onDeletePersona,
  onReorder,
}) => {
  // Replace the entire state management section with:
  const { orderedItems: personas, handleReorder, isLoading } = useCardOrder({
    items: initialPersonas,
    preferenceType: 'personas_order'
  });
  
  const { handleDragStart, handleDragEnd, activeId, activeItem } = useDragAndDrop(
    personas,
    (newOrder) => {
      handleReorder(newOrder); // This saves to backend automatically
      if (onReorder) {
        onReorder(newOrder); // Keep existing callback for parent component
      }
    }
  );

  const PersonaCard = ({ 
    persona, 
    isDragging = false, 
    dragListeners, 
    dragAttributes 
  }: { 
    persona: Persona; 
    isDragging?: boolean;
    dragListeners?: any;
    dragAttributes?: any;
  }) => (
    <Card className={`transition-all duration-200 ${isDragging ? 'shadow-2xl scale-105 rotate-3' : 'hover:shadow-md'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {/* Your existing avatar code... */}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{persona.name}</CardTitle>
              <p className="text-sm text-gray-500">{persona.tone}</p>
            </div>
            {/* Drag Handle - NOW WITH LISTENERS */}
            <div 
              className="drag-handle cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
              {...dragListeners}
              {...dragAttributes}
            >
              <div className="flex flex-col space-y-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Rest of your existing PersonaCard code... */}
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPersona(persona);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePersona(persona);
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{persona.bio}</p>
        <div className="flex flex-wrap gap-1">
          {persona.expertise_tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {persona.expertise_tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{persona.expertise_tags.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={personas.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <DraggableCard key={persona.id} id={persona.id}>
              <PersonaCard persona={persona} />
            </DraggableCard>
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeItem ? (
          <div className="transform rotate-3 shadow-2xl">
            <PersonaCard persona={activeItem} isDragging={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};