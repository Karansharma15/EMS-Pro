// src/store/payrollStore.js
import { create } from 'zustand';

const LS_KEY = 'ems_payroll';
const getAll = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveAll = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

const usePayrollStore = create((set) => ({
  payroll: [],

  load: () => set({ payroll: getAll() }),

  addPayroll: (data) => {
    const records = getAll();
    // Check if already exists for this month
    const existing = records.find((r) => r.employeeId === data.employeeId && r.month === data.month);
    if (existing) return { success: false, message: 'Payroll already processed for this month.' };
    
    const hra = Math.round(data.basicSalary * 0.2);
    const transport = data.transportAllowance || 500;
    const medical = data.medicalAllowance || 300;
    const bonus = data.bonus || 0;
    const tax = Math.round(data.basicSalary * 0.1);
    const pf = Math.round(data.basicSalary * 0.12);
    const others = data.otherDeductions || 0;
    const net = data.basicSalary + hra + transport + medical + bonus - tax - pf - others;

    const record = {
      ...data,
      id: `pay-${Date.now()}`,
      hra,
      transportAllowance: transport,
      medicalAllowance: medical,
      bonus,
      taxDeduction: tax,
      pfDeduction: pf,
      otherDeductions: others,
      netSalary: net,
      status: 'Paid',
      paidAt: new Date().toISOString(),
    };
    records.push(record);
    saveAll(records);
    set({ payroll: records });
    return { success: true, record };
  },

  updatePayroll: (id, updates) => {
    const records = getAll();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false };
    records[idx] = { ...records[idx], ...updates };
    saveAll(records);
    set({ payroll: records });
    return { success: true };
  },

  getByEmployee: (employeeId) => getAll().filter((r) => r.employeeId === employeeId),

  getByMonth: (month) => getAll().filter((r) => r.month === month),
}));

export default usePayrollStore;
