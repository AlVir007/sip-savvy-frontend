"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Task, Persona } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<void>;
  personas: Persona[];
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSave, personas, task }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    description: '',
    type: 'blog' as 'feature' | 'news' | 'blog' | 'interview',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assigned_persona_id: '',
    ai_provider: 'openai' as 'openai' | 'anthropic' | 'grok',
    due_date: '',
    sources: [] as string[],
  });
  const [newSource, setNewSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        topic: task.topic || '',
        description: task.description || '',
        type: task.type,
        priority: task.priority,
        assigned_persona_id: task.assigned_persona_id || '',
        ai_provider: task.ai_provider || 'openai',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        sources: task.sources || [],
      });
    } else {
      setFormData({
        title: '',
        topic: '',
        description: '',
        type: 'blog',
        priority: 'medium',
        assigned_persona_id: '',
        ai_provider: 'openai',
        due_date: '',
        sources: [],
      });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSource = () => {
    if (newSource.trim() && !formData.sources.includes(newSource.trim())) {
      setFormData({
        ...formData,
        sources: [...formData.sources, newSource.trim()],
      });
      setNewSource('');
    }
  };

  const removeSource = (sourceToRemove: string) => {
    setFormData({
      ...formData,
      sources: formData.sources.filter(source => source !== sourceToRemove),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{task ? 'Edit Task' : 'Create New Task'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <Input
              placeholder="Topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
            
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="blog">Blog Post</option>
                  <option value="news">News Article</option>
                  <option value="feature">Feature Story</option>
                  <option value="interview">Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assign to Persona</label>
                <select
                  value={formData.assigned_persona_id}
                  onChange={(e) => setFormData({ ...formData, assigned_persona_id: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Unassigned</option>
                  {personas.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">AI Provider</label>
                <select
                  value={formData.ai_provider}
                  onChange={(e) => setFormData({ ...formData, ai_provider: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="openai">OpenAI GPT-4</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="grok">Grok (X.AI)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sources & References</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add source URL or reference"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSource())}
                />
                <Button type="button" onClick={addSource} size="sm">
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {formData.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate">{source}</span>
                    <button
                      type="button"
                      onClick={() => removeSource(source)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Save Task'}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}