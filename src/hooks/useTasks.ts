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
      
      // Merge current task data with updates to ensure required fields are present
      const updateData = {
        title: currentTask.title,
        type: currentTask.type,
        priority: currentTask.priority,
        ...taskData // Override with new data
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