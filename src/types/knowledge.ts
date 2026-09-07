export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  type: 'system' | 'custom';
  visibility: 'personal' | 'shared';
  chapters: KBChapter[];
  createdAt: string;
  updatedAt: string;
}

export interface KBChapter {
  id: string;
  title: string;
  content: string;
  order: number;
  children?: KBChapter[];
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'link';
  url: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  scenario: string;
  specs: Record<string, any>;
  features: string[];
  compliance: string[];
  competitors: string[];
  price?: number;
  documents: Attachment[];
  cases: string[];
}

export interface Competitor {
  id: string;
  name: string;
  englishName: string;
  positioning: string;
  headquarters: string;
  website: string;
  productLines: string[];
  advantages: string[];
  disadvantages: string[];
  pricingStrategy: string;
  differentiationScripts: Record<string, string>;
}

export interface Case {
  id: string;
  name: string;
  industry: string;
  scale: string;
  type: string;
  budget: number;
  duration: string;
  completionDate: string;
  background: string;
  painPoints: string;
  solution: string;
  products: any[];
  results: string;
  customerFeedback: string;
  tags: string[];
}

export interface Standard {
  id: string;
  code: string;
  name: string;
  status: string;
  publishDate: string;
  implementDate: string;
  levels: string[];
  relatedProducts: string[];
  relatedCompetitors: string[];
  relatedCases: string[];
}

export interface KnowledgeStore {
  knowledgeBases: KnowledgeBase[];
  products: Product[];
  competitors: Competitor[];
  cases: Case[];
  standards: Standard[];
  recentItems: any[];
}
