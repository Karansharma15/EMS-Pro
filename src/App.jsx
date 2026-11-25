import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useInitData from './hooks/useInitData';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Unauthorized from './pages/Unauthorized';

// Application Pages
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeProfile from './pages/employees/EmployeeProfile';
import Departments from './pages/departments/Departments';
import Attendance from './pages/attendance/Attendance';
import Leaves from './pages/leaves/Leaves';
import Payroll from './pages/payroll/Payroll';
import Tasks from './pages/tasks/Tasks';
import Performance from './pages/performance/Performance';
import Settings from './pages/settings/Settings';

export default function App() {
  // Initialize sample data into localStorage once on initial boot
  useInitData();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authenticated Workspace */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* General Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />

            {/* HR and Admin only */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'HR']} />}>
              <Route path="/employees" element={<EmployeeList />} />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/departments" element={<Departments />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
