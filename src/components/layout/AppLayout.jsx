// src/components/layout/AppLayout.jsx
import React, { useState, useContext, createContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../utils/helpers';
import { ToastContainer } from '../ui/Toast';

export const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { addToast: (msg) => console.log('Toast:', msg) };
  }
  return ctx;
};

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (msgOrObj, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const message = typeof msgOrObj === 'object' && msgOrObj !== null ? msgOrObj.message : msgOrObj;
    const finalType = typeof msgOrObj === 'object' && msgOrObj !== null ? (msgOrObj.type || type) : type;
    setToasts((prev) => [...prev, { id, message, type: finalType }]);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen bg-slate-100">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className={cn(
          'transition-all duration-300 pt-16',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}>
          <div className="p-6 min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ToastContext.Provider>
  );
};

export default AppLayout;
