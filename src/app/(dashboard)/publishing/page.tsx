// src/app/(dashboard)/publishing/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArticles } from '@/hooks/publishing/useArticles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit, Trash2, Eye, Star, Clock, ArrowLeft, Lightbulb
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PublishingPage() {
  const { articles, loading, error, fetchArticles, deleteArticle, publishArticle, featureArticle } = useArticles();
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    fetchArticles(1, value !== 'all' ? { status: value } : {});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // Add a proper container with consistent padding
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Header with back button and page title */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Publishing</h1>
          </div>
          {/* Removed "New Article" button to enforce the Task → Draft → Publishing workflow */}
        </div>

        {/* Filter controls in a card for better visual hierarchy */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Filter by status:</p>
                <Select value={statusFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-500">
                {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Articles grid with improved loading and empty states */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading articles...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center py-8 text-red-500">
                <p className="text-lg font-semibold mb-2">Error loading articles</p>
                <p>{error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No articles in Publishing yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Articles appear here when tasks have been completed and drafts have been approved. 
                  Start by creating a task and moving it through the workflow.
                </p>
                <Link href="/">
                  <Button variant="default">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden h-full flex flex-col">
                {article.featured_image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    {article.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className={getStatusColor(article.status)}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </Badge>
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
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {article.excerpt || 'No excerpt available'}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto mb-4">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.published_at
                        ? format(new Date(article.published_at), 'MMM d, yyyy')
                        : 'Not published'}
                    </div>
                    <div>
                      {article.reading_time && `${article.reading_time} min read`}
                    </div>
                  </div>
                  <div className="flex justify-between mt-auto">
                    <div className="space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => featureArticle(article.id)}
                        title={article.is_featured ? "Unfeature" : "Feature"}
                      >
                        <Star className={`h-4 w-4 ${article.is_featured ? 'fill-yellow-400' : ''}`} />
                      </Button>
                      {article.status !== 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => publishArticle(article.id)}
                          title="Publish"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-x-1">
                      <Link href={`/publishing/${article.id}/edit`}>
                        <Button size="sm" variant="outline" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this article?')) {
                            deleteArticle(article.id);
                          }
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}