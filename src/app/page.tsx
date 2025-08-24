"use client";

import { useState } from 'react';
import Link from 'next/link'; 
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  PlusIcon, UsersIcon, DocumentTextIcon, ShareIcon, 
  ArrowRightOnRectangleIcon, NewspaperIcon // Add NewspaperIcon
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentDraft, setCurrentDraft] = useState<any>(null);
  
  const { user, logout, isLoading: authLoading } = useAuth();
  const { personas, createPersona, updatePersona, deletePersona, isLoading: personasLoading, refetch: refetchPersonas } = usePersonas();
  const { tasks, createTask, updateTask, deleteTask, generateDraft, isLoading: tasksLoading } = useTasks();
  const { drafts } = useDrafts();
  const { posts: socialPosts, createPost, generateFromDraft, isLoading: socialLoading } = useSocialPosts();

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
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

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
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask(taskData);
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

  const tasksByStatus = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'needs-review': tasks.filter(t => t.status === 'needs-review').length,
    approved: tasks.filter(t => t.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Sip & Savvy</h1>
              <span className="ml-2 text-sm text-gray-500">Virtual Newsroom</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.name} ({user.organization?.name})
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
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
              { id: 'personas', name: 'Personas' },
              { id: 'tasks', name: 'Tasks' },
              { id: 'drafts', name: 'Drafts' },
              { id: 'social', name: 'Social' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
            
            {/* Add Publishing as a Link component */}
            <Link href="/publishing">
              <a className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Publishing
              </a>
            </Link>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personas.map((persona) => (
                  <Card key={persona.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                            {persona.profile_picture && persona.profile_picture.startsWith('http') ? (
                              <img 
                                src={persona.profile_picture} 
                                alt={persona.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-medium">
                                {persona.profile_picture || persona.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base">{persona.name}</CardTitle>
                            <p className="text-sm text-gray-500">{persona.tone}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditPersona(persona)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePersona(persona)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{persona.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {persona.expertise_tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {persona.expertise_tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{persona.expertise_tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  // Refresh personas data
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
      />
    </div>
  );
}