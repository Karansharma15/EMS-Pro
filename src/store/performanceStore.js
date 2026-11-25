// src/store/performanceStore.js
import { create } from 'zustand';

const LS_KEY = 'ems_performance';
const getAll = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveAll = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

const usePerformanceStore = create((set) => ({
  reviews: [],

  load: () => set({ reviews: getAll() }),

  addReview: (data) => {
    const reviews = getAll();
    const newReview = { ...data, id: `review-${Date.now()}`, createdAt: new Date().toISOString() };
    reviews.push(newReview);
    saveAll(reviews);
    set({ reviews });
    return { success: true };
  },

  updateReview: (id, updates) => {
    const reviews = getAll();
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false };
    reviews[idx] = { ...reviews[idx], ...updates };
    saveAll(reviews);
    set({ reviews });
    return { success: true };
  },

  getByEmployee: (employeeId) => getAll().filter((r) => r.employeeId === employeeId),
}));

export default usePerformanceStore;
