import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface SocialPost {
  id: string;
  draft_id?: string;
  persona_id: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  content: string;
  hashtags: string[];
  target_time?: string;
  status: 'draft' | 'scheduled' | 'published';
  persona?: any;
  draft?: any;
}

export function useSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/social-posts');
      setPosts(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (postData: Partial<SocialPost>) => {
    const response = await api.post('/social-posts', postData);
    setPosts([response.data, ...posts]);
    return response.data;
  };

  const generateFromDraft = async (draftId: string, platform: string) => {
    const response = await api.post('/social-posts/generate', {
      draft_id: draftId,
      platform: platform
    });
    return response.data;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    isLoading,
    error,
    createPost,
    generateFromDraft,
    refetch: fetchPosts,
  };
}