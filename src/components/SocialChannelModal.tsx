import React, { useState } from 'react';
import { 
  X as Twitter, 
  MessageCircle,
  Share2,
  Pencil,
  Trash2,
  Plus,
  Share
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export type SocialPlatform = 'x' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'telegram' | 'whatsapp';


export const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Instagram icon component
export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Custom LinkedIn icon component
export const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Custom YouTube icon component
export const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Also add a Facebook icon since we need it
export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface SocialConnectionsModalProps {
  visible: boolean;
  onClose: () => void;
  persona: any;
  onAddConnection: (personaId: string, connection: any) => void;
  onUpdateConnection: (personaId: string, connectionId: string, updates: any) => void;
  onRemoveConnection: (personaId: string, connectionId: string) => void;
}

export default function SocialConnectionsModal({
  visible,
  onClose,
  persona,
  onAddConnection,
  onUpdateConnection,
  onRemoveConnection
}: SocialConnectionsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConnection, setEditingConnection] = useState<any>(null);
  
  const [platform, setPlatform] = useState<SocialPlatform>('x');
  const [handle, setHandle] = useState('');
  const [postingStyle, setPostingStyle] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [frequency, setFrequency] = useState<'high' | 'medium' | 'low'>('medium');
  const [audienceTarget, setAudienceTarget] = useState('');
  const [isActive, setIsActive] = useState(true);

  const platforms: { id: SocialPlatform; name: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'x', name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon, color: '#0A66C2' },
    { id: 'tiktok', name: 'TikTok', icon: Share2, color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: YoutubeIcon, color: '#FF0000' },
    { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: '#0088CC' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  ];

  const resetForm = () => {
    setPlatform('x');
    setHandle('');
    setPostingStyle('');
    setHashtags('');
    setFrequency('medium');
    setAudienceTarget('');
    setIsActive(true);
    setEditingConnection(null);
  };

  const startEdit = (connection: any) => {
    setEditingConnection(connection);
    setPlatform(connection.platform);
    setHandle(connection.handle);
    setPostingStyle(connection.postingStyle);
    setHashtags(connection.hashtagStrategy?.join(', ') || '');
    setFrequency(connection.postingFrequency);
    setAudienceTarget(connection.audienceTarget);
    setIsActive(connection.isActive);
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!handle.trim() || !postingStyle.trim()) {
      alert('Handle and posting style are required');
      return;
    }

    const connectionData = {
      platform,
      handle: handle.trim(),
      isActive,
      postingStyle: postingStyle.trim(),
      hashtagStrategy: hashtags.split(',').map(h => h.trim()).filter(h => h.length > 0),
      postingFrequency: frequency,
      audienceTarget: audienceTarget.trim(),
    };

    if (editingConnection) {
      onUpdateConnection(persona.id, editingConnection.id, connectionData);
    } else {
      onAddConnection(persona.id, connectionData);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleDelete = (connection: any) => {
    if (confirm(`Remove ${connection.handle} from ${connection.platform}?`)) {
      onRemoveConnection(persona.id, connection.id);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${visible ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Share className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-semibold">{persona.name} - Social Accounts</div>
                  <div className="text-sm text-gray-600">Manage social media connections</div>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {showAddForm ? (
            // Add/Edit Form
            <div className="p-6 space-y-6">
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">{editingConnection ? 'Edit Connection' : 'Add Social Connection'}</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((p) => {
                        const PlatformIcon = p.icon;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setPlatform(p.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                              platform === p.id 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={{
                              backgroundColor: platform === p.id ? p.color : undefined
                            }}
                          >
                            <PlatformIcon className="w-4 h-4" />
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Handle</label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHandle(e.target.value)}
                      placeholder="@username or handle"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Posting Style</label>
                    <textarea
                      value={postingStyle}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostingStyle(e.target.value)}
                      placeholder="Describe the posting style for this platform"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Hashtag Strategy</label>
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHashtags(e.target.value)}
                      placeholder="#tag1, #tag2, #tag3 (comma separated)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Posting Frequency</label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setFrequency(freq)}
                          className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                            frequency === freq 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={audienceTarget}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAudienceTarget(e.target.value)}
                      placeholder="Describe the target audience"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Active</label>
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => {
                        resetForm();
                        setShowAddForm(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      {editingConnection ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Connections List
            <div className="p-6 space-y-6">
              {(!persona.socialConnections || persona.socialConnections.length === 0) ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Share className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No social connections yet. Add your first platform!</p>
                      <Button
                        onClick={() => {
                          resetForm();
                          setShowAddForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add First Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {(persona.socialConnections || []).map((connection: any) => {
                    const platformInfo = platforms.find(p => p.id === connection.platform);
                    const PlatformIcon = platformInfo?.icon || Share;
                    
                    return (
                      <Card key={connection.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: platformInfo?.color || '#6B7280' }}
                              >
                                <PlatformIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold">{connection.handle}</div>
                                <div className="text-sm text-gray-600">
                                  {platformInfo?.name} • {connection.postingFrequency} frequency
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!connection.isActive && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Inactive</span>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(connection)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(connection)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{connection.postingStyle}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {connection.hashtagStrategy?.slice(0, 4).map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}