import { create } from 'zustand';
import type { KnowledgeBase, Product, Competitor, Case, Standard } from '@/types/knowledge';

interface KnowledgeStore {
  knowledgeBases: KnowledgeBase[];
  products: Product[];
  competitors: Competitor[];
  cases: Case[];
  standards: Standard[];
  recentItems: any[];
  addKnowledgeBase: (kb: KnowledgeBase) => void;
  updateKnowledgeBase: (id: string, data: Partial<KnowledgeBase>) => void;
  deleteKnowledgeBase: (id: string) => void;
  addRecentItem: (item: any) => void;
}

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeBases: [],
  products: [],
  competitors: [],
  cases: [],
  standards: [],
  recentItems: JSON.parse(localStorage.getItem('recentAccess') || '[]'),
  
  addKnowledgeBase: (kb) =>
    set((state) => ({
      knowledgeBases: [...state.knowledgeBases, kb],
    })),
  
  updateKnowledgeBase: (id, data) =>
    set((state) => ({
      knowledgeBases: state.knowledgeBases.map((kb) =>
        kb.id === id ? { ...kb, ...data } : kb
      ),
    })),
  
  deleteKnowledgeBase: (id) =>
    set((state) => ({
      knowledgeBases: state.knowledgeBases.filter((kb) => kb.id !== id),
    })),
  
  addRecentItem: (item) =>
    set((state) => {
      const recent = [item, ...state.recentItems.filter((r) => r.id !== item.id)].slice(0, 10);
      localStorage.setItem('recentAccess', JSON.stringify(recent));
      return { recentItems: recent };
    }),
}));
