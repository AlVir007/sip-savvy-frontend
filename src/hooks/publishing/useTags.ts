// src/hooks/publishing/useTags.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tags');
      setTags(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string) => {
    try {
      const response = await api.post('/tags', { name });
      setTags([...tags, response.data]);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTag = async (id: number, name: string) => {
    try {
      const response = await api.put(`/tags/${id}`, { name });
      setTags(tags.map(tag => tag.id === id ? response.data : tag));
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTag = async (id: number) => {
    try {
      await api.delete(`/tags/${id}`);
      setTags(tags.filter(tag => tag.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag
  };
}