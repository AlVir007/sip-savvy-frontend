"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Persona } from '@/types';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personaData: Partial<Persona>) => Promise<void>;
  persona?: Persona | null;
}

export function PersonaModal({ isOpen, onClose, onSave, persona }: PersonaModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    background: '',
    expertise_tags: [] as string[],
    tone: '',
    profile_picture: '',
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (persona) {
      setFormData({
        name: persona.name,
        bio: persona.bio || '',
        background: persona.background || '',
        expertise_tags: persona.expertise_tags,
        tone: persona.tone || '',
        profile_picture: persona.profile_picture || '',
      });
    } else {
      setFormData({
        name: '',
        bio: '',
        background: '',
        expertise_tags: [],
        tone: '',
        profile_picture: '',
      });
    }
  }, [persona]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.expertise_tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        expertise_tags: [...formData.expertise_tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      expertise_tags: formData.expertise_tags.filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{persona ? 'Edit Persona' : 'Create New Persona'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                placeholder="Avatar (e.g., SC)"
                value={formData.profile_picture}
                onChange={(e) => setFormData({ ...formData, profile_picture: e.target.value })}
              />
            </div>
            
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
            />
            
            <textarea
              placeholder="Background"
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
            />
            
            <Input
              placeholder="Tone (e.g., professional, casual)"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Expertise Tags</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add expertise tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.expertise_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Save Persona'}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}