// src/store/attendanceStore.js
import { create } from 'zustand';
import { calculateWorkingHours } from '../utils/helpers';

const LS_KEY = 'ems_attendance';
const getAll = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveAll = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

const useAttendanceStore = create((set) => ({
  attendance: [],

  load: () => set({ attendance: getAll() }),

  checkIn: (employeeId) => {
    const records = getAll();
    const today = new Date().toISOString().split('T')[0];
    const existing = records.find((r) => r.employeeId === employeeId && r.date === today);
    if (existing) return { success: false, message: 'Already checked in today.' };

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const record = {
      id: `att-${employeeId}-${today}`,
      employeeId,
      date: today,
      checkIn: timeStr,
      checkOut: null,
      status: 'Present',
      workingHours: 0,
      isLate,
    };
    records.push(record);
    saveAll(records);
    set({ attendance: records });
    return { success: true, record };
  },

  checkOut: (employeeId) => {
    const records = getAll();
    const today = new Date().toISOString().split('T')[0];
    const idx = records.findIndex((r) => r.employeeId === employeeId && r.date === today);
    if (idx === -1) return { success: false, message: 'No check-in found for today.' };
    if (records[idx].checkOut) return { success: false, message: 'Already checked out.' };

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    records[idx].checkOut = timeStr;
    records[idx].workingHours = parseFloat(calculateWorkingHours(records[idx].checkIn, timeStr));
    saveAll(records);
    set({ attendance: records });
    return { success: true };
  },

  markAttendance: (record) => {
    const records = getAll();
    const idx = records.findIndex((r) => r.id === record.id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...record };
    } else {
      records.push({ ...record, id: `att-${Date.now()}` });
    }
    saveAll(records);
    set({ attendance: records });
    return { success: true };
  },

  getByEmployee: (employeeId) => getAll().filter((r) => r.employeeId === employeeId),

  getByDate: (date) => getAll().filter((r) => r.date === date),

  getMonthly: (employeeId, year, month) => {
    const prefix = `${year}-${String(month).padStart(2,'0')}`;
    return getAll().filter((r) => r.employeeId === employeeId && r.date.startsWith(prefix));
  },
}));

export default useAttendanceStore;
