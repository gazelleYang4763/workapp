import { create } from 'zustand';
import { Solution } from '@/types/solution';

interface SolutionStore {
  solutions: Solution[];
  currentSolution: Partial<Solution> | null;
  setCurrentSolution: (solution: Partial<Solution> | null) => void;
  updateSolution: (id: string, data: Partial<Solution>) => void;
  addSolution: (solution: Solution) => void;
  deleteSolution: (id: string) => void;
}

export const useSolutionStore = create<SolutionStore>((set) => ({
  solutions: [],
  currentSolution: null,
  
  setCurrentSolution: (solution) => set({ currentSolution: solution }),
  
  updateSolution: (id, data) =>
    set((state) => ({
      solutions: state.solutions.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),
  
  addSolution: (solution) =>
    set((state) => ({
      solutions: [...state.solutions, solution],
    })),
  
  deleteSolution: (id) =>
    set((state) => ({
      solutions: state.solutions.filter((s) => s.id !== id),
    })),
}));
