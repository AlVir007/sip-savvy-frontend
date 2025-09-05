import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}

interface AgentFormData {
  name: string;
  type: string;
  description: string;
  configuration: any;
  capabilities: string[];
}

const AGENT_TYPES = [
  { value: 'story_discovery', label: 'Story Discovery', description: 'Monitor RSS feeds and discover relevant stories' },
  { value: 'persona_content', label: 'Persona Content', description: 'Autonomous content generation by AI personas' },
  { value: 'editorial_planning', label: 'Editorial Planning', description: 'Task assignment and editorial strategy coordination' },
  { value: 'research', label: 'Research', description: 'In-depth research and fact verification' },
  { value: 'fact_check', label: 'Fact Check', description: 'Verify claims and check factual accuracy' },
  { value: 'seo_optimization', label: 'SEO Optimization', description: 'Optimize content for search engines' },
  { value: 'distribution', label: 'Distribution', description: 'Multi-platform content distribution' },
  { value: 'source_monitoring', label: 'Source Monitoring', description: 'Monitors source health and accessibility' },
];

const PRESET_CONFIGURATIONS = {
  story_discovery: {
    sources: [
      {
        type: 'rss',
        url: 'https://www.foodandwine.com/rss',
        keywords: ['drinks', 'cocktails', 'bar', 'restaurant']
      }
    ],
    minimum_relevance_score: 0.4,
    max_tasks_per_execution: 3,
    target_keywords: ['drinks', 'cocktails', 'bar', 'restaurant', 'hospitality', 'beverage']
  },
  persona_content: {
    persona_id: '',
    max_content_per_execution: 2,
    autonomous_mode: true,
    content_types: ['articles', 'reviews', 'industry_analysis']
  },
  editorial_planning: {
    responsibilities: ['task_assignment', 'content_planning', 'deadline_management'],
    assignment_rules: {
      workload_distribution: 'balanced',
      priority_handling: 'urgent_first'
    },
    max_assignments_per_execution: 5
  },
  research: {
    research_depth: 'comprehensive',
    source_verification: true,
    fact_checking: true,
    citation_required: true
  },
  fact_check: {
    verification_standards: 'high',
    source_requirements: 2,
    cross_reference: true
  },
  seo_optimization: {
    keyword_density_target: 2.5,
    meta_optimization: true,
    readability_score_target: 70
  },
  distribution: {
    platforms: ['website', 'social_media'],
    scheduling: 'optimal_times',
    analytics_tracking: true
  },
  source_monitoring: {
    check_interval: 120,
    failure_threshold: 5,
    retry_delays: [60, 300, 1800, 7200],
    alert_on_quarantine: true,
    health_report_frequency: 'daily'
  }
};

const PRESET_CAPABILITIES = {
  story_discovery: ['rss_monitoring', 'story_scoring', 'task_creation', 'trend_analysis'],
  persona_content: ['autonomous_content_generation', 'context_awareness', 'editorial_coordination'],
  editorial_planning: ['task_assignment', 'workflow_optimization', 'deadline_management'],
  research: ['web_research', 'source_verification', 'data_analysis'],
  fact_check: ['claim_verification', 'source_validation', 'accuracy_scoring'],
  seo_optimization: ['keyword_analysis', 'meta_optimization', 'performance_tracking'],
  distribution: ['multi_platform_posting', 'scheduling', 'analytics_integration'],
  source_monitoring: ['source_verification', 'health_monitoring', 'failure_analysis', 'retry_scheduling', 'alert_generation']
};

// Preset agent configurations for quick creation
const AGENT_PRESETS = [
  {
    name: 'Drinks Industry Discovery',
    type: 'story_discovery',
    description: 'Monitors major food & drink publications for trending stories',
    configuration: {
      sources: [
        { type: 'rss', url: 'https://www.foodandwine.com/rss', keywords: ['drinks', 'cocktails', 'bar'] },
        { type: 'rss', url: 'https://punchdrink.com/rss', keywords: ['cocktails', 'spirits', 'bar'] }
      ],
      minimum_relevance_score: 0.6,
      max_tasks_per_execution: 5
    }
  },
  {
    name: 'Editorial Chief AI',
    type: 'editorial_planning',
    description: 'Coordinates editorial workflow and assigns tasks to personas',
    configuration: {
      responsibilities: ['task_assignment', 'content_planning', 'quality_control'],
      assignment_rules: { workload_distribution: 'expertise_based' },
      max_assignments_per_execution: 10
    }
  },
  {
    name: 'Parker Content Generator',
    type: 'persona_content',
    description: 'Autonomous content creation for spirits expertise',
    configuration: {
      persona_id: 'parker-chateau-chic',
      autonomous_mode: true,
      content_types: ['reviews', 'industry_analysis', 'trend_pieces']
    }
  },
  {
    name: 'Source Health Monitor',
    type: 'source_monitoring',
    description: 'Monitors source accessibility and performance',
    configuration: {
      check_interval: 120,
      failure_threshold: 5,
      retry_delays: [60, 300, 1800, 7200],
      alert_on_quarantine: true,
      health_report_frequency: 'daily'
    }
  }
];

export const AgentCreationModal: React.FC<AgentCreationModalProps> = ({
  isOpen,
  onClose,
  onAgentCreated
}) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    type: '',
    description: '',
    configuration: {},
    capabilities: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configurationText, setConfigurationText] = useState('{}');
  const [showPresets, setShowPresets] = useState(true);

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
    const presetConfig = PRESET_CONFIGURATIONS[type] || {};
    const presetCapabilities = PRESET_CAPABILITIES[type] || [];
    setConfigurationText(JSON.stringify(presetConfig, null, 2));
    setFormData(prev => ({ 
      ...prev, 
      configuration: presetConfig,
      capabilities: presetCapabilities
    }));
  };

  const handlePresetSelect = (preset: any) => {
    setFormData({
      name: preset.name,
      type: preset.type,
      description: preset.description,
      configuration: preset.configuration,
      capabilities: PRESET_CAPABILITIES[preset.type] || []
    });
    setConfigurationText(JSON.stringify(preset.configuration, null, 2));
    setShowPresets(false);
  };

  const handleConfigurationChange = (value: string) => {
    setConfigurationText(value);
    try {
      const parsedConfig = JSON.parse(value);
      setFormData(prev => ({ ...prev, configuration: parsedConfig }));
    } catch (error) {
      // Invalid JSON, keep the text but don't update the configuration
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error('Name and type are required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate JSON configuration
      let configuration;
      try {
        configuration = JSON.parse(configurationText);
      } catch (error) {
        toast.error('Invalid JSON configuration');
        return;
      }

      const agentData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        configuration,
        capabilities: formData.capabilities,
        status: 'active'
      };

      const response = await api.post('/agents', agentData);
      
      if (response.data.agent) {
        toast.success('Agent created successfully!');
        onAgentCreated();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating agent:', error);
      const message = error.response?.data?.message || 'Failed to create agent';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      configuration: {},
      capabilities: []
    });
    setConfigurationText('{}');
    setShowPresets(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
        </DialogHeader>

        {showPresets && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quick Start Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENT_PRESETS.map((preset, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <h4 className="font-medium text-blue-600">{preset.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                  <Badge variant="secondary" className="mt-2">{preset.type}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowPresets(false)}
              >
                Create Custom Agent
              </Button>
            </div>
          </div>
        )}

        {!showPresets && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter agent name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Agent Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select agent type</option>
                  {AGENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {formData.type && (
                  <p className="text-sm text-gray-600 mt-1">
                    {AGENT_TYPES.find(t => t.value === formData.type)?.description}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this agent does"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="capabilities">Capabilities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.capabilities.map((capability, index) => (
                  <Badge key={index} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="configuration">Configuration (JSON)</Label>
              <Textarea
                id="configuration"
                value={configurationText}
                onChange={(e) => handleConfigurationChange(e.target.value)}
                placeholder="Enter JSON configuration"
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPresets(true)}
              >
                Back to Presets
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Agent'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};