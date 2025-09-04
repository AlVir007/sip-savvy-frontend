"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AgentsTab from '@/components/AgentsTab';
import Logo from '@/components/ui/Logo';
import { DraggableCard } from '@/components/DraggableCard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop.tsx';
import { PersonasDraggableGrid } from '@/components/PersonasDraggableGrid';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  PlusIcon, UsersIcon, DocumentTextIcon, ShareIcon, 
  ArrowRightStartOnRectangleIcon, NewspaperIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonas } from '@/hooks/usePersonas';
import { useTasks } from '@/hooks/useTasks';
import { useDrafts } from '@/hooks/useDrafts';
import { AuthModal } from '@/components/AuthModal';
import { EnhancedPersonaModal } from '@/components/PersonaModal';
import { TaskModal } from '@/components/TaskModal';
import { KanbanBoard } from '@/components/KanbanBoard';
import { DraftModal } from '@/components/DraftModal';
import { Persona, Task } from '@/types';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import SocialChannelsSection from '@/components/SocialChannelsSection';
import { PublishingModal } from '@/components/publishing/PublishingModal';
// Import the utility function (you'll need to create this file)
import { moveDraftToPublishing, getDraftByTaskId } from '@/lib/moveToPublishing';

export default function Dashboard() {
  // 1. ALL hooks must be called first, before any conditional logic
  const { user, logout, isLoading: authLoading } = useAuth();
  const { personas, createPersona, updatePersona, deletePersona, isLoading: personasLoading, refetch: refetchPersonas } = usePersonas();
  const { tasks, createTask, updateTask, deleteTask, generateDraft, isLoading: tasksLoading, refetch: refetchTasks } = useTasks();
  const { drafts, updateDraft, refetch: refetchDrafts } = useDrafts();
  const { posts: socialPosts, createPost, generateFromDraft, isLoading: socialLoading } = useSocialPosts();

  // 2. State hooks
  const [activeTab, setActiveTab] = useState('overview');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentDraft, setCurrentDraft] = useState<any>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedTaskForPublishing, setSelectedTaskForPublishing] = useState<Task | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);

  // 3. Interface definitions
  interface SocialConnectionData {
    platform: 'x' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'telegram' | 'whatsapp';
    handle: string;
    isActive: boolean;
    postingStyle: string;
    hashtagStrategy: string[];
    postingFrequency: 'high' | 'medium' | 'low';
    audienceTarget: string;
  }
  
  interface SocialConnectionUpdates {
    platform?: 'x' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'telegram' | 'whatsapp';
    handle?: string;
    isActive?: boolean;
    postingStyle?: string;
    hashtagStrategy?: string[];
    postingFrequency?: 'high' | 'medium' | 'low';
    audienceTarget?: string;
  }

  // 4. ALL handler functions must be defined at component level
  const handleCreatePersona = () => {
    setEditingPersona(null);
    setShowPersonaModal(true);
  };

  const handleEditPersona = (persona: Persona) => {
    setEditingPersona(persona);
    setShowPersonaModal(true);
  };

  const handleSavePersona = async (personaData: Partial<Persona>) => {
    if (editingPersona) {
      await updatePersona(editingPersona.id, personaData);
    } else {
      await createPersona(personaData);
    }
  };

  const handleDeletePersona = async (persona: Persona) => {
    if (confirm(`Are you sure you want to delete ${persona.name}?`)) {
      await deletePersona(persona.id);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (isSavingTask) return; // Prevent multiple submissions
    
    try {
      setIsSavingTask(true);
      
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await createTask(taskData);
        toast.success('Task created successfully!');
      }
      
      // Close the modal and reset state
      setShowTaskModal(false);
      setEditingTask(undefined);
      
      // Refresh tasks to show updated data
      await refetchTasks();
      
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error('Failed to save task. Please try again.');
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleGenerateDraft = async (task: Task) => {
    try {
      const result = await generateDraft(task.id);
      setCurrentDraft(result.draft);
      setShowDraftModal(true);
      // Update task status to in-progress
      await updateTask(task.id, { status: 'in-progress' });
    } catch (error) {
      console.error('Failed to generate draft:', error);
      alert('Failed to generate draft. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleApproveDraft = async (draftId: string) => {
    try {
      const draft = drafts.find(d => d.id === draftId);
      
      if (!draft) {
        toast.error('Draft not found');
        return;
      }
      
      toast.success('Draft approved successfully');
      
      await moveDraftToPublishing(draft, 'draft');
      toast.success('Draft moved to Publishing section');
      
      if (draft.task_id) {
        await updateTask(draft.task_id, { status: 'approved' });
      }
      
      await refetchDrafts();
      await refetchTasks();
      
    } catch (error) {
      console.error('Failed to approve draft:', error);
      toast.error('Failed to approve draft');
    }
  };

  const handleRejectDraft = async (draftId: string) => {
    try {
      toast.success('Draft rejected');
      
      const draft = drafts.find(d => d.id === draftId);
      if (draft?.task_id) {
        await updateTask(draft.task_id, { status: 'in-progress' });
      }
      
      await refetchDrafts();
      await refetchTasks();
    } catch (error) {
      console.error('Failed to reject draft:', error);
      toast.error('Failed to reject draft');
    }
  };

  const handlePublishTask = async (task: Task) => {
    try {
      const draft = await getDraftByTaskId(task.id);
      
      if (!draft) {
        toast.error('No draft found for this task');
        return;
      }
      
      setSelectedTaskForPublishing(task);
      setCurrentDraft(draft);
      setPublishModalOpen(true);
      
    } catch (error) {
      console.error('Failed to prepare for publishing:', error);
      toast.error('Failed to prepare for publishing');
      
      setSelectedTaskForPublishing(task);
      setPublishModalOpen(true);
    }
  };

  const handlePublishContent = async (publishData: any) => {
    try {
      const loadingToast = toast.loading('Publishing content...');
      
      let draft;
      try {
        draft = await getDraftByTaskId(publishData.taskId);
      } catch (error) {
        console.error('Error fetching draft:', error);
      }
      
      if (draft) {
        await moveDraftToPublishing(draft, 'published');
      } else {
        const articleData = {
          title: publishData.taskId ? tasks.find(t => t.id === publishData.taskId)?.title : '',
          content: publishData.taskId ? tasks.find(t => t.id === publishData.taskId)?.description || '' : '',
          excerpt: publishData.taskId ? tasks.find(t => t.id === publishData.taskId)?.description : '',
          persona_id: publishData.taskId ? tasks.find(t => t.id === publishData.taskId)?.assigned_persona_id : '',
          status: 'published',
          publishWebsite: publishData.publishWebsite,
          publishSocial: publishData.publishSocial,
          socialPlatforms: publishData.socialPlatforms,
          scheduledTime: publishData.scheduleType === 'scheduled' ? publishData.scheduledTime : null,
          socialContent: publishData.socialContent,
        };
        
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to publish content');
        }
      }
      
      if (publishData.publishSocial && publishData.socialPlatforms.length > 0) {
        for (const platform of publishData.socialPlatforms) {
          await createPost({
            platform,
            content: publishData.socialContent,
            draft_id: draft?.id || publishData.taskId,
            persona_id: tasks.find(t => t.id === publishData.taskId)?.assigned_persona_id || '',
            hashtags: [],
            status: publishData.scheduleType === 'scheduled' ? 'scheduled' : 'draft',
            target_time: publishData.scheduleType === 'scheduled' ? publishData.scheduledTime : undefined,
          });
        }
      }
      
      await updateTask(publishData.taskId, { 
        status: 'approved',
        publishedAt: publishData.scheduleType === 'now' ? new Date().toISOString() : undefined,
        publishedTo: [
          ...(publishData.publishWebsite ? ['website'] : []),
          ...(publishData.publishSocial ? publishData.socialPlatforms : [])
        ]
      });
      
      toast.dismiss(loadingToast);
      toast.success('Content published successfully!', {
        duration: 3000,
      });
      
      await refetchTasks();
      await refetchDrafts();
      
    } catch (error) {
      console.error('Failed to publish content:', error);
      toast.error('Failed to publish. Please try again.', {
        duration: 3000,
      });
    }
  };

  // 5. Calculate derived values
  const tasksByStatus = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'needs-review': tasks.filter(t => t.status === 'needs-review').length,
    approved: tasks.filter(t => t.status === 'approved').length,
  };

  // 6. Render function
  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Logo size="lg" showText={false} />
              </div>
              <CardTitle className="text-2xl">Sip & Savvy</CardTitle>
              <p className="text-gray-600">Virtual Newsroom</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">AI-powered newsroom for the drinks & HoReCa industry</p>
              <Button onClick={() => setShowAuthModal(true)} size="lg" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Main dashboard content when user is authenticated
    return (
      <>
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Logo size="sm" showText={true} />
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.name} ({user.organization?.name})
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'agents', name: 'Agents' },
                { id: 'personas', name: 'Personas' },
                { id: 'tasks', name: 'Tasks' },
                { id: 'drafts', name: 'Drafts' },
                { id: 'social', name: 'Social' },
                { id: 'publishing', name: 'Publishing' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'publishing') {
                      window.location.href = '/publishing';
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Personas</CardTitle>
                  <UsersIcon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personas.length}</div>
                  <p className="text-xs text-gray-500">AI journalists ready to work</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks in Progress</CardTitle>
                  <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasksByStatus['in-progress']}</div>
                  <p className="text-xs text-gray-500">Articles being written</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasksByStatus['needs-review']}</div>
                  <p className="text-xs text-gray-500">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                  <ShareIcon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasksByStatus.approved}</div>
                  <p className="text-xs text-gray-500">Completed articles</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'agents' && (
            <AgentsTab user={user} />
          )}

          {activeTab === 'personas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">AI Journalist Personas</h2>
                <Button variant="default" onClick={handleCreatePersona}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Persona
                </Button>
              </div>
              
              {personasLoading ? (
                <div className="text-center py-8">Loading personas...</div>
              ) : personas.length === 0 ? (
                <div className="text-center py-12">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No personas yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first AI journalist persona.</p>
                  <div className="mt-6">
                    <Button variant="default" onClick={handleCreatePersona}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Persona
                    </Button>
                  </div>
                </div>
              ) : (
                <PersonasDraggableGrid 
                  personas={personas}
                  onEditPersona={handleEditPersona}
                  onDeletePersona={handleDeletePersona}
                  onReorder={(newOrder) => {
                    console.log('New persona order:', newOrder.map(p => p.name));
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Editorial Tasks</h2>
                <Button variant="default" onClick={handleCreateTask}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>
              
              {tasksLoading ? (
                <div className="text-center py-8">Loading tasks...</div>
              ) : (
                <KanbanBoard
                  tasks={tasks.filter(t => t.status === 'backlog')}
                  onTaskClick={handleEditTask}
                  onGenerateDraft={handleGenerateDraft}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onPublishTask={handlePublishTask}
                  showBacklog={true}
                />
              )}
            </div>
          )}

          {activeTab === 'drafts' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Draft Articles</h2>
              {tasks.filter(t => t.status !== 'backlog').length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Generate drafts from tasks to see them here.</p>
                </div>
              ) : (
                <KanbanBoard
                  tasks={tasks.filter(t => t.status !== 'backlog')}
                  onTaskClick={handleEditTask}
                  onGenerateDraft={handleGenerateDraft}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onPublishTask={handlePublishTask}
                  showBacklog={false}
                />
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <SocialChannelsSection
              personas={personas}
              onAddConnection={async (personaId, connectionData) => {
                try {
                  const response = await fetch(`/api/personas/${personaId}/social-connections`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(connectionData),
                  });
                  if (response.ok) {
                    refetchPersonas();
                  }
                } catch (error) {
                  console.error('Failed to add connection:', error);
                }
              }}
              onUpdateConnection={async (personaId, connectionId, updates) => {
                try {
                  const response = await fetch(`/api/personas/${personaId}/social-connections/${connectionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                  });
                  if (response.ok) {
                    refetchPersonas();
                  }
                } catch (error) {
                  console.error('Failed to update connection:', error);
                }
              }}
              onRemoveConnection={async (personaId, connectionId) => {
                try {
                  const response = await fetch(`/api/personas/${personaId}/social-connections/${connectionId}`, {
                    method: 'DELETE',
                  });
                  if (response.ok) {
                    refetchPersonas();
                  }
                } catch (error) {
                  console.error('Failed to remove connection:', error);
                }
              }}
            />
          )}
        </main>

        {/* Modals */}
        <EnhancedPersonaModal
          isOpen={showPersonaModal}
          onClose={() => setShowPersonaModal(false)}
          onSave={handleSavePersona}
          persona={editingPersona}
        />

        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
          personas={personas}
          task={editingTask}
        />

        <DraftModal
          isOpen={showDraftModal}
          onClose={() => setShowDraftModal(false)}
          draft={currentDraft}
          onApprove={handleApproveDraft}
          onReject={handleRejectDraft}
        />
        
        <PublishingModal
          isOpen={publishModalOpen}
          onClose={() => setPublishModalOpen(false)}
          task={selectedTaskForPublishing}
          onPublish={handlePublishContent}
        />
      </>
    );
  };

  // 7. Always return the same structure, let renderContent handle the logic
  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}