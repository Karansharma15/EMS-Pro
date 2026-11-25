# 🏢 Enterprise Employee Management System (EMS Pro)

A modern, role-based Employee Management System built with **Vite**, **React 18**, and **Tailwind CSS**.

---

## 🚀 Quick Start

To run the development server locally:

```bash
cd "C:\Users\ACER\.gemini\antigravity\scratch\employee-management-system"
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Credentials

The system comes pre-loaded with comprehensive seed data across all roles. Click on any demo account on the login page or enter:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@company.com` | `Admin@123` | Complete system access (Departments, Payroll, All Staff, Settings) |
| **HR Manager** | `michael@company.com` | `Pass@123` | HR operations, Employee CRUD, Leave approvals, Payroll processing |
| **Employee** | `sarah@company.com` | `Pass@123` | Personal profile, Daily check-in/out, Leave requests, Assigned tasks |

---

## 🛠 Features Implemented

### 1. Authentication & Role-Based Access Control (RBAC)
- **JWT simulation & password hashing** with `localStorage` persistence.
- **Login, Register, Forgot Password & Reset Password** workflows with field validation.
- Three defined user roles: **Admin**, **HR**, and **Employee** with protected routing.
- Profile settings with avatar upload and password changes.

### 2. Executive & Operational Dashboard
- **Real-time KPI metrics**: Total workforce, active staff, today's attendance rate, employees on leave.
- **Visual Analytics with Recharts**:
  - 6-month attendance trend area chart.
  - Employment status breakdown pie chart (Active, Inactive, Resigned).
  - Department headcount bar chart.
- Quick check-in / check-out widget.
- Actionable pending leave requests with one-click approve/reject.

### 3. Employee Directory & Profiles
- **Full Employee CRUD**: Add, edit, delete, and view comprehensive profiles.
- Automated Employee ID generation (`EMP1001` format).
- Search, filter by department, and filter by status.
- **Interactive Employee Profile**:
  - Avatar upload with live preview.
  - Tabbed interface: Personal details, emergency contacts, documents, attendance logs, leave records, payroll history, and assigned tasks.
  - Document attachment manager (offer letters, contracts, ID proofs).

### 4. Attendance Management
- Daily **Check-In** and **Check-Out** with late arrival detection (after 09:15 AM).
- Automatic working hours computation.
- Monthly attendance logs with filtering by date and status (Present, Absent, Half Day).
- Manual attendance logging for HR & Admin.

### 5. Leave Management
- Application modal with automated day calculation and reason input.
- Real-time leave balance tracking (Casual, Sick, Paid, Unpaid).
- Approval workflow: HR/Admin can approve or reject with custom feedback.

### 6. Payroll & Salary Management
- Monthly payroll processing with breakdown:
  - Earnings: Basic Salary + HRA (20%) + Transport ($500) + Medical ($300) + Bonus.
  - Deductions: TDS Tax (10%) + Provident Fund (12%) + Other deductions.
  - Net salary auto-calculation.
- **Printable salary payslips** with corporate header and detailed earnings breakdown.

### 7. Department Management
- Create, update, and delete departments.
- Assign department heads / managers.
- Track staff headcount per division.

### 8. Task Management & Kanban Board
- Interactive **Kanban Board** with drag-free stage movement (`Pending` ➔ `In Progress` ➔ `Completed`).
- Alternative searchable list view with priority badges (`High`, `Medium`, `Low`).
- Task creation modal with assignee, priority, description, and deadlines.

### 9. Performance Management & Appraisals
- Quarterly employee performance evaluations.
- 5-star rating system with attendance and task completion scoring.
- Manager feedback and goal tracking.
- Comparative workforce performance bar chart.

---

## 📁 Project Architecture

```
employee-management-system/
├── src/
│   ├── components/
│   │   ├── layout/       # Sidebar, Header, AppLayout with Toast Provider
│   │   └── ui/           # Button, Input, Select, Modal, Card, Badge, DataTable, StatCard, Avatar, Toast
│   ├── data/             # seedData.js (Employees, Departments, Leaves, Payroll, Tasks, Reviews, Users)
│   ├── hooks/            # useInitData.js (localStorage database initializer)
│   ├── pages/
│   │   ├── auth/         # Login, Register, ForgotPassword, ResetPassword
│   │   ├── dashboard/    # Role-aware Dashboard
│   │   ├── employees/    # EmployeeList, EmployeeProfile, EmployeeForm
│   │   ├── departments/  # Departments
│   │   ├── attendance/   # Attendance
│   │   ├── leaves/       # Leaves
│   │   ├── payroll/      # Payroll
│   │   ├── tasks/        # Tasks (Kanban & List)
│   │   ├── performance/  # Performance & Appraisals
│   │   ├── settings/     # Settings (Profile, Security, System)
│   │   └── Unauthorized.jsx
│   ├── routes/           # ProtectedRoute.jsx
│   ├── store/            # Zustand stores (auth, employee, department, attendance, leave, payroll, task, performance)
│   ├── utils/            # helpers.js, auth.js
│   ├── App.jsx           # Main Router
│   └── main.jsx
├── package.json
└── vite.config.js
```
