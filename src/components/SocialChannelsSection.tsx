import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  MessageCircle,
  Share2,
  Settings,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';
import { SocialPlatform } from './SocialChannelModal';
import SocialConnectionsModal from './SocialConnectionsModal';

// Custom icon components
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface SocialChannelsSectionProps {
  personas: any[];
  onAddConnection: (personaId: string, connection: any) => void;
  onUpdateConnection: (personaId: string, connectionId: string, updates: any) => void;
  onRemoveConnection: (personaId: string, connectionId: string) => void;
}

export default function SocialChannelsSection({
  personas,
  onAddConnection,
  onUpdateConnection,
  onRemoveConnection
}: SocialChannelsSectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  const platforms: { 
    id: SocialPlatform; 
    name: string; 
    icon: React.ComponentType<any>; 
    color: string;
    description: string;
  }[] = [
    { 
      id: 'x', 
      name: 'X (Twitter)', 
      icon: TwitterIcon, 
      color: '#1DA1F2',
      description: 'Real-time conversations and industry news'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: InstagramIcon, 
      color: '#E4405F',
      description: 'Visual storytelling and lifestyle content'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: LinkedinIcon, 
      color: '#0A66C2',
      description: 'Professional networking and insights'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Share2, 
      color: '#000000',
      description: 'Short-form video content'
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: YoutubeIcon, 
      color: '#FF0000',
      description: 'Long-form video content'
    },
    { 
      id: 'telegram', 
      name: 'Telegram', 
      icon: MessageCircle, 
      color: '#0088CC',
      description: 'Direct communication channels'
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: '#25D366',
      description: 'Business communication'
    },
  ];

  // Calculate stats
  const totalConnections = personas.reduce((total, persona) => 
    total + (persona.socialConnections?.length || 0), 0
  );
  
  const activeConnections = personas.reduce((total, persona) => 
    total + (persona.socialConnections?.filter((conn: any) => conn.isActive)?.length || 0), 0
  );

  const getConnectionsForPlatform = (platformId: SocialPlatform) => {
    return personas.flatMap(persona => 
      (persona.socialConnections || [])
        .filter((conn: any) => conn.platform === platformId)
        .map((conn: any) => ({ ...conn, personaName: persona.name, personaId: persona.id }))
    );
  };

  const handlePlatformClick = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setShowChannelModal(true);
  };

  const handlePersonaClick = (persona: any) => {
    setSelectedPersona(persona);
    setShowConnectionsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media Channels</h2>
          <p className="text-gray-600 mt-1">Manage social media accounts and assign them to journalists</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalConnections}</div>
                <p className="text-sm text-gray-600">Total Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{activeConnections}</div>
                <p className="text-sm text-gray-600">Active Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{platforms.length}</div>
                <p className="text-sm text-gray-600">Available Platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Social Media Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const PlatformIcon = platform.icon;
            const connections = getConnectionsForPlatform(platform.id);
            const activeCount = connections.filter(conn => conn.isActive).length;
            
            return (
              <Card 
                key={platform.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePlatformClick(platform.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: platform.color }}
                      >
                        <PlatformIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{platform.name}</h4>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <div className="text-lg font-bold" style={{ color: platform.color }}>
                          {connections.length}
                        </div>
                        <div className="text-xs text-gray-600">Accounts</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{activeCount}</div>
                        <div className="text-xs text-gray-600">Active</div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlatformClick(platform.id);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Journalists Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Journalist Social Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((persona) => {
            const connections = persona.socialConnections || [];
            const activeConnections = connections.filter((conn: any) => conn.isActive);
            
            return (
              <Card 
                key={persona.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePersonaClick(persona)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Users className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{persona.name}</h4>
                        <p className="text-sm text-gray-600">{persona.expertise || 'Journalist'}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePersonaClick(persona);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Connected Platforms</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {connections.length} total, {activeConnections.length} active
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {connections.slice(0, 4).map((connection: any) => {
                        const platform = platforms.find(p => p.id === connection.platform);
                        const PlatformIcon = platform?.icon || Share2;
                        
                        return (
                          <div 
                            key={connection.id}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: `${platform?.color}20`, color: platform?.color }}
                          >
                            <PlatformIcon className="w-3 h-3" />
                            {connection.handle}
                          </div>
                        );
                      })}
                      {connections.length > 4 && (
                        <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          +{connections.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {selectedPersona && (
        <SocialConnectionsModal
          visible={showConnectionsModal}
          onClose={() => {
            setShowConnectionsModal(false);
            setSelectedPersona(null);
          }}
          persona={selectedPersona}
          onAddConnection={onAddConnection}
          onUpdateConnection={onUpdateConnection}
          onRemoveConnection={onRemoveConnection}
        />
      )}
    </div>
  );
}