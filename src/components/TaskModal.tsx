// src/components/TaskModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Task, Persona } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  GlobeAltIcon as GlobeIcon, 
  ShareIcon, 
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/ui/checkbox';

// Import your custom social media icons
// Update this import path to match your project structure
import { 
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from './SocialChannelModal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task;
  personas: Persona[];
}

export function TaskModal({ isOpen, onClose, onSave, task, personas }: TaskModalProps) {
  // Existing task state
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<Task['type']>('feature');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedPersonaId, setAssignedPersonaId] = useState('');
  const [sources, setSources] = useState('');
  
  // New publishing-related state
  const [publishWebsite, setPublishWebsite] = useState(true);
  const [publishSocial, setPublishSocial] = useState(false);
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  const [publishSchedule, setPublishSchedule] = useState<'immediately' | 'scheduled'>('immediately');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // State for section collapsing
  const [publishingPlanOpen, setPublishingPlanOpen] = useState(true);
  
  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setTopic(task.topic || '');
      setDescription(task.description || '');
      setTaskType(task.type || 'feature');
      setPriority(task.priority || 'medium');
      setDueDate(task.due_date || '');
      setAssignedPersonaId(task.assigned_persona_id || '');
      setSources(task.sources ? task.sources.join('\n') : '');
      
      // Initialize publishing fields
      setPublishWebsite(task.publishWebsite || true);
      setPublishSocial(task.publishSocial || false);
      setSocialPlatforms(task.socialPlatforms || []);
      setPublishSchedule(task.publishSchedule || 'immediately');
      setScheduledTime(task.scheduledTime || '');
    } else {
      // Reset form for new task
      setTitle('');
      setTopic('');
      setDescription('');
      setTaskType('feature');
      setPriority('medium');
      setDueDate('');
      setAssignedPersonaId('');
      setSources('');
      
      // Default publishing options
      setPublishWebsite(true);
      setPublishSocial(false);
      setSocialPlatforms([]);
      setPublishSchedule('immediately');
      setScheduledTime('');
    }
  }, [task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      title,
      topic,
      description,
      type: taskType,
      priority,
      due_date: dueDate,
      assigned_persona_id: assignedPersonaId,
      sources: sources.split('\n').filter(s => s.trim() !== ''),
      
      // Add publishing fields
      publishWebsite,
      publishSocial,
      socialPlatforms,
      publishSchedule,
      scheduledTime: publishSchedule === 'scheduled' ? scheduledTime : undefined,
    };
    
    onSave(taskData);
  };
  
  const handleSocialPlatformToggle = (platform: string) => {
    setSocialPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <CardTitle>{task ? 'Edit Task' : 'Create New Task'}</CardTitle>
        </CardHeader>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit}>
            {/* Existing task fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Main topic"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Task description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <Select 
                    value={taskType} 
                    onValueChange={(value) => setTaskType(value as Task['type'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Select 
                    value={priority} 
                    onValueChange={(value) => setPriority(value as Task['priority'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Persona
                  </label>
                  <Select 
                    value={assignedPersonaId} 
                    onValueChange={setAssignedPersonaId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {personas.map(persona => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sources (one per line)
                </label>
                <Textarea
                  value={sources}
                  onChange={(e) => setSources(e.target.value)}
                  rows={3}
                  placeholder="Enter sources (URLs, references, etc.)"
                />
              </div>
            </div>
            
            {/* New Publication Plan Section - using simple collapsible instead of Accordion */}
            <div className="border rounded-md mb-6">
              <div 
                className="p-4 border-b flex justify-between items-center cursor-pointer"
                onClick={() => setPublishingPlanOpen(!publishingPlanOpen)}
              >
                <h3 className="text-lg font-medium">Publication Plan</h3>
                {publishingPlanOpen ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>
              
              {publishingPlanOpen && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="publish-website"
                      checked={publishWebsite}
                      onCheckedChange={(checked) => setPublishWebsite(checked === true)}
                    />
                    <label 
                      htmlFor="publish-website"
                      className="text-sm font-medium flex items-center"
                    >
                      <GlobeIcon className="h-4 w-4 mr-2" />
                      Publish as website article
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="publish-social"
                      checked={publishSocial}
                      onCheckedChange={(checked) => setPublishSocial(checked === true)}
                    />
                    <label 
                      htmlFor="publish-social"
                      className="text-sm font-medium flex items-center"
                    >
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share on social media
                    </label>
                  </div>
                  
                  {publishSocial && (
                    <div className="ml-7 grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-twitter"
                          checked={socialPlatforms.includes('twitter')}
                          onCheckedChange={() => handleSocialPlatformToggle('twitter')}
                        />
                        <label 
                          htmlFor="platform-twitter"
                          className="text-sm flex items-center"
                        >
                          <TwitterIcon className="h-4 w-4 mr-2" />
                          Twitter
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-facebook"
                          checked={socialPlatforms.includes('facebook')}
                          onCheckedChange={() => handleSocialPlatformToggle('facebook')}
                        />
                        <label 
                          htmlFor="platform-facebook"
                          className="text-sm flex items-center"
                        >
                          {/* If you don't have FacebookIcon, just use text */}
                          Facebook
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-linkedin"
                          checked={socialPlatforms.includes('linkedin')}
                          onCheckedChange={() => handleSocialPlatformToggle('linkedin')}
                        />
                        <label 
                          htmlFor="platform-linkedin"
                          className="text-sm flex items-center"
                        >
                          <LinkedinIcon className="h-4 w-4 mr-2" />
                          LinkedIn
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="platform-instagram"
                          checked={socialPlatforms.includes('instagram')}
                          onCheckedChange={() => handleSocialPlatformToggle('instagram')}
                        />
                        <label 
                          htmlFor="platform-instagram"
                          className="text-sm flex items-center"
                        >
                          <InstagramIcon className="h-4 w-4 mr-2" />
                          Instagram
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {(publishWebsite || publishSocial) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Publishing Schedule
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="publish-immediately"
                            name="publish-schedule"
                            checked={publishSchedule === 'immediately'}
                            onChange={() => setPublishSchedule('immediately')}
                            className="text-primary focus:ring-primary"
                          />
                          <label htmlFor="publish-immediately" className="text-sm">
                            Publish immediately after approval
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="publish-scheduled"
                            name="publish-schedule"
                            checked={publishSchedule === 'scheduled'}
                            onChange={() => setPublishSchedule('scheduled')}
                            className="text-primary focus:ring-primary"
                          />
                          <label htmlFor="publish-scheduled" className="text-sm">
                            Schedule for later
                          </label>
                        </div>
                      </div>
                      
                      {publishSchedule === 'scheduled' && (
                        <div className="mt-3">
                          <Input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}