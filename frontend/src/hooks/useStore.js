import { create } from 'zustand';
import { authAPI } from '../utils/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const response = await authAPI.getMe();
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));

export const useJournalStore = create((set) => ({
  entries: [],
  currentEntry: null,

  setEntries: (entries) => set({ entries }),
  setCurrentEntry: (entry) => set({ currentEntry: entry }),

  addEntry: (entry) => set((state) => ({
    entries: [entry, ...state.entries],
    currentEntry: entry,
  })),

  updateEntry: (id, updatedEntry) => set((state) => ({
    entries: state.entries.map((e) => (e.id === id ? updatedEntry : e)),
    currentEntry: state.currentEntry?.id === id ? updatedEntry : state.currentEntry,
  })),

  removeEntry: (id) => set((state) => ({
    entries: state.entries.filter((e) => e.id !== id),
    currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
  })),
}));

export const useGoalsStore = create((set) => ({
  goals: [],
  projects: [],
  dailyLevers: [],

  setGoals: (goals) => set({ goals }),
  setProjects: (projects) => set({ projects }),
  setDailyLevers: (levers) => set({ dailyLevers: levers }),

  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updated) => set((state) => ({
    goals: state.goals.map((g) => (g.id === id ? updated : g)),
  })),
  removeGoal: (id) => set((state) => ({
    goals: state.goals.filter((g) => g.id !== id),
  })),

  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updated) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? updated : p)),
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
  })),

  addDailyLever: (lever) => set((state) => ({ dailyLevers: [...state.dailyLevers, lever] })),
  updateDailyLever: (id, updated) => set((state) => ({
    dailyLevers: state.dailyLevers.map((l) => (l.id === id ? updated : l)),
  })),
  removeDailyLever: (id) => set((state) => ({
    dailyLevers: state.dailyLevers.filter((l) => l.id !== id),
  })),
}));
