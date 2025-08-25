"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlePreview } from '@/components/publishing/preview/ArticlePreview';
import { toast } from 'react-hot-toast';

interface Draft {
  id: string;
  task_id?: string;
  persona_id?: string;
  title: string;
  summary?: string;
  body?: string;
  content?: string; // For compatibility with ArticlePreview
  excerpt?: string; // For compatibility with ArticlePreview
  featured_image?: string;
  persona?: { 
    id?: string;
    name: string; 
    profile_picture?: string 
  };
  categories?: Array<{ id: number; name: string; color?: string }>;
  tags?: Array<{ id: number; name: string }>;
  readability_score?: {
    level: string;
    score: number;
  };
  metadata?: {
    word_count: number;
    estimated_read_time: number;
  };
  status?: string;
}

interface DraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft | null;
  onApprove?: (draftId: string) => void;
  onReject?: (draftId: string) => void;
  onPublish?: (draftId: string) => void;
}

export function DraftModal({ isOpen, onClose, draft, onApprove, onReject, onPublish }: DraftModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  if (!isOpen || !draft) return null;

  const handleApprove = async () => {
    if (!onApprove) {
      toast.error('Approval functionality not available');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onApprove(draft.id);
      toast.success('Draft approved and moved to Publishing');
      onClose();
    } catch (error) {
      console.error('Failed to approve draft:', error);
      toast.error('Failed to approve draft');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) {
      toast.error('Reject functionality not available');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onReject(draft.id);
      toast.success('Draft rejected');
      onClose();
    } catch (error) {
      console.error('Failed to reject draft:', error);
      toast.error('Failed to reject draft');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!onPublish) {
      toast.error('Publish functionality not available');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onPublish(draft.id);
      toast.success('Draft published successfully');
      onClose();
    } catch (error) {
      console.error('Failed to publish draft:', error);
      toast.error('Failed to publish draft');
    } finally {
      setIsProcessing(false);
    }
  };

  // Prepare content for preview - convert the markdown-like format to HTML
  const prepareContentForPreview = (body?: string) => {
    if (!body) return '';
    
    let html = '';
    body.split('\n').forEach((paragraph) => {
      if (paragraph.startsWith('# ')) {
        html += `<h1 class="text-2xl font-bold mt-6 mb-4">${paragraph.slice(2)}</h1>`;
      } else if (paragraph.startsWith('## ')) {
        html += `<h2 class="text-xl font-semibold mt-5 mb-3">${paragraph.slice(3)}</h2>`;
      } else if (paragraph.startsWith('### ')) {
        html += `<h3 class="text-lg font-medium mt-4 mb-2">${paragraph.slice(4)}</h3>`;
      } else if (paragraph.trim() === '') {
        html += '<br />';
      } else {
        html += `<p class="mb-4 leading-relaxed">${paragraph}</p>`;
      }
    });
    
    return html;
  };

  // Determine if the draft is already approved
  const isApproved = draft.status === 'approved';
  const isRejected = draft.status === 'rejected';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{draft.title}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
          
          {draft.summary && (
            <p className="text-sm text-gray-600 mt-2">{draft.summary}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            {draft.metadata?.word_count && (
              <span>{draft.metadata.word_count} words</span>
            )}
            {draft.metadata?.estimated_read_time && (
              <span>{draft.metadata.estimated_read_time} min read</span>
            )}
            {draft.readability_score && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {draft.readability_score.level} Level ({draft.readability_score.score}%)
              </span>
            )}
            {draft.status && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                draft.status === 'approved' ? 'bg-green-100 text-green-800' :
                draft.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <div className="prose prose-sm max-w-none">
                {draft.body?.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.slice(2)}</h1>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{paragraph.slice(3)}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{paragraph.slice(4)}</h3>;
                  }
                  if (paragraph.trim() === '') {
                    return <br key={index} />;
                  }
                  return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <ArticlePreview
                article={{
                  title: draft.title,
                  content: prepareContentForPreview(draft.body),
                  excerpt: draft.summary || draft.excerpt,
                  featured_image: draft.featured_image,
                  persona: draft.persona,
                  categories: draft.categories,
                  tags: draft.tags,
                  reading_time: draft.metadata?.estimated_read_time || 
                    Math.ceil((draft.body?.split(' ').length || 0) / 200) // Estimate
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <div className="border-t p-4 flex space-x-3">
          {/* Approval button - show only if not approved/rejected */}
          {onApprove && !isApproved && !isRejected && (
            <Button 
              onClick={handleApprove} 
              disabled={isProcessing}
              className="flex-1"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              {isProcessing ? 'Approving...' : 'Approve Draft'}
            </Button>
          )}
          
          {/* Reject button - show only if not rejected/approved */}
          {onReject && !isRejected && !isApproved && (
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={isProcessing}
              className="flex-1"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              {isProcessing ? 'Rejecting...' : 'Reject Draft'}
            </Button>
          )}
          
          {/* Publish button - show only for approved drafts */}
          {onPublish && isApproved && (
            <Button 
              onClick={handlePublish} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Publishing...' : 'Publish Draft'}
            </Button>
          )}
          
          {/* Status messages */}
          {isApproved && !onPublish && (
            <div className="flex-1 text-green-600 flex items-center">
              <CheckIcon className="w-4 h-4 mr-2" />
              This draft has been approved and moved to Publishing
            </div>
          )}
          
          {isRejected && (
            <div className="flex-1 text-red-600 flex items-center">
              <XMarkIcon className="w-4 h-4 mr-2" />
              This draft has been rejected
            </div>
          )}
          
          {/* Close button */}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}