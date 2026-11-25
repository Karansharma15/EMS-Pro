// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { cn, timeAgo } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import Avatar from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMobileMenuToggle, sidebarCollapsed }) => {
  const { user, getNotifications, markNotificationRead } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  const notifications = getNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20 transition-all duration-300',
      sidebarCollapsed ? 'left-16' : 'left-64'
    )}>
      <button
        onClick={onMobileMenuToggle}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fadeIn z-50">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
              {unread > 0 && <span className="text-xs text-blue-600 font-medium">{unread} new</span>}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications</p>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      'px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors',
                      !n.read && 'bg-blue-50/50'
                    )}
                  >
                    <p className="text-sm text-slate-700">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Avatar name={user?.name} size="sm" />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fadeIn z-50">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={() => { navigate('/settings'); setProfileOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Profile Settings
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
