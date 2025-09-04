// Create/update src/components/AgentsDraggableGrid.tsx
import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCardOrder } from '@/hooks/useCardOrder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DraggableCard } from '@/components/DraggableCard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { 
  PlayIcon, 
  PauseIcon, 
  CogIcon, 
  ChartBarIcon,
  BoltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Agent {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status: string;
  configuration?: Record<string, any>;
}

interface AgentsDraggableGridProps {
  agents: Agent[];
  executing: Record<string, boolean>;
  onExecuteAgent: (agentId: string) => void;
  onUpdateAgentStatus: (agentId: string, newStatus: string) => void;
  getLastExecutionTime: (agentId: string) => string;
  getSuccessRate: (agentId: string) => number;
  agentExecutions: Record<string, any[]>;
  onReorder?: (newOrder: Agent[]) => void;
}

export const AgentsDraggableGrid: React.FC<AgentsDraggableGridProps> = ({
  agents: initialAgents,
  executing,
  onExecuteAgent,
  onUpdateAgentStatus,
  getLastExecutionTime,
  getSuccessRate,
  agentExecutions,
  onReorder,
}) => {
    const { orderedItems: agents, handleReorder, isLoading } = useCardOrder({
        items: initialAgents,
        preferenceType: 'agents_order'
    });
      
    const { handleDragStart, handleDragEnd, activeId, activeItem } = useDragAndDrop(
        agents,
        (newOrder) => {
          handleReorder(newOrder); // This saves to backend
          if (onReorder) {
            onReorder(newOrder); // Keep existing callback
          }
        }
      );

  const getAgentTypeIcon = (type?: string) => {
    switch (type) {
      case 'story_discovery':
        return <BoltIcon className="h-5 w-5 text-blue-600" />;
      case 'content_generation':
        return <ChartBarIcon className="h-5 w-5 text-green-600" />;
      case 'social_media':
        return <CogIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <CogIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AgentCard = ({ 
    agent, 
    isDragging = false, 
    dragListeners, 
    dragAttributes 
  }: { 
    agent: Agent; 
    isDragging?: boolean;
    dragListeners?: any;
    dragAttributes?: any;
  }) => (
    <Card className={`transition-all duration-200 ${isDragging ? 'shadow-2xl scale-105 rotate-3' : 'hover:shadow-md'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {getAgentTypeIcon(agent.type)}
            <div className="flex-1">
              <CardTitle className="text-lg">{agent.name || `Agent ${agent.id}`}</CardTitle>
              <p className="text-sm text-gray-600">{agent.description || 'AI Agent'}</p>
            </div>
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
          {/* Rest of your existing AgentCard code... */}
          <Badge className={getStatusColor(agent.status)}>
            {agent.status || 'unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Type</div>
              <div className="font-medium capitalize">
                {agent.type?.replace('_', ' ') || 'General'}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Success Rate</div>
              <div className="font-medium">{getSuccessRate(agent.id)}%</div>
            </div>
            <div>
              <div className="text-gray-500">Last Execution</div>
              <div className="font-medium text-xs">
                {getLastExecutionTime(agent.id)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Total Runs</div>
              <div className="font-medium">
                {agentExecutions[agent.id]?.length || 0}
              </div>
            </div>
          </div>

          {agent.configuration && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Configuration</div>
              <div className="text-sm">
                {Object.entries(agent.configuration).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                    <span className="font-medium">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onExecuteAgent(agent.id);
              }}
              disabled={executing[agent.id] || agent.status === 'error'}
              className="flex-1"
            >
              {executing[agent.id] ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Executing...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-1" />
                  Execute
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateAgentStatus(
                  agent.id, 
                  agent.status === 'active' ? 'paused' : 'active'
                );
              }}
            >
              {agent.status === 'active' ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
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
      <SortableContext items={agents.map(a => a.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <DraggableCard key={agent.id} id={agent.id}>
              <AgentCard agent={agent} />
            </DraggableCard>
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeItem ? (
          <div className="transform rotate-3 shadow-2xl">
            <AgentCard agent={activeItem} isDragging={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};