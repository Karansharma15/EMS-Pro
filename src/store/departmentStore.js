// src/store/departmentStore.js
import { create } from 'zustand';

const LS_KEY = 'ems_departments';
const getDepts = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveDepts = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

const useDepartmentStore = create((set) => ({
  departments: [],

  load: () => set({ departments: getDepts() }),

  addDepartment: (data) => {
    const depts = getDepts();
    const newDept = { ...data, id: `dept-${Date.now()}`, createdAt: new Date().toISOString() };
    depts.push(newDept);
    saveDepts(depts);
    set({ departments: depts });
    return { success: true };
  },

  updateDepartment: (id, updates) => {
    const depts = getDepts();
    const idx = depts.findIndex((d) => d.id === id);
    if (idx === -1) return { success: false };
    depts[idx] = { ...depts[idx], ...updates };
    saveDepts(depts);
    set({ departments: depts });
    return { success: true };
  },

  deleteDepartment: (id) => {
    const depts = getDepts().filter((d) => d.id !== id);
    saveDepts(depts);
    set({ departments: depts });
    return { success: true };
  },
}));

export default useDepartmentStore;
