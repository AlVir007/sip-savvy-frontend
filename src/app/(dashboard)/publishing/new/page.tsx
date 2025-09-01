// src/app/(dashboard)/publishing/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/publishing/editor/ArticleEditor';
import { useArticles } from '@/hooks/publishing/useArticles';
import { useCategories } from '@/hooks/publishing/useCategories';
import { useTags } from '@/hooks/publishing/useTags';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { usePersonas } from '@/hooks/usePersonas';
import { MultiSelect } from '@/components/ui/multi-select';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const { createArticle } = useArticles();
  const { categories } = useCategories();
  const { tags } = useTags();
  const { personas } = usePersonas();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  
  // Article content state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const handleSave = async (data: { title: string; content: string; excerpt: string }) => {
    if (!selectedPersona) {
      alert('Please select an author persona');
      return;
    }

    setSaving(true);
    try {
      await createArticle({
        ...data,
        status,
        is_featured: isFeatured,
        categories: selectedCategories,
        tags: selectedTags,
        persona_id: selectedPersona,
      });
      router.push('/publishing');
    } catch (error) {
      console.error('Error saving article:', error);
      setSaving(false);
    }
  };

  const handleSaveAsReview = async () => {
    setStatus('review');
    await handleSave({ title, content, excerpt });
  };

  const handleSaveAndPublish = async () => {
    setStatus('published');
    await handleSave({ title, content, excerpt });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/publishing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Article</h1>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleSaveAsReview}
            disabled={saving || !title.trim() || !content.trim() || !selectedPersona}
          >
            <Eye className="h-4 w-4 mr-2" />
            Save as Review
          </Button>
          <Button
            onClick={handleSaveAndPublish}
            disabled={saving || !title.trim() || !content.trim() || !selectedPersona}
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleEditor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onChange={setContent}
            metadata={{ excerpt }}
            onMetadataChange={(metadata) => setExcerpt(metadata.excerpt || '')}
            onSave={handleSave}
            saving={saving}
          />
        </div>
        <div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="persona">Author Persona</Label>
                <Select
                  value={selectedPersona}
                  onValueChange={setSelectedPersona}
                >
                  <SelectTrigger id="persona">
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories">Categories</Label>
                <MultiSelect
                  options={categories.map(cat => ({ label: cat.name, value: cat.id.toString() }))}
                  selected={selectedCategories.map(id => id.toString())}
                  onChange={(values) => setSelectedCategories(values.map(v => parseInt(v)))}
                  placeholder="Select categories"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <MultiSelect
                  options={tags.map(tag => ({ label: tag.name, value: tag.id.toString() }))}
                  onChange={(values) => setSelectedTags(values.map(v => parseInt(v)))}
                  selected={selectedTags.map(id => id.toString())}
                  placeholder="Select tags"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">Feature this article</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}