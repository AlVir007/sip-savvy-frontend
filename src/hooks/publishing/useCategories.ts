// src/hooks/publishing/useCategories.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  image: string | null;
  is_featured: boolean;
  display_order: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'slug'>) => {
    try {
      const response = await api.post('/categories', categoryData);
      setCategories([...categories, response.data]);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Omit<Category, 'id' | 'slug'>>) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      setCategories(categories.map(cat => cat.id === id ? response.data : cat));
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}