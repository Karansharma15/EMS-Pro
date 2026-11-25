// src/store/leaveStore.js
import { create } from 'zustand';

const LS_KEY = 'ems_leaves';
const LS_BAL = 'ems_leave_balances';

const getAll = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveAll = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));
const getBalances = () => JSON.parse(localStorage.getItem(LS_BAL) || '[]');
const saveBalances = (d) => localStorage.setItem(LS_BAL, JSON.stringify(d));

const useLeaveStore = create((set) => ({
  leaves: [],
  balances: [],

  load: () => set({ leaves: getAll(), balances: getBalances() }),

  applyLeave: (data) => {
    const leaves = getAll();
    const newLeave = {
      ...data,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
    };
    leaves.push(newLeave);
    saveAll(leaves);
    set({ leaves });
    return { success: true };
  },

  updateLeave: (id, updates) => {
    const leaves = getAll();
    const idx = leaves.findIndex((l) => l.id === id);
    if (idx === -1) return { success: false };
    leaves[idx] = { ...leaves[idx], ...updates };
    saveAll(leaves);
    set({ leaves });
    return { success: true };
  },

  approveLeave: (id, reviewerId) => {
    const leaves = getAll();
    const idx = leaves.findIndex((l) => l.id === id);
    if (idx === -1) return { success: false };
    const leave = leaves[idx];
    if (leave.status !== 'Pending') return { success: false, message: 'Leave already processed.' };
    
    // Deduct from balance
    const balances = getBalances();
    const balIdx = balances.findIndex((b) => b.employeeId === leave.employeeId);
    if (balIdx !== -1) {
      const typeMap = { 'Casual Leave': 'usedCasual', 'Sick Leave': 'usedSick', 'Paid Leave': 'usedPaid', 'Unpaid Leave': 'usedUnpaid' };
      const key = typeMap[leave.type];
      if (key) balances[balIdx][key] = (balances[balIdx][key] || 0) + leave.days;
      saveBalances(balances);
    }

    leaves[idx] = { ...leave, status: 'Approved', reviewedBy: reviewerId, reviewedAt: new Date().toISOString() };
    saveAll(leaves);
    set({ leaves, balances });
    return { success: true };
  },

  rejectLeave: (id, reviewerId, reason) => {
    const leaves = getAll();
    const idx = leaves.findIndex((l) => l.id === id);
    if (idx === -1) return { success: false };
    leaves[idx] = { ...leaves[idx], status: 'Rejected', reviewedBy: reviewerId, reviewedAt: new Date().toISOString(), rejectionReason: reason };
    saveAll(leaves);
    set({ leaves });
    return { success: true };
  },

  getByEmployee: (employeeId) => getAll().filter((l) => l.employeeId === employeeId),

  getBalance: (employeeId) => getBalances().find((b) => b.employeeId === employeeId) || null,
}));

export default useLeaveStore;
