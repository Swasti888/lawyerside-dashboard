export interface LawyerProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  firmName: string;
  firmLogo?: string;
  headshot?: string;
  lastUpdated: string;
  versionStamp: number;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  avatar?: string;
  email: string;
  activityCount: number;
  status: 'active' | 'inactive';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  source: 'firm' | 'ai';
  category: string;
  version: number;
  versions: TemplateVersion[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  sharedWith: string[];
}

export interface TemplateVersion {
  version: number;
  createdAt: string;
  changes: string;
  content: string;
}

export interface Document {
  id: string;
  templateId: string;
  templateName: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'in_negotiation' | 'executed' | 'cancelled';
  currentVersion: number;
  versions: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
  negotiationActivity: ActivityPost[];
}

export interface DocumentVersion {
  version: number;
  type: 'template' | 'initial_draft' | 'negotiation_turn' | 'final';
  content: string;
  changes: string[];
  createdAt: string;
  author: string;
}

export interface ActivityPost {
  id: string;
  type: 'initial_draft' | 'first_turn' | 'legal_query' | 'executed_document' | 'template_used' | 'draft_sent' | 'turn_received';
  title: string;
  description: string;
  content?: string;
  clientId: string;
  clientName: string;
  clientLogo?: string;
  documentId?: string;
  templateId?: string;
  queryId?: string;
  flags?: string[];
  opportunities?: string[];
  createdAt: string;
  hasThread?: boolean;
  threadPosts?: ActivityPost[];
}

export interface LegalQuery {
  id: string;
  clientId: string;
  clientName: string;
  prompt: string;
  summary: string;
  fullAnswer: string;
  model: string;
  topic: string;
  tags: string[];
  attachments: string[];
  sections: {
    summary: string;
    issues: string[];
    clausesToWatch: string[];
    notes: string;
  };
  createdAt: string;
  status: 'pending' | 'completed' | 'archived';
}

export interface ClientAlert {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  audience: string[];
  heroImage?: string;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  engagement: number;
}

export interface Insight {
  topTemplates: Array<{ name: string; count: number; templateId: string }>;
  topQueryTopics: Array<{ topic: string; count: number }>;
  activeClients: Array<{ name: string; count: number; clientId: string }>;
}
