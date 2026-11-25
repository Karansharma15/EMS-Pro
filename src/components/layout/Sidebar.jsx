// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  DollarSign, CheckSquare, TrendingUp, Settings, LogOut,
  ChevronLeft, ChevronRight, Briefcase, Bell
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import Avatar from '../ui/Avatar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Admin', 'HR', 'Employee'] },
  { label: 'Employees', icon: Users, path: '/employees', roles: ['Admin', 'HR'] },
  { label: 'Departments', icon: Building2, path: '/departments', roles: ['Admin'] },
  { label: 'Attendance', icon: Clock, path: '/attendance', roles: ['Admin', 'HR', 'Employee'] },
  { label: 'Leave Management', icon: CalendarDays, path: '/leaves', roles: ['Admin', 'HR', 'Employee'] },
  { label: 'Payroll', icon: DollarSign, path: '/payroll', roles: ['Admin', 'HR', 'Employee'] },
  { label: 'Tasks', icon: CheckSquare, path: '/tasks', roles: ['Admin', 'HR', 'Employee'] },
  { label: 'Performance', icon: TrendingUp, path: '/performance', roles: ['Admin', 'HR', 'Employee'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['Admin', 'HR', 'Employee'] },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-slate-900 flex flex-col z-30 sidebar-transition',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center px-4 py-5 border-b border-slate-800',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm">EMS Pro</span>
              <p className="text-slate-500 text-xs">{user?.role} Portal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          className="flex justify-center py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
              title={collapsed ? item.label : ''}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-3 px-1">
            <Avatar name={user?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        ) : null}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-sm font-medium',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
