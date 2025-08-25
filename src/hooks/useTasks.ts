import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Task } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      // Get the current task to merge with updates
      const currentTask = tasks.find(t => t.id === id);
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      // Merge current task data with updates to ensure ALL required fields are present
      const updateData = {
        // Required fields that must always be present
        id: currentTask.id,
        organization_id: currentTask.organization_id,
        assigned_by: currentTask.assigned_by,
        title: currentTask.title,
        sources: currentTask.sources,
        type: currentTask.type,
        status: currentTask.status,
        priority: currentTask.priority,
        created_at: currentTask.created_at,
        updated_at: currentTask.updated_at,
        
        // Optional fields that might be updated
        assigned_persona_id: currentTask.assigned_persona_id,
        topic: currentTask.topic,
        description: currentTask.description,
        section: currentTask.section,
        due_date: currentTask.due_date,
        ai_provider: currentTask.ai_provider,
        
        // Publishing fields
        publishWebsite: currentTask.publishWebsite,
        publishSocial: currentTask.publishSocial,
        socialPlatforms: currentTask.socialPlatforms,
        publishSchedule: currentTask.publishSchedule,
        scheduledTime: currentTask.scheduledTime,
        publishedAt: currentTask.publishedAt,
        publishedTo: currentTask.publishedTo,
        
        // Override with new data
        ...taskData
      };
      
      const response = await api.put(`/tasks/${id}`, updateData);
      setTasks(prev => prev.map(t => t.id === id ? response.data : t));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const generateDraft = async (taskId: string) => {
    try {
      const response = await api.post('/ai/generate-draft', { task_id: taskId });
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to generate draft');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    generateDraft,
    refetch: fetchTasks,
  };
}