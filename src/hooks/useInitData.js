// src/hooks/useInitData.js
import { useEffect } from 'react';
import {
  EMPLOYEES, DEPARTMENTS, ATTENDANCE, LEAVES, LEAVE_BALANCES,
  PAYROLL, TASKS, PERFORMANCE_REVIEWS, NOTIFICATIONS, USERS
} from '../data/seedData';

const INITIALIZED_KEY = 'ems_initialized';

const useInitData = () => {
  useEffect(() => {
    if (localStorage.getItem(INITIALIZED_KEY)) return;

    // Seed all stores
    if (!localStorage.getItem('ems_employees')) {
      localStorage.setItem('ems_employees', JSON.stringify(EMPLOYEES));
    }
    if (!localStorage.getItem('ems_departments')) {
      localStorage.setItem('ems_departments', JSON.stringify(DEPARTMENTS));
    }
    if (!localStorage.getItem('ems_attendance')) {
      localStorage.setItem('ems_attendance', JSON.stringify(ATTENDANCE));
    }
    if (!localStorage.getItem('ems_leaves')) {
      localStorage.setItem('ems_leaves', JSON.stringify(LEAVES));
    }
    if (!localStorage.getItem('ems_leave_balances')) {
      localStorage.setItem('ems_leave_balances', JSON.stringify(LEAVE_BALANCES));
    }
    if (!localStorage.getItem('ems_payroll')) {
      localStorage.setItem('ems_payroll', JSON.stringify(PAYROLL));
    }
    if (!localStorage.getItem('ems_tasks')) {
      localStorage.setItem('ems_tasks', JSON.stringify(TASKS));
    }
    if (!localStorage.getItem('ems_performance')) {
      localStorage.setItem('ems_performance', JSON.stringify(PERFORMANCE_REVIEWS));
    }
    if (!localStorage.getItem('ems_notifications')) {
      localStorage.setItem('ems_notifications', JSON.stringify(NOTIFICATIONS));
    }
    if (!localStorage.getItem('ems_users')) {
      localStorage.setItem('ems_users', JSON.stringify(USERS));
    }

    localStorage.setItem(INITIALIZED_KEY, 'true');
  }, []);
};

export default useInitData;
