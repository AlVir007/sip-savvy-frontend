// src/components/publishing/editor/ArticleEditor.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ArticleEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  title?: string;
  onTitleChange?: (title: string) => void;
  metadata?: {
    excerpt?: string;
    featuredImage?: string;
    categories?: any[];
    tags?: any[];
  };
  onMetadataChange?: (metadata: any) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function ArticleEditor({ 
  content = '', 
  onChange, 
  readOnly = false,
  title = '',
  onTitleChange,
  metadata = {},
  onMetadataChange,
  onSave,
  isSaving = false
}: ArticleEditorProps) {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="article-editor space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Input
              type="text"
              value={title}
              onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
              readOnly={readOnly}
              placeholder="Article title..."
              className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto"
            />
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={content}
                onChange={(e) => onChange && onChange(e.target.value)}
                readOnly={readOnly}
                className="min-h-[400px] resize-y"
                placeholder="Write your article content here..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={metadata.excerpt || ''}
                  onChange={(e) => onMetadataChange && onMetadataChange({ 
                    ...metadata, 
                    excerpt: e.target.value 
                  })}
                  readOnly={readOnly}
                  className="h-20"
                  placeholder="Short summary of the article..."
                />
              </div>
              
              <div>
                <Label htmlFor="featured-image">Featured Image URL</Label>
                <Input
                  id="featured-image"
                  type="text"
                  value={metadata.featuredImage || ''}
                  onChange={(e) => onMetadataChange && onMetadataChange({ 
                    ...metadata, 
                    featuredImage: e.target.value 
                  })}
                  readOnly={readOnly}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {/* We're not implementing the full category/tag UI for now */}
              <div className="text-sm text-gray-500">
                Categories and tags will be available in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {onSave && (
        <div className="flex justify-end">
          <Button 
            onClick={onSave} 
            disabled={isSaving || readOnly}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );
}