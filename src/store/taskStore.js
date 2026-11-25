// src/store/taskStore.js
import { create } from 'zustand';

const LS_KEY = 'ems_tasks';
const getAll = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveAll = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

const useTaskStore = create((set) => ({
  tasks: [],

  load: () => set({ tasks: getAll() }),

  addTask: (data) => {
    const tasks = getAll();
    const newTask = { ...data, id: `task-${Date.now()}`, createdAt: new Date().toISOString(), completedAt: null };
    tasks.push(newTask);
    saveAll(tasks);
    set({ tasks });
    return { success: true, task: newTask };
  },

  updateTask: (id, updates) => {
    const tasks = getAll();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return { success: false };
    if (updates.status === 'Completed' && !tasks[idx].completedAt) {
      updates.completedAt = new Date().toISOString();
    }
    tasks[idx] = { ...tasks[idx], ...updates };
    saveAll(tasks);
    set({ tasks });
    return { success: true };
  },

  deleteTask: (id) => {
    const tasks = getAll().filter((t) => t.id !== id);
    saveAll(tasks);
    set({ tasks });
    return { success: true };
  },

  getByEmployee: (employeeId) => getAll().filter((t) => t.assignedTo === employeeId),
}));

export default useTaskStore;
