import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Draft } from '@/types';

export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrafts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/drafts');
      setDrafts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch drafts');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDraft = async (id: string, draftData: Partial<Draft>) => {
    try {
      const response = await api.put(`/drafts/${id}`, draftData);
      setDrafts(prev => prev.map(d => d.id === id ? response.data : d));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update draft');
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      await api.delete(`/drafts/${id}`);
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete draft');
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return {
    drafts,
    isLoading,
    error,
    updateDraft,
    deleteDraft,
    refetch: fetchDrafts,
  };
}