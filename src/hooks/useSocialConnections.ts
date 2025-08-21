import { useState, useCallback } from 'react';

export interface SocialConnection {
  id: string;
  platform: 'x' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'telegram' | 'whatsapp';
  handle: string;
  isActive: boolean;
  postingStyle: string;
  hashtagStrategy: string[];
  postingFrequency: 'high' | 'medium' | 'low';
  audienceTarget: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useSocialConnections() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addConnection = useCallback(async (personaId: string, connectionData: Omit<SocialConnection, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/personas/${personaId}/social-connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add social connection: ${response.statusText}`);
      }

      const newConnection = await response.json();
      return newConnection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add social connection';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConnection = useCallback(async (personaId: string, connectionId: string, updates: Partial<SocialConnection>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/personas/${personaId}/social-connections/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update social connection: ${response.statusText}`);
      }

      const updatedConnection = await response.json();
      return updatedConnection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update social connection';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeConnection = useCallback(async (personaId: string, connectionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/personas/${personaId}/social-connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to remove social connection: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove social connection';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getConnectionsByPlatform = useCallback(async (platform: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/social-connections?platform=${platform}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch connections: ${response.statusText}`);
      }

      const connections = await response.json();
      return connections;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connections';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPersonaConnections = useCallback(async (personaId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/personas/${personaId}/social-connections`);

      if (!response.ok) {
        throw new Error(`Failed to fetch persona connections: ${response.statusText}`);
      }

      const connections = await response.json();
      return connections;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch persona connections';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    addConnection,
    updateConnection,
    removeConnection,
    getConnectionsByPlatform,
    getPersonaConnections,
    isLoading,
    error,
  };
}