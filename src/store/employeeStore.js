// src/store/employeeStore.js
import { create } from 'zustand';
import { generateId } from '../utils/helpers';

const LS_KEY = 'ems_employees';

const getEmployees = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveEmployees = (emps) => localStorage.setItem(LS_KEY, JSON.stringify(emps));

const useEmployeeStore = create((set, get) => ({
  employees: [],

  load: () => {
    const emps = getEmployees();
    set({ employees: emps });
  },

  addEmployee: (data) => {
    const emps = getEmployees();
    const newEmp = {
      ...data,
      id: `emp-${Date.now()}`,
      employeeId: generateId('EMP'),
      createdAt: new Date().toISOString(),
      documents: [],
    };
    emps.push(newEmp);
    saveEmployees(emps);
    set({ employees: emps });
    return { success: true, employee: newEmp };
  },

  updateEmployee: (id, updates) => {
    const emps = getEmployees();
    const idx = emps.findIndex((e) => e.id === id);
    if (idx === -1) return { success: false, message: 'Employee not found.' };
    emps[idx] = { ...emps[idx], ...updates, updatedAt: new Date().toISOString() };
    saveEmployees(emps);
    set({ employees: emps });
    return { success: true };
  },

  deleteEmployee: (id) => {
    const emps = getEmployees().filter((e) => e.id !== id);
    saveEmployees(emps);
    set({ employees: emps });
    return { success: true };
  },

  getEmployee: (id) => getEmployees().find((e) => e.id === id) || null,

  uploadDocument: (employeeId, doc) => {
    const emps = getEmployees();
    const idx = emps.findIndex((e) => e.id === employeeId);
    if (idx === -1) return;
    emps[idx].documents = [...(emps[idx].documents || []), { ...doc, id: `doc-${Date.now()}`, uploadedAt: new Date().toISOString() }];
    saveEmployees(emps);
    set({ employees: emps });
  },

  deleteDocument: (employeeId, docId) => {
    const emps = getEmployees();
    const idx = emps.findIndex((e) => e.id === employeeId);
    if (idx === -1) return;
    emps[idx].documents = (emps[idx].documents || []).filter((d) => d.id !== docId);
    saveEmployees(emps);
    set({ employees: emps });
  },
}));

export default useEmployeeStore;
