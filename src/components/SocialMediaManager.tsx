import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShareIcon, HashtagIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface SocialMediaManagerProps {
  posts: any[];
  drafts: any[];
  personas: any[];
  onCreatePost: (post: any) => void;
  onGenerateFromDraft: (draftId: string, platform: string) => void;
}

export function SocialMediaManager({ posts, drafts, personas, onCreatePost, onGenerateFromDraft }: SocialMediaManagerProps) {
  const [selectedDraft, setSelectedDraft] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('twitter');
  
  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', limit: 280 },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', limit: 3000 },
    { id: 'facebook', name: 'Facebook', icon: 'f', limit: 63206 },
    { id: 'instagram', name: 'Instagram', icon: '📷', limit: 2200 },
  ];

  const handleGenerateSocial = async () => {
    if (selectedDraft) {
      await onGenerateFromDraft(selectedDraft, selectedPlatform);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate from Draft */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Social Media Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Draft</label>
              <select 
                value={selectedDraft}
                onChange={(e) => setSelectedDraft(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Choose a draft...</option>
                {drafts.map(draft => (
                  <option key={draft.id} value={draft.id}>{draft.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <div className="grid grid-cols-4 gap-2">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-3 border rounded-lg text-center ${
                      selectedPlatform === platform.id ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                  >
                    <div className="text-2xl">{platform.icon}</div>
                    <div className="text-xs mt-1">{platform.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <Button onClick={handleGenerateSocial} className="w-full">
              <ShareIcon className="w-4 h-4 mr-2" />
              Generate Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Social Media Posts</h3>
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <ShareIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No social media posts yet</p>
              <p className="text-sm text-gray-400 mt-1">Generate posts from your drafts to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">{post.platform}</span>
                        <span className="text-sm text-gray-500">• {post.status}</span>
                      </div>
                      <p className="text-sm">{post.content}</p>
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.hashtags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs text-blue-600">{tag}</span>
                          ))}
                        </div>
                      )}
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