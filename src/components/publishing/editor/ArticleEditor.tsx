// src/components/publishing/PublishingModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea'; // Add this import
import { Task } from '@/types';
import { 
  GlobeAltIcon,
  ShareIcon, 
  CalendarIcon
} from '@heroicons/react/24/outline';

interface PublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onPublish: (data: any) => Promise<void>;
}

export function PublishingModal({ isOpen, onClose, task, onPublish }: PublishingModalProps) {
  const [activeTab, setActiveTab] = useState('website');
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Initialize from task data
  const [publishWebsite, setPublishWebsite] = useState(false);
  const [publishSocial, setPublishSocial] = useState(false);
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Social post content
  const [socialContent, setSocialContent] = useState('');
  
  useEffect(() => {
    if (task) {
      setPublishWebsite(task.publishWebsite || true);
      setPublishSocial(task.publishSocial || false);
      setSocialPlatforms(task.socialPlatforms || []);
      setScheduleType(task.publishSchedule === 'scheduled' ? 'scheduled' : 'now');
      setScheduledTime(task.scheduledTime || '');
      
      // Generate default social content based on task
      setSocialContent(`Check out our new article: ${task.title} #content #article`);
      
      // Set active tab based on publishing intent
      if (task.publishWebsite) {
        setActiveTab('website');
      } else if (task.publishSocial) {
        setActiveTab('social');
      }
    }
  }, [task]);
  
  const handleSocialPlatformToggle = (platform: string) => {
    setSocialPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  const handlePublish = async () => {
    if (!task) return;
    
    setIsPublishing(true);
    
    try {
      const publishData = {
        taskId: task.id,
        publishWebsite,
        publishSocial,
        socialPlatforms,
        scheduleType,
        scheduledTime: scheduleType === 'scheduled' ? scheduledTime : undefined,
        socialContent: publishSocial ? socialContent : undefined,
      };
      
      await onPublish(publishData);
      onClose();
    } catch (error) {
      console.error('Publishing failed:', error);
      // Show error message
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Content</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'website'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } ${!publishWebsite ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => publishWebsite && setActiveTab('website')}
                disabled={!publishWebsite}
              >
                Website Article
              </button>
              <button
                type="button"
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'social'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } ${!publishSocial ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => publishSocial && setActiveTab('social')}
                disabled={!publishSocial}
              >
                Social Media
              </button>
            </div>
          </div>
          
          {/* Common publishing options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="publish-website-modal"
                checked={publishWebsite}
                onCheckedChange={(checked) => setPublishWebsite(checked === true)}
              />
              <label 
                htmlFor="publish-website-modal"
                className="text-sm font-medium flex items-center"
              >
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                Publish as website article
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="publish-social-modal"
                checked={publishSocial}
                onCheckedChange={(checked) => setPublishSocial(checked === true)}
              />
              <label 
                htmlFor="publish-social-modal"
                className="text-sm font-medium flex items-center"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share on social media
              </label>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="mt-6">
            {/* Website tab content */}
            <div className={activeTab === 'website' ? '' : 'hidden'}>
              {publishWebsite && (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="text-sm font-medium mb-2">Article Preview</h3>
                  <div className="bg-white rounded-md p-3 border border-gray-200">
                    <h4 className="font-bold">{task?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task?.description}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Social tab content */}
            <div className={activeTab === 'social' ? '' : 'hidden'}>
              {publishSocial && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium mb-2">Platforms</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-twitter-modal"
                          checked={socialPlatforms.includes('twitter')}
                          onCheckedChange={() => handleSocialPlatformToggle('twitter')}
                        />
                        <label 
                          htmlFor="platform-twitter-modal"
                          className="text-sm"
                        >
                          Twitter
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-facebook-modal"
                          checked={socialPlatforms.includes('facebook')}
                          onCheckedChange={() => handleSocialPlatformToggle('facebook')}
                        />
                        <label 
                          htmlFor="platform-facebook-modal"
                          className="text-sm"
                        >
                          Facebook
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-linkedin-modal"
                          checked={socialPlatforms.includes('linkedin')}
                          onCheckedChange={() => handleSocialPlatformToggle('linkedin')}
                        />
                        <label 
                          htmlFor="platform-linkedin-modal"
                          className="text-sm"
                        >
                          LinkedIn
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-instagram-modal"
                          checked={socialPlatforms.includes('instagram')}
                          onCheckedChange={() => handleSocialPlatformToggle('instagram')}
                        />
                        <label 
                          htmlFor="platform-instagram-modal"
                          className="text-sm"
                        >
                          Instagram
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium mb-2">Post Content</h3>
                    <Textarea
                      value={socialContent}
                      onChange={(e) => setSocialContent(e.target.value)}
                      rows={4}
                      placeholder="Write your social media post..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Publishing schedule - common to both tabs */}
          {(publishWebsite || publishSocial) && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Publishing Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-now"
                    name="schedule"
                    checked={scheduleType === 'now'}
                    onChange={() => setScheduleType('now')}
                    className="h-4 w-4"
                  />
                  <label htmlFor="schedule-now" className="text-sm">
                    Publish now
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-later"
                    name="schedule"
                    checked={scheduleType === 'scheduled'}
                    onChange={() => setScheduleType('scheduled')}
                    className="h-4 w-4"
                  />
                  <label htmlFor="schedule-later" className="text-sm">
                    Schedule for later
                  </label>
                </div>
              </div>
              
              {scheduleType === 'scheduled' && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing || (!publishWebsite && !publishSocial)}
          >
            {isPublishing ? 'Publishing...' : 'Publish Content'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}