
export type ReadingLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  settings: Record<string, any>;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: 'editor-in-chief' | 'section-editor' | 'social-manager' | 'contributor';
  profile_picture?: string;
  last_login?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface Persona {
  id: string;
  organization_id: string;
  
  // Basic Identity (enhanced)
  name: string;
  role_title?: string; // NEW
  bio?: string; // Keep existing
  bio_short?: string; // NEW
  bio_long?: string; // NEW
  background?: string; // Keep existing
  profile_picture?: string; // Keep existing
  
  // Mission & Scope (NEW section)
  mission?: string; // NEW
  audience_segment?: string; // NEW
  outputs?: string[]; // NEW
  publishing_cadence?: string; // NEW
  
  // Expertise & Style (enhanced)
  expertise_tags: string[]; // Keep existing
  tone?: string; // Keep existing
  reading_level_target: ReadingLevel; // Enhanced typing
  style_guide?: string; // Keep existing
  
  // Personal Details
  hobbies: string[]; // Keep existing
  
  // AI Capabilities
  capabilities: Record<string, boolean>; // Keep existing
  
  // Existing fields (unchanged)
  display_order: number;
  knowledge_sources: any[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  organization_id: string;
  assigned_persona_id?: string;
  assigned_by: string;
  title: string;
  topic?: string;
  description?: string;
  sources: string[];
  type: 'feature' | 'news' | 'blog' | 'interview';
  status: 'backlog' | 'in-progress' | 'needs-review' | 'approved';
  section?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  ai_provider?: 'openai' | 'anthropic' | 'grok';
  created_at: string;
  updated_at: string;
  persona?: Persona;
  assigned_by_user?: User;
}

export interface Draft {
  id: string;
  organization_id: string;
  task_id: string;
  title: string;
  summary?: string;
  body?: string;
  images: any[];
  tags: string[];
  section?: string;
  readability_score: Record<string, any>;
  citations: any[];
  comments: any[];
  metadata: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
  task?: Task;
}