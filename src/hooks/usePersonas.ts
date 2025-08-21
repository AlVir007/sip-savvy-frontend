import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Persona } from '@/types';

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonas = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/personas');
      setPersonas(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch personas');
    } finally {
      setIsLoading(false);
    }
  };

  const createPersona = async (personaData: Partial<Persona>) => {
    try {
      console.log('📤 API creating persona:', personaData); // ADD THIS
      const response = await api.post('/personas', personaData);
      console.log('📥 API response:', response.data); // ADD THIS
      setPersonas(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error('❌ Create error:', err.response?.data || err.message); // ADD THIS
      throw new Error(err.response?.data?.message || 'Failed to create persona');
    }
  };
  
  const updatePersona = async (id: string, personaData: Partial<Persona>) => {
    try {
      console.log('📤 API updating persona:', id, personaData); // ADD THIS
      const response = await api.put(`/personas/${id}`, personaData);
      console.log('📥 API response:', response.data); // ADD THIS
      setPersonas(prev => prev.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (err: any) {
      console.error('❌ Update error:', err.response?.data || err.message); // ADD THIS
      throw new Error(err.response?.data?.message || 'Failed to update persona');
    }
  };

  const deletePersona = async (id: string) => {
    try {
      await api.delete(`/personas/${id}`);
      setPersonas(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete persona');
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return {
    personas,
    isLoading,
    error,
    createPersona,
    updatePersona,
    deletePersona,
    refetch: fetchPersonas,
  };
}