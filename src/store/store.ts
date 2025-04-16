
import { create } from 'zustand';
import { Goal, Idea, Project, Task } from '@/lib/models';

interface AppState {
  // UI state
  selectedMenu: 'dashboard' | 'goals' | 'ideas' | 'projects' | 'tasks';
  isAddModalOpen: boolean;
  addModalType: 'goal' | 'idea' | 'project' | 'task' | null;
  isSidebarOpen: boolean;
  
  // UI actions
  selectMenu: (menu: AppState['selectedMenu']) => void;
  openAddModal: (type: AppState['addModalType']) => void;
  closeAddModal: () => void;
  toggleSidebar: () => void;
  
  // Temporary editing state (before saving to Firestore)
  editingGoal: Goal | null;
  editingIdea: Idea | null;
  editingProject: Project | null;
  editingTask: Task | null;
  
  // Editing actions
  setEditingGoal: (goal: Goal | null) => void;
  setEditingIdea: (idea: Idea | null) => void;
  setEditingProject: (project: Project | null) => void;
  setEditingTask: (task: Task | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // UI state with defaults
  selectedMenu: 'dashboard',
  isAddModalOpen: false,
  addModalType: null,
  isSidebarOpen: true,
  
  // UI actions
  selectMenu: (menu) => set({ selectedMenu: menu }),
  openAddModal: (type) => set({ isAddModalOpen: true, addModalType: type }),
  closeAddModal: () => set({ isAddModalOpen: false, addModalType: null }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // Editing state
  editingGoal: null,
  editingIdea: null,
  editingProject: null,
  editingTask: null,
  
  // Editing actions
  setEditingGoal: (goal) => set({ editingGoal: goal }),
  setEditingIdea: (idea) => set({ editingIdea: idea }),
  setEditingProject: (project) => set({ editingProject: project }),
  setEditingTask: (task) => set({ editingTask: task }),
}));
