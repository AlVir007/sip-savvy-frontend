// src/components/publishing/editor/ArticleEditor.tsx
import React from 'react';

// Make all properties optional
interface ArticleEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  readOnly?: boolean;
  metadata?: {
    excerpt?: string;
    featuredImage?: string;
    categories?: any[];
    tags?: any[];
  };
  onMetadataChange?: (metadata: any) => void;
}

// Provide default values for all props
export function ArticleEditor({
  content = '',
  onChange = () => {},
  title = '',
  onTitleChange = () => {},
  readOnly = false,
  metadata = {},
  onMetadataChange
}: ArticleEditorProps) {
  return (
    <div className="article-editor">
      {/* Title field */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full p-2 text-xl font-bold border-b focus:outline-none"
          placeholder="Article Title"
          readOnly={readOnly}
        />
      </div>
      
      {/* Content field */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 min-h-[300px] border rounded-md"
          placeholder="Write your article content here..."
          readOnly={readOnly}
        />
      </div>
      
      {/* Metadata fields */}
      {onMetadataChange && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Article Settings</h3>
          
          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              value={metadata.excerpt || ''}
              onChange={(e) => onMetadataChange({
                ...metadata,
                excerpt: e.target.value
              })}
              className="w-full p-2 h-20 border rounded-md"
              placeholder="Brief summary of the article..."
              readOnly={readOnly}
            />
          </div>
          
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Featured Image URL</label>
            <input
              type="text"
              value={metadata.featuredImage || ''}
              onChange={(e) => onMetadataChange({
                ...metadata,
                featuredImage: e.target.value
              })}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/image.jpg"
              readOnly={readOnly}
            />
          </div>
        </div>
      )}
    </div>
  );
}