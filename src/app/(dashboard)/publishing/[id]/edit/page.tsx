// src/app/(dashboard)/publishing/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const { getArticle, updateArticle, deleteArticle, publishArticle } = useArticles();
  const { categories } = useCategories();
  const { tags } = useTags();
  const { personas } = usePersonas();
  
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(parseInt(articleId));
        setArticle(data);
        setStatus(data.status);
        setIsFeatured(data.is_featured);
        setSelectedCategories(data.categories.map((cat: any) => cat.id));
        setSelectedTags(data.tags.map((tag: any) => tag.id));
        setSelectedPersona(data.persona_id);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, getArticle]);

  const handleSave = async (data: { title: string; content: string; excerpt: string }) => {
    if (!selectedPersona) {
      alert('Please select an author persona');
      return;
    }

    setSaving(true);
    try {
      await updateArticle(parseInt(articleId), {
        ...data,
        status,
        is_featured: isFeatured,
        categories: selectedCategories,
        tags: selectedTags,
        persona_id: selectedPersona,
      });
      router.push('/publishing');
    } catch (error) {
      console.error('Error updating article:', error);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(parseInt(articleId));
        router.push('/publishing');
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handlePublish = async () => {
    try {
      await publishArticle(parseInt(articleId));
      router.push('/publishing');
    } catch (error) {
      console.error('Error publishing article:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading article...</div>;
  }

  if (!article) {
    return <div className="flex items-center justify-center h-64">Article not found</div>;
  }

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
          <h1 className="text-3xl font-bold">Edit Article</h1>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStatus('review');
              handleSave({ 
                title: article.title, 
                content: article.content, 
                excerpt: article.excerpt || '' 
              });
            }}
            disabled={saving}
          >
            <Eye className="h-4 w-4 mr-2" />
            Save as Review
          </Button>
          <Button
            onClick={handlePublish}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleEditor
            initialTitle={article.title}
            initialContent={article.content}
            initialExcerpt={article.excerpt || ''}
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
                  selected={selectedTags.map(id => id.toString())}
                  onChange={(values) => setSelectedTags(values.map(v => parseInt(v)))}
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

              {article.created_at && (
                <div className="text-sm text-gray-500">
                  Created: {new Date(article.created_at).toLocaleDateString()}
                </div>
              )}
              
              {article.published_at && (
                <div className="text-sm text-gray-500">
                  Published: {new Date(article.published_at).toLocaleDateString()}
                </div>
              )}

              {article.view_count > 0 && (
                <div className="text-sm text-gray-500">
                  Views: {article.view_count}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}