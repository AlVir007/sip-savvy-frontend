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

  const updateTaskStatus = async (id: string, newStatus: Task['status']) => {
    try {
      const currentTask = tasks.find(t => t.id === id);
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      // For status updates, only send the status field
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === id ? response.data : t));
      return response.data;
    } catch (err: any) {
      console.error('❌ Update task status error:', err.response?.data);
      throw new Error(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const currentTask = tasks.find(t => t.id === id);
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      // Filter out empty values from taskData
      const cleanTaskData = Object.fromEntries(
        Object.entries(taskData).filter(([key, value]) => {
          if (typeof value === 'string') return value.trim() !== '';
          if (Array.isArray(value)) return value.length > 0;
          return value !== null && value !== undefined;
        })
      );
      
      // Merge current task with cleaned updates
      const updateData: Partial<Task> = {
        ...currentTask,           // Start with all current values
        ...cleanTaskData,         // Apply only valid updates
        id: currentTask.id,       // Ensure ID never changes
        created_at: currentTask.created_at, // Ensure created_at never changes
      };
      
      console.log('🔍 Current task:', currentTask);
      console.log('📝 Update data:', taskData);
      console.log('🧹 Cleaned update data:', cleanTaskData);
      console.log('🚀 Final update payload:', updateData);
      
      const response = await api.put(`/tasks/${id}`, updateData);
      setTasks(prev => prev.map(t => t.id === id ? response.data : t));
      return response.data;
    } catch (err: any) {
      console.error('❌ Update task error:', err.response?.data);
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