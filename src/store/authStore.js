// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createToken, decodeToken, verifyPassword, hashPassword } from '../utils/auth';
import { USERS, NOTIFICATIONS } from '../data/seedData';

const getInitialData = () => {
  if (!localStorage.getItem('ems_users')) {
    localStorage.setItem('ems_users', JSON.stringify(USERS));
  }
  if (!localStorage.getItem('ems_notifications')) {
    localStorage.setItem('ems_notifications', JSON.stringify(NOTIFICATIONS));
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const users = JSON.parse(localStorage.getItem('ems_users') || '[]');
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return { success: false, message: 'No account found with this email.' };
        if (!verifyPassword(password, user.password)) return { success: false, message: 'Incorrect password.' };

        const token = createToken({ id: user.id, email: user.email, role: user.role, name: user.name, employeeId: user.employeeId });
        set({ token, user: { ...user, password: undefined }, isAuthenticated: true });
        return { success: true };
      },

      register: (data) => {
        const users = JSON.parse(localStorage.getItem('ems_users') || '[]');
        if (users.find((u) => u.email === data.email)) return { success: false, message: 'Email already registered.' };
        const newUser = {
          id: `user-${Date.now()}`,
          employeeId: null,
          name: data.name,
          email: data.email,
          role: 'Employee',
          password: hashPassword(data.password),
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem('ems_users', JSON.stringify(users));
        return { success: true };
      },

      logout: () => set({ token: null, user: null, isAuthenticated: false }),

      updateProfile: (updates) => {
        const { user } = get();
        const users = JSON.parse(localStorage.getItem('ems_users') || '[]');
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updates };
          localStorage.setItem('ems_users', JSON.stringify(users));
          set({ user: { ...user, ...updates } });
        }
        return { success: true };
      },

      changePassword: (currentPassword, newPassword) => {
        const { user } = get();
        const users = JSON.parse(localStorage.getItem('ems_users') || '[]');
        const dbUser = users.find((u) => u.id === user.id);
        if (!dbUser || !verifyPassword(currentPassword, dbUser.password)) {
          return { success: false, message: 'Current password is incorrect.' };
        }
        const idx = users.findIndex((u) => u.id === user.id);
        users[idx].password = hashPassword(newPassword);
        localStorage.setItem('ems_users', JSON.stringify(users));
        return { success: true };
      },

      forgotPassword: (email) => {
        const users = JSON.parse(localStorage.getItem('ems_users') || '[]');
        const user = users.find((u) => u.email === email);
        if (!user) return { success: false, message: 'No account with this email.' };
        // In a real app, send an email. Here we just return a reset token.
        const resetToken = btoa(`reset:${user.id}:${Date.now() + 900000}`);
        return { success: true, resetToken, message: 'Reset link generated (simulated).' };
      },

      resetPassword: (resetToken, newPassword) => {
        try {
          const decoded = atob(resetToken);
          const [, userId, exp] = decoded.split(':');
          if (Date.now() > parseInt(exp)) return { success: false, message: 'Reset link expired.' };
          const users = JSON.parse(localStorage.getItem('ems_users') || '[]');
          const idx = users.findIndex((u) => u.id === userId);
          if (idx === -1) return { success: false, message: 'Invalid reset link.' };
          users[idx].password = hashPassword(newPassword);
          localStorage.setItem('ems_users', JSON.stringify(users));
          return { success: true };
        } catch {
          return { success: false, message: 'Invalid reset link.' };
        }
      },

      getNotifications: () => {
        const { user } = get();
        if (!user) return [];
        const all = JSON.parse(localStorage.getItem('ems_notifications') || '[]');
        return all.filter((n) => n.userId === user.id || (user.role === 'Admin' && n.userId === 'user-admin'));
      },

      markNotificationRead: (id) => {
        const all = JSON.parse(localStorage.getItem('ems_notifications') || '[]');
        const idx = all.findIndex((n) => n.id === id);
        if (idx !== -1) all[idx].read = true;
        localStorage.setItem('ems_notifications', JSON.stringify(all));
      },

      addNotification: (notification) => {
        const all = JSON.parse(localStorage.getItem('ems_notifications') || '[]');
        all.unshift({ ...notification, id: `notif-${Date.now()}`, createdAt: new Date().toISOString(), read: false });
        localStorage.setItem('ems_notifications', JSON.stringify(all));
      },
    }),
    { name: 'ems_auth', partialize: (s) => ({ token: s.token, user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);

export default useAuthStore;
