// src/hooks/publishing/useArticles.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Category } from './useCategories';
import { Tag } from './useTags';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  reading_time: number | null;
  categories: Category[];
  tags: Tag[];
  persona_id: string;
}

export interface ArticleInput {
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status?: 'draft' | 'review' | 'published' | 'archived';
  is_featured?: boolean;
  persona_id: string;
  categories?: number[];
  tags?: number[];
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchArticles = async (page = 1, filters: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const params = { page, ...filters };
      const response = await api.get('/articles', { params });
      setArticles(response.data.data);
      setTotal(response.data.total);
      setLastPage(response.data.last_page);
      setPage(response.data.current_page);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const getArticle = async (id: number) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const createArticle = async (articleData: ArticleInput) => {
    try {
      const response = await api.post('/articles', articleData);
      setArticles([response.data, ...articles]);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateArticle = async (id: number, articleData: Partial<ArticleInput>) => {
    try {
      const response = await api.put(`/articles/${id}`, articleData);
      setArticles(articles.map(article => article.id === id ? response.data : article));
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteArticle = async (id: number) => {
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const publishArticle = async (id: number) => {
    try {
      const response = await api.post(`/articles/${id}/publish`);
      setArticles(articles.map(article => article.id === id ? response.data : article));
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const featureArticle = async (id: number) => {
    try {
      const response = await api.post(`/articles/${id}/feature`);
      setArticles(articles.map(article => article.id === id ? response.data : article));
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    total,
    page,
    lastPage,
    fetchArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    featureArticle
  };
}