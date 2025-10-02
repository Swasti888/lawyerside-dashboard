import { 
  LawyerProfile, 
  Client, 
  Template, 
  Document, 
  ActivityPost, 
  LegalQuery, 
  ClientAlert, 
  Insight,
  TemplateVersion,
  DocumentVersion
} from './types';

// Shared state for cross-dashboard communication
export const sharedState = {
  lawyerProfile: null as LawyerProfile | null,
  clientAlerts: [] as ClientAlert[],
  completedDocuments: [] as Document[],
};

export const mockLawyerProfile: LawyerProfile = {
  id: 'lawyer-1',
  name: 'Sarah Chen',
  title: 'Senior Partner',
  email: 'sarah.chen@calexlaw.com',
  phone: '+1 (555) 123-4567',
  firmName: 'Calex Legal Partners',
  firmLogo: '/firm-logo.png',
  headshot: '/sarah-headshot.jpg',
  lastUpdated: '2024-10-02T10:00:00Z',
  versionStamp: 1,
};

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'XYZ Corp',
    logo: '/xyz-logo.png',
    email: 'legal@xyzcorp.com',
    activityCount: 15,
    status: 'active',
  },
  {
    id: 'client-2',
    name: 'ABC Fund',
    logo: '/abc-logo.png',
    email: 'partners@abcfund.com',
    activityCount: 8,
    status: 'active',
  },
  {
    id: 'client-3',
    name: 'TechStart Inc',
    logo: '/techstart-logo.png',
    email: 'founders@techstart.com',
    activityCount: 12,
    status: 'active',
  },
  {
    id: 'client-4',
    name: 'Global Ventures',
    logo: '/global-logo.png',
    email: 'legal@globalventures.com',
    activityCount: 6,
    status: 'active',
  },
  {
    id: 'client-5',
    name: 'Innovation Labs',
    logo: '/innovation-logo.png',
    email: 'contracts@innovationlabs.com',
    activityCount: 9,
    status: 'active',
  },
];

const mockTemplateVersions: TemplateVersion[] = [
  {
    version: 1,
    createdAt: '2024-09-01T10:00:00Z',
    changes: 'Initial template creation',
    content: 'Template content v1...',
  },
  {
    version: 2,
    createdAt: '2024-09-15T14:30:00Z',
    changes: 'Updated indemnity clauses, added data protection terms',
    content: 'Template content v2...',
  },
];

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Mutual NDA',
    description: 'Standard mutual non-disclosure agreement for business discussions',
    source: 'firm',
    category: 'Confidentiality',
    version: 2,
    versions: mockTemplateVersions,
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-15T14:30:00Z',
    usageCount: 24,
    sharedWith: ['client-1', 'client-2', 'client-3'],
  },
  {
    id: 'template-2',
    name: '1-Way NDA',
    description: 'One-way non-disclosure agreement for sensitive information sharing',
    source: 'firm',
    category: 'Confidentiality',
    version: 1,
    versions: [mockTemplateVersions[0]],
    createdAt: '2024-09-05T11:00:00Z',
    updatedAt: '2024-09-05T11:00:00Z',
    usageCount: 18,
    sharedWith: ['client-1', 'client-4'],
  },
  {
    id: 'template-3',
    name: 'SAFE',
    description: 'Simple Agreement for Future Equity',
    source: 'firm',
    category: 'Investment',
    version: 3,
    versions: mockTemplateVersions,
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2024-09-20T16:00:00Z',
    usageCount: 12,
    sharedWith: ['client-2', 'client-3'],
  },
  {
    id: 'template-4',
    name: 'Convertible Note',
    description: 'Convertible note agreement for startup funding',
    source: 'ai',
    category: 'Investment',
    version: 1,
    versions: [mockTemplateVersions[0]],
    createdAt: '2024-09-10T13:00:00Z',
    updatedAt: '2024-09-10T13:00:00Z',
    usageCount: 6,
    sharedWith: [],
  },
  {
    id: 'template-5',
    name: 'Master Services Agreement',
    description: 'Comprehensive services agreement template',
    source: 'firm',
    category: 'Services',
    version: 2,
    versions: mockTemplateVersions,
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-09-10T15:00:00Z',
    usageCount: 15,
    sharedWith: ['client-1', 'client-3', 'client-5'],
  },
  {
    id: 'template-6',
    name: 'Independent Contractor Agreement',
    description: 'Agreement for independent contractor relationships',
    source: 'firm',
    category: 'Employment',
    version: 1,
    versions: [mockTemplateVersions[0]],
    createdAt: '2024-09-01T12:00:00Z',
    updatedAt: '2024-09-01T12:00:00Z',
    usageCount: 9,
    sharedWith: ['client-4', 'client-5'],
  },
  {
    id: 'template-7',
    name: 'Employment Agreement',
    description: 'Standard employment agreement template',
    source: 'ai',
    category: 'Employment',
    version: 1,
    versions: [mockTemplateVersions[0]],
    createdAt: '2024-09-12T14:00:00Z',
    updatedAt: '2024-09-12T14:00:00Z',
    usageCount: 4,
    sharedWith: [],
  },
  {
    id: 'template-8',
    name: 'Option Agreement',
    description: 'Stock option agreement for employees',
    source: 'firm',
    category: 'Equity',
    version: 1,
    versions: [mockTemplateVersions[0]],
    createdAt: '2024-08-25T11:00:00Z',
    updatedAt: '2024-08-25T11:00:00Z',
    usageCount: 7,
    sharedWith: ['client-3'],
  },
  {
    id: 'template-9',
    name: 'Referral Agreement',
    description: 'Business referral partnership agreement',
    source: 'ai',
    category: 'Partnership',
    version: 1,
    versions: [mockTemplateVersions[0]],
    createdAt: '2024-09-18T10:00:00Z',
    updatedAt: '2024-09-18T10:00:00Z',
    usageCount: 3,
    sharedWith: [],
  },
];

const mockDocumentVersions: DocumentVersion[] = [
  {
    version: 1,
    type: 'template',
    content: 'Original template content...',
    changes: [],
    createdAt: '2024-09-20T10:00:00Z',
    author: 'Template',
  },
  {
    version: 2,
    type: 'initial_draft',
    content: 'Initial draft with client-specific terms...',
    changes: ['Added client name and address', 'Customized payment terms'],
    createdAt: '2024-09-20T11:00:00Z',
    author: 'Sarah Chen',
  },
  {
    version: 3,
    type: 'negotiation_turn',
    content: 'First turn with counterparty changes...',
    changes: ['60% change to Indemnity clause', 'Modified liability caps', 'Added termination clause'],
    createdAt: '2024-09-21T14:30:00Z',
    author: 'Counterparty Legal',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    templateId: 'template-5',
    templateName: 'Master Services Agreement',
    clientId: 'client-1',
    clientName: 'XYZ Corp',
    status: 'in_negotiation',
    currentVersion: 3,
    versions: mockDocumentVersions,
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-21T14:30:00Z',
    negotiationActivity: [],
  },
  {
    id: 'doc-2',
    templateId: 'template-3',
    templateName: 'SAFE',
    clientId: 'client-2',
    clientName: 'ABC Fund',
    status: 'executed',
    currentVersion: 4,
    versions: [...mockDocumentVersions, {
      version: 4,
      type: 'final',
      content: 'Final executed version...',
      changes: ['Final review changes', 'Signatures added'],
      createdAt: '2024-09-25T16:00:00Z',
      author: 'Sarah Chen',
    }],
    createdAt: '2024-09-18T09:00:00Z',
    updatedAt: '2024-09-25T16:00:00Z',
    negotiationActivity: [],
  },
  {
    id: 'doc-3',
    templateId: 'template-1',
    templateName: 'Mutual NDA',
    clientId: 'client-3',
    clientName: 'TechStart Inc',
    status: 'draft',
    currentVersion: 2,
    versions: mockDocumentVersions.slice(0, 2),
    createdAt: '2024-09-25T10:00:00Z',
    updatedAt: '2024-09-25T11:00:00Z',
    negotiationActivity: [],
  },
];

export const mockActivityPosts: ActivityPost[] = [
  {
    id: 'activity-1',
    type: 'initial_draft',
    title: 'Mutual NDA generated',
    description: 'Initial draft created for TechStart Inc confidentiality agreement',
    clientId: 'client-3',
    clientName: 'TechStart Inc',
    clientLogo: '/techstart-logo.png',
    documentId: 'doc-3',
    templateId: 'template-1',
    createdAt: '2024-09-25T11:00:00Z',
  },
  {
    id: 'activity-2',
    type: 'first_turn',
    title: 'Master Services Agreement with XYZ Corp',
    description: 'First negotiation turn received with significant changes',
    clientId: 'client-1',
    clientName: 'XYZ Corp',
    clientLogo: '/xyz-logo.png',
    documentId: 'doc-1',
    templateId: 'template-5',
    flags: ['60% change to Indemnity'],
    createdAt: '2024-09-21T14:30:00Z',
    hasThread: true,
    threadPosts: [
      {
        id: 'thread-1-1',
        type: 'template_used',
        title: 'Template Used — Master Services Agreement',
        description: 'Base template selected for XYZ Corp engagement',
        clientId: 'client-1',
        clientName: 'XYZ Corp',
        clientLogo: '/xyz-logo.png',
        templateId: 'template-5',
        createdAt: '2024-09-20T10:00:00Z',
      },
      {
        id: 'thread-1-2',
        type: 'initial_draft',
        title: 'Initial Draft — MSA with XYZ generated',
        description: 'Customized draft prepared with client-specific terms',
        clientId: 'client-1',
        clientName: 'XYZ Corp',
        clientLogo: '/xyz-logo.png',
        documentId: 'doc-1',
        createdAt: '2024-09-20T11:00:00Z',
      },
      {
        id: 'thread-1-3',
        type: 'draft_sent',
        title: 'Draft Sent — email to counterparty',
        description: 'Dear XYZ Legal Team,\n\nPlease find attached the Master Services Agreement draft for your review. We look forward to your feedback.\n\nBest regards,\nSarah Chen',
        content: 'Email content with draft attachment sent to legal@xyzcorp.com',
        clientId: 'client-1',
        clientName: 'XYZ Corp',
        clientLogo: '/xyz-logo.png',
        createdAt: '2024-09-20T12:00:00Z',
      },
      {
        id: 'thread-1-4',
        type: 'turn_received',
        title: 'First Turn — email from counterparty',
        description: 'Thank you for the draft. We have reviewed the agreement and have several proposed changes, particularly regarding the indemnification clauses. Please see our redlined version attached.',
        content: 'Counterparty response with significant changes to indemnity terms',
        clientId: 'client-1',
        clientName: 'XYZ Corp',
        clientLogo: '/xyz-logo.png',
        flags: ['60% change to Indemnity'],
        createdAt: '2024-09-21T14:30:00Z',
      },
    ],
  },
  {
    id: 'activity-3',
    type: 'legal_query',
    title: 'Client considering hiring a US sales agent',
    description: 'TechStart Inc seeks guidance on sales contractor relationships',
    clientId: 'client-3',
    clientName: 'TechStart Inc',
    clientLogo: '/techstart-logo.png',
    queryId: 'query-1',
    opportunities: ['Send Sales Contractor Template'],
    createdAt: '2024-09-24T15:20:00Z',
  },
  {
    id: 'activity-4',
    type: 'executed_document',
    title: 'SAFE (Simple Agreement for Future Equity) with ABC Fund',
    description: 'Investment agreement successfully executed',
    clientId: 'client-2',
    clientName: 'ABC Fund',
    clientLogo: '/abc-logo.png',
    documentId: 'doc-2',
    templateId: 'template-3',
    createdAt: '2024-09-25T16:00:00Z',
  },
];

export const mockLegalQueries: LegalQuery[] = [
  {
    id: 'query-1',
    clientId: 'client-3',
    clientName: 'TechStart Inc',
    prompt: 'We are considering hiring a US-based sales agent to help us expand into the American market. What legal considerations should we be aware of, and what type of agreement would be most appropriate?',
    summary: 'Client seeks guidance on hiring US sales agent for market expansion',
    fullAnswer: 'When hiring a US sales agent, several key legal considerations apply...',
    model: 'Claude 3.5 Sonnet',
    topic: 'Employment & Contractor Law',
    tags: ['sales', 'contractor', 'US expansion', 'compliance'],
    attachments: [],
    sections: {
      summary: 'Hiring a US sales agent involves choosing between employee vs. independent contractor classification, with significant legal and tax implications.',
      issues: [
        'Worker classification (employee vs. contractor)',
        'State-specific employment laws',
        'Tax withholding obligations',
        'Commission structure compliance',
        'Termination procedures'
      ],
      clausesToWatch: [
        'Independent contractor classification language',
        'Commission calculation and payment terms',
        'Territory and exclusivity provisions',
        'Intellectual property ownership',
        'Termination and post-termination restrictions'
      ],
      notes: 'Recommend using Independent Contractor Agreement template with US-specific modifications. Consider state registration requirements for sales agents.'
    },
    createdAt: '2024-09-24T15:20:00Z',
    status: 'completed',
  },
  {
    id: 'query-2',
    clientId: 'client-1',
    clientName: 'XYZ Corp',
    prompt: 'What are the key differences between Delaware and California incorporation for our subsidiary?',
    summary: 'Comparison of Delaware vs California incorporation benefits',
    fullAnswer: 'Delaware and California incorporation each offer distinct advantages...',
    model: 'GPT-4',
    topic: 'Corporate Law',
    tags: ['incorporation', 'Delaware', 'California', 'subsidiary'],
    attachments: ['comparison-chart.pdf'],
    sections: {
      summary: 'Delaware offers business-friendly courts and established precedent, while California provides local advantages for CA-based operations.',
      issues: [
        'Tax implications in both states',
        'Franchise tax requirements',
        'Board composition requirements',
        'Shareholder rights differences'
      ],
      clausesToWatch: [
        'Delaware General Corporation Law provisions',
        'California Corporations Code compliance',
        'Tax nexus considerations'
      ],
      notes: 'For venture-backed companies, Delaware is typically preferred due to investor familiarity and legal precedent.'
    },
    createdAt: '2024-09-22T11:30:00Z',
    status: 'completed',
  },
  {
    id: 'query-3',
    clientId: 'client-2',
    clientName: 'ABC Fund',
    prompt: 'How should we structure our SAFE investment to include pro rata rights?',
    summary: 'SAFE structuring with pro rata participation rights',
    fullAnswer: 'Pro rata rights in SAFE agreements require careful structuring...',
    model: 'Claude 3.5 Sonnet',
    topic: 'Investment Law',
    tags: ['SAFE', 'pro rata', 'investment', 'rights'],
    attachments: [],
    sections: {
      summary: 'Pro rata rights allow investors to maintain ownership percentage in future rounds through additional investment rights.',
      issues: [
        'Conversion trigger mechanisms',
        'Rights calculation methodology',
        'Information rights coupling',
        'Transfer restrictions'
      ],
      clausesToWatch: [
        'Pro rata participation calculation',
        'Notice and exercise periods',
        'Oversubscription rights',
        'Assignment restrictions'
      ],
      notes: 'Consider using Y Combinator SAFE template with pro rata rider attachment.'
    },
    createdAt: '2024-09-20T09:15:00Z',
    status: 'completed',
  },
];

export const mockClientAlerts: ClientAlert[] = [
  {
    id: 'alert-1',
    title: 'New SEC Regulations Impact Startup Fundraising',
    summary: 'Recent SEC rule changes affect how startups can conduct fundraising activities and investor communications.',
    content: `The Securities and Exchange Commission (SEC) has introduced new regulations that significantly impact how startups approach fundraising and investor relations. These changes, effective immediately, require enhanced disclosure requirements and modified communication protocols.

## Key Changes:

### Enhanced Disclosure Requirements
- Startups must now provide more detailed financial projections
- Risk factors must be more specifically articulated
- Management team backgrounds require additional verification

### Communication Protocols
- All investor communications must be documented
- Marketing materials require pre-approval in certain circumstances
- Social media fundraising posts have new compliance requirements

### Impact on Current Fundraising
For companies currently in fundraising mode, these changes may require:
- Updated pitch decks and financial models
- Revised legal documentation
- Enhanced due diligence preparation

## Recommended Actions:

1. **Review Current Materials**: Audit all fundraising materials for compliance
2. **Update Documentation**: Ensure all legal docs reflect new requirements  
3. **Compliance Training**: Brief your team on new communication protocols
4. **Legal Review**: Schedule a compliance review with our team

Our firm is prepared to help you navigate these changes efficiently. Please reach out to discuss how these regulations specifically impact your fundraising strategy.`,
    tags: ['SEC', 'Fundraising', 'Compliance', 'Startups'],
    audience: ['client-1', 'client-3', 'client-5'],
    heroImage: '/sec-regulations-hero.jpg',
    publishedAt: '2024-09-28T10:00:00Z',
    status: 'published',
    views: 142,
    engagement: 23,
  },
];

export const mockInsights: Insight = {
  topTemplates: [
    { name: 'Mutual NDA', count: 24, templateId: 'template-1' },
    { name: 'Master Services Agreement', count: 15, templateId: 'template-5' },
    { name: '1-Way NDA', count: 18, templateId: 'template-2' },
    { name: 'SAFE', count: 12, templateId: 'template-3' },
    { name: 'Independent Contractor Agreement', count: 9, templateId: 'template-6' },
  ],
  topQueryTopics: [
    { topic: 'Employment & Contractor Law', count: 15 },
    { topic: 'Corporate Law', count: 12 },
    { topic: 'Investment Law', count: 10 },
    { topic: 'Intellectual Property', count: 8 },
    { topic: 'Compliance', count: 6 },
  ],
  activeClients: [
    { name: 'XYZ Corp', count: 15, clientId: 'client-1' },
    { name: 'TechStart Inc', count: 12, clientId: 'client-3' },
    { name: 'Innovation Labs', count: 9, clientId: 'client-5' },
    { name: 'ABC Fund', count: 8, clientId: 'client-2' },
    { name: 'Global Ventures', count: 6, clientId: 'client-4' },
  ],
};

// Utility functions for data management
export const dataUtils = {
  // Simulate API latency
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Reset all data to initial state
  resetDemoData: () => {
    // This would reset all mock data to initial values
    console.log('Demo data reset');
  },
  
  // Update lawyer profile and sync to founder dashboard
  updateLawyerProfile: async (profile: Partial<LawyerProfile>) => {
    await dataUtils.delay();
    Object.assign(mockLawyerProfile, profile);
    mockLawyerProfile.versionStamp += 1;
    mockLawyerProfile.lastUpdated = new Date().toISOString();
    
    // Simulate sync to founder dashboard
    sharedState.lawyerProfile = { ...mockLawyerProfile };
    return mockLawyerProfile;
  },
  
  // Add new template
  addTemplate: async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'versions'>) => {
    await dataUtils.delay();
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      versions: [{
        version: 1,
        createdAt: new Date().toISOString(),
        changes: 'Initial template creation',
        content: 'New template content...',
      }],
    };
    mockTemplates.push(newTemplate);
    return newTemplate;
  },
  
  // Share template with clients
  shareTemplate: async (templateId: string, clientIds: string[]) => {
    await dataUtils.delay();
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      template.sharedWith = [...new Set([...template.sharedWith, ...clientIds])];
    }
    return template;
  },
  
  // Add new legal query
  addLegalQuery: async (query: Omit<LegalQuery, 'id' | 'createdAt' | 'status'>) => {
    await dataUtils.delay();
    const newQuery: LegalQuery = {
      ...query,
      id: `query-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'completed',
    };
    mockLegalQueries.push(newQuery);
    return newQuery;
  },
  
  // Publish client alert and sync to founder dashboard
  publishClientAlert: async (alert: Omit<ClientAlert, 'id' | 'publishedAt' | 'status' | 'views' | 'engagement'>) => {
    await dataUtils.delay();
    const newAlert: ClientAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      status: 'published',
      views: 0,
      engagement: 0,
    };
    mockClientAlerts.push(newAlert);
    
    // Simulate sync to founder dashboard
    sharedState.clientAlerts = [...mockClientAlerts];
    return newAlert;
  },
};
