export interface Solution {
  id: string;
  name: string;
  customerName: string;
  industry: string;
  scale: string;
  type: 'network' | 'security';
  subType: string;
  protectionLevel?: string;
  standards: string[];
  budget?: number;
  background: string;
  goals: string;
  chapters: Chapter[];
  products: ProductItem[];
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  enabled: boolean;
  content: Record<string, any>;
}

export interface ProductItem {
  type: string;
  brand: string;
  model: string;
  quantity: number;
  location: string;
  notes?: string;
}

export interface SolutionStore {
  solutions: Solution[];
  currentSolution: Partial<Solution> | null;
  setCurrentSolution: (solution: Partial<Solution> | null) => void;
  updateSolution: (id: string, data: Partial<Solution>) => void;
  addSolution: (solution: Solution) => void;
  deleteSolution: (id: string) => void;
}
