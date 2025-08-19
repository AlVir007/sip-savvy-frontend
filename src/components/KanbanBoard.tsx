"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { CalendarIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onGenerateDraft: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  showBacklog?: boolean;
}

export function KanbanBoard({ tasks, onTaskClick, onGenerateDraft, onUpdateTaskStatus, showBacklog = false }: KanbanBoardProps) {
  console.log('KanbanBoard showBacklog:', showBacklog);
  
  const columns = showBacklog ? [
    { id: 'backlog' as const, title: 'Backlog', color: 'bg-gray-50' },
  ] : [
    { id: 'in-progress' as const, title: 'In Progress', color: 'bg-blue-50' },
    { id: 'needs-review' as const, title: 'Needs Review', color: 'bg-yellow-50' },
    { id: 'approved' as const, title: 'Approved', color: 'bg-green-50' },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-[600px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {column.title}
              </h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                {columnTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                  onClick={() => onTaskClick(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    {task.topic && (
                      <p className="text-xs text-blue-600 mb-2 font-medium">{task.topic}</p>
                    )}
                    
                    {task.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        {task.persona && (
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-3 h-3" />
                            <span>{task.persona.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {task.due_date && (
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      )}
                    </div>
                    
                    {task.assigned_persona_id && task.status === 'backlog' && (
                      <div className="mt-3 pt-3 border-t">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenerateDraft(task);
                          }}
                          className="w-full text-xs"
                        >
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Generate Draft
                        </Button>
                      </div>
                    )}
                    
                    {task.status !== 'approved' && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex space-x-1">
                          {column.id !== 'approved' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus = 
                                  task.status === 'backlog' ? 'in-progress' :
                                  task.status === 'in-progress' ? 'needs-review' :
                                  'approved';
                                onUpdateTaskStatus(task.id, nextStatus);
                              }}
                              className="text-xs flex-1"
                            >
                              →
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}