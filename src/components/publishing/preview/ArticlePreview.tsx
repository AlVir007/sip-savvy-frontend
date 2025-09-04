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
    summary?: string;
    featured_image?: string;
    published_at?: string;
    categories?: Array<{ id: number; name: string; color?: string }>;
    tags?: Array<{ id: number; name: string }>;
    persona?: { 
      id?: string;
      name: string; 
      profile_picture?: string 
    };
    reading_time?: number;
    readability_score?: {
      level: string;
      score: number;
    };
  };
  compact?: boolean;
}

export function ArticlePreview({ article, compact = false }: ArticlePreviewProps) {
  // Handle content formatting - use content directly if it's HTML
  const isHtml = article.content?.includes('<');
  const formattedContent = isHtml 
    ? article.content 
    : article.content.split('\n\n').map((para, i) => `<p key=${i}>${para}</p>`).join('');

  const excerpt = article.excerpt || article.summary;

  return (
    <div className={`mx-auto bg-white rounded-lg shadow-md overflow-hidden ${compact ? 'max-w-2xl' : 'max-w-4xl'}`}>
      {/* Featured Image */}
      {article.featured_image && (
        <div className={`w-full overflow-hidden ${compact ? 'h-48' : 'h-72'}`}>
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`p-${compact ? '4' : '6'}`}>
        {/* Categories */}
        {article.categories && article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.map((category) => (
              <Badge
                key={category.id}
                style={{ backgroundColor: category.color || '#666' }}
                className="text-white"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className={`font-bold text-gray-900 mb-2 ${compact ? 'text-2xl' : 'text-3xl'}`}>
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6">
          {/* Author with avatar */}
          {article.persona && (
            <div className="flex items-center">
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
            <span>
              {format(new Date(article.published_at), 'MMMM d, yyyy')}
            </span>
          )}

          {/* Reading time */}
          {article.reading_time && (
            <span>{article.reading_time} min read</span>
          )}
          
          {/* Readability score */}
          {article.readability_score && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {article.readability_score.level} Level ({article.readability_score.score}%)
            </span>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <div className={`text-gray-700 mb-6 font-serif italic ${compact ? 'text-lg' : 'text-xl'}`}>
            {excerpt}
          </div>
        )}

        {/* Content */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge 
                  key={tag.id ? `tag-${tag.id}` : `tag-${index}-${tag.name}`} 
                  variant="outline"
                >
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