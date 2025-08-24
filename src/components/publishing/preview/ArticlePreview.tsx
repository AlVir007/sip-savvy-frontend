// src/components/publishing/preview/ArticlePreview.tsx
'use client';

import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ArticlePreviewProps {
  article: {
    title: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    published_at?: string;
    categories?: Array<{ id: number; name: string; color?: string }>;
    tags?: Array<{ id: number; name: string }>;
    persona?: { name: string; profile_picture?: string };
    reading_time?: number;
  };
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Featured Image */}
      {article.featured_image && (
        <div className="w-full h-72 overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories?.map((category) => (
            <Badge
              key={category.id}
              style={{ backgroundColor: category.color || '#666' }}
              className="text-white"
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>

        {/* Metadata */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          {/* Author with avatar */}
          {article.persona && (
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 mr-2">
                {article.persona.profile_picture ? (
                  <img
                    src={article.persona.profile_picture}
                    alt={article.persona.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {article.persona.name.charAt(0)}
                  </div>
                )}
              </div>
              <span>{article.persona.name}</span>
            </div>
          )}

          {/* Date */}
          {article.published_at && (
            <span className="mr-4">
              {format(new Date(article.published_at), 'MMMM d, yyyy')}
            </span>
          )}

          {/* Reading time */}
          {article.reading_time && (
            <span>{article.reading_time} min read</span>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="text-xl text-gray-700 mb-6 font-serif italic">
            {article.excerpt}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}