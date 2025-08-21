"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, User, Trash2 } from 'lucide-react';
import { Persona } from '@/types';

interface EnhancedPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personaData: Partial<Persona>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  persona?: Persona | null;
}

type ReadingLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface Capabilities {
  writeArticle: boolean;
  prepareInterviewQuestions: boolean;
  replyToEmails: boolean;
  research: boolean;
}

export function EnhancedPersonaModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  persona 
}: EnhancedPersonaModalProps) {
  const isEditing = !!persona;
  
  // Core Identity Fields
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [bioShort, setBioShort] = useState('');
  const [bioLong, setBioLong] = useState('');
  const [background, setBackground] = useState('');
  
  // Mission & Scope
  const [mission, setMission] = useState('');
  const [audienceSegment, setAudienceSegment] = useState('');
  const [outputs, setOutputs] = useState<string[]>([]);
  const [publishingCadence, setPublishingCadence] = useState('');
  
  // Expertise & Style (from Vibecode)
  const [expertiseTags, setExpertiseTags] = useState<string[]>([]);
  const [tone, setTone] = useState('');
  const [readingLevelTarget, setReadingLevelTarget] = useState<ReadingLevel>('B1');
  const [styleGuide, setStyleGuide] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  // Personal Details
  const [hobbies, setHobbies] = useState<string[]>([]);
  
  // AI Capabilities
  const [capabilities, setCapabilities] = useState<Capabilities>({
    writeArticle: true,
    prepareInterviewQuestions: false,
    replyToEmails: false,
    research: true,
  });

  // Form helpers
  const [newTag, setNewTag] = useState('');
  const [newOutput, setNewOutput] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (persona) {
      setName(persona.name);
      setRoleTitle(''); // Not in Persona type
      setBioShort(persona.bio || '');
      setBioLong(''); // Not in Persona type
      setBackground(persona.background || '');
      setMission(''); // Not in Persona type
      setAudienceSegment(''); // Not in Persona type
      setOutputs([]); // Not in Persona type
      setPublishingCadence(''); // Not in Persona type
      setExpertiseTags(persona.expertise_tags || []);
      setTone(persona.tone || '');
      setReadingLevelTarget((persona.reading_level_target as ReadingLevel) || 'B1');
      setStyleGuide(persona.style_guide || '');
      setProfilePicture(persona.profile_picture || '');
      setHobbies(persona.hobbies || []);
      setCapabilities({
        writeArticle: persona.capabilities?.writeArticle ?? true,
        prepareInterviewQuestions: persona.capabilities?.prepareInterviewQuestions ?? false,
        replyToEmails: persona.capabilities?.replyToEmails ?? false,
        research: persona.capabilities?.research ?? true,
      });
    } else {
      resetForm();
    }
  }, [persona, isOpen]);

  const resetForm = () => {
    setName('');
    setRoleTitle('');
    setBioShort('');
    setBioLong('');
    setBackground('');
    setMission('');
    setAudienceSegment('');
    setOutputs([]);
    setPublishingCadence('');
    setExpertiseTags([]);
    setTone('');
    setReadingLevelTarget('B1');
    setStyleGuide('');
    setProfilePicture('');
    setHobbies([]);
    setCapabilities({
      writeArticle: true,
      prepareInterviewQuestions: false,
      replyToEmails: false,
      research: true,
    });
    setNewTag('');
    setNewOutput('');
    setNewHobby('');
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bioShort.trim()) return;
    
    setIsLoading(true);
    try {
      const formData = {
        name: name.trim(),
        bio: bioShort.trim(), // Use bio for backward compatibility
        background: background.trim(),
        expertise_tags: expertiseTags,
        tone: tone.trim(),
        reading_level_target: readingLevelTarget,
        style_guide: styleGuide.trim(),
        profile_picture: profilePicture.trim(),
        hobbies,
        capabilities: {
          writeArticle: capabilities.writeArticle,
          prepareInterviewQuestions: capabilities.prepareInterviewQuestions,
          replyToEmails: capabilities.replyToEmails,
          research: capabilities.research,
        },
      };
      
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!persona || !onDelete) return;
    if (confirm(`Are you sure you want to delete "${persona.name}"? This action cannot be undone.`)) {
      try {
        await onDelete(persona.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete persona:', error);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !expertiseTags.includes(newTag.trim())) {
      setExpertiseTags([...expertiseTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setExpertiseTags(expertiseTags.filter(tag => tag !== tagToRemove));
  };

  const addOutput = () => {
    if (newOutput.trim() && !outputs.includes(newOutput.trim())) {
      setOutputs([...outputs, newOutput.trim()]);
      setNewOutput('');
    }
  };

  const removeOutput = (outputToRemove: string) => {
    setOutputs(outputs.filter(output => output !== outputToRemove));
  };

  const addHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter(hobby => hobby !== hobbyToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            {isEditing && onDelete && (
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Persona' : 'New AI Persona'}
          </h2>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !bioShort.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profile Picture Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  {profilePicture ? (
                    profilePicture.startsWith('emoji:') ? (
                      <span className="text-4xl">{profilePicture.replace('emoji:', '')}</span>
                    ) : (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    )
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <Input
                  placeholder="Avatar text or emoji (e.g., 'SC' or 'emoji:👩‍💼')"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="max-w-md"
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      placeholder="e.g., Maria Rodriguez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Title</label>
                    <Input
                      placeholder="e.g., Senior Wine Editor, Staff Writer"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Bio * <span className="text-gray-500">(≤200 chars)</span>
                  </label>
                  <textarea
                    placeholder="Brief professional description"
                    value={bioShort}
                    onChange={(e) => setBioShort(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    maxLength={200}
                    required
                  />
                  <div className="text-sm text-gray-500 mt-1">{bioShort.length}/200</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Bio <span className="text-gray-500">(2-4 sentences with credibility)</span>
                  </label>
                  <textarea
                    placeholder="Detailed background with credibility claims"
                    value={bioLong}
                    onChange={(e) => setBioLong(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <textarea
                    placeholder="Professional background and education"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mission & Scope */}
            <Card>
              <CardHeader>
                <CardTitle>Mission & Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission <span className="text-gray-500">(1-2 lines: what success looks like)</span>
                  </label>
                  <textarea
                    placeholder="Define what success looks like for this persona"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience Segment</label>
                    <Input
                      placeholder="e.g., operators, brand managers, distributors"
                      value={audienceSegment}
                      onChange={(e) => setAudienceSegment(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publishing Cadence</label>
                    <Input
                      placeholder="e.g., 3 posts/week; Thu newsletter"
                      value={publishingCadence}
                      onChange={(e) => setPublishingCadence(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Outputs</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="e.g., news story, analysis, interview"
                      value={newOutput}
                      onChange={(e) => setNewOutput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutput())}
                    />
                    <Button type="button" onClick={addOutput} size="sm" variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outputs.map((output, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center"
                      >
                        {output}
                        <button
                          type="button"
                          onClick={() => removeOutput(output)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expertise & Style */}
            <Card>
              <CardHeader>
                <CardTitle>Expertise & Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="e.g., RTDs, Travel Retail, HoReCa Ops"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm" variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expertiseTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Writing Tone</label>
                  <Input
                    placeholder="e.g., professional yet approachable"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reading Level Target</label>
                  <div className="flex flex-wrap gap-2">
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as ReadingLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setReadingLevelTarget(level)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          readingLevelTarget === level 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style Guide</label>
                  <textarea
                    placeholder="Specific writing guidelines and preferences"
                    value={styleGuide}
                    onChange={(e) => setStyleGuide(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="e.g., cooking, travel, wine tasting"
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
                    />
                    <Button type="button" onClick={addHobby} size="sm" variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full flex items-center"
                      >
                        {hobby}
                        <button
                          type="button"
                          onClick={() => removeHobby(hobby)}
                          className="ml-2 text-purple-500 hover:text-purple-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle>AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(capabilities).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <label className="text-sm font-medium text-gray-700">
                      {key === 'writeArticle' ? 'Write Articles' :
                       key === 'prepareInterviewQuestions' ? 'Prepare Interview Questions' :
                       key === 'replyToEmails' ? 'Reply to Emails' : 'Research'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setCapabilities(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

          </form>
        </div>
      </div>
    </div>
  );
}