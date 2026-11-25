// src/data/seedData.js
import { hashPassword } from '../utils/auth';

export const DEPARTMENTS = [
  { id: 'dept-1', name: 'Engineering', managerId: 'emp-1', description: 'Software development and infrastructure', createdAt: '2023-01-10' },
  { id: 'dept-2', name: 'Human Resources', managerId: 'emp-3', description: 'People operations and culture', createdAt: '2023-01-10' },
  { id: 'dept-3', name: 'Finance', managerId: 'emp-5', description: 'Financial planning and accounting', createdAt: '2023-01-10' },
  { id: 'dept-4', name: 'Marketing', managerId: 'emp-7', description: 'Brand and growth marketing', createdAt: '2023-02-01' },
  { id: 'dept-5', name: 'Sales', managerId: 'emp-9', description: 'Revenue and business development', createdAt: '2023-02-01' },
  { id: 'dept-6', name: 'Design', managerId: 'emp-11', description: 'Product and UX design', createdAt: '2023-03-01' },
];

export const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager',
  'HR Manager', 'HR Executive', 'HR Coordinator',
  'Finance Manager', 'Accountant', 'Financial Analyst',
  'Marketing Manager', 'Marketing Executive', 'Content Writer',
  'Sales Manager', 'Sales Executive', 'Business Development Manager',
  'UI/UX Designer', 'Graphic Designer', 'Product Designer',
  'CEO', 'CTO', 'COO', 'Product Manager',
];

export const EMPLOYEES = [
  {
    id: 'emp-1', employeeId: 'EMP1001', userId: 'user-1',
    name: 'Priya Yadav', email: 'priya@company.com', phone: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    departmentId: 'dept-1', designation: 'Tech Lead',
    joiningDate: '2022-03-15', salary: 95000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Jane Johnson', relation: 'Spouse', phone: '+1-555-0102' },
    documents: [],
  },
  {
    id: 'emp-2', employeeId: 'EMP1002', userId: 'user-2',
    name: 'Sarah Williams', email: 'sarah@company.com', phone: '+1-555-0103',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    departmentId: 'dept-1', designation: 'Software Engineer',
    joiningDate: '2022-06-01', salary: 75000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Mike Williams', relation: 'Brother', phone: '+1-555-0104' },
    documents: [],
  },
  {
    id: 'emp-3', employeeId: 'EMP1003', userId: 'user-3',
    name: 'Michael Chen', email: 'michael@company.com', phone: '+1-555-0105',
    address: '789 Pine Rd, Chicago, IL 60601',
    departmentId: 'dept-2', designation: 'HR Manager',
    joiningDate: '2021-11-20', salary: 70000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Lisa Chen', relation: 'Mother', phone: '+1-555-0106' },
    documents: [],
  },
  {
    id: 'emp-4', employeeId: 'EMP1004', userId: 'user-4',
    name: 'Emily Davis', email: 'emily@company.com', phone: '+1-555-0107',
    address: '321 Elm St, Houston, TX 77001',
    departmentId: 'dept-2', designation: 'HR Executive',
    joiningDate: '2023-01-10', salary: 55000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Tom Davis', relation: 'Father', phone: '+1-555-0108' },
    documents: [],
  },
  {
    id: 'emp-5', employeeId: 'EMP1005', userId: 'user-5',
    name: 'Robert Martinez', email: 'robert@company.com', phone: '+1-555-0109',
    address: '654 Maple Dr, Phoenix, AZ 85001',
    departmentId: 'dept-3', designation: 'Finance Manager',
    joiningDate: '2021-05-18', salary: 85000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Maria Martinez', relation: 'Spouse', phone: '+1-555-0110' },
    documents: [],
  },
  {
    id: 'emp-6', employeeId: 'EMP1006', userId: 'user-6',
    name: 'Jennifer Wilson', email: 'jennifer@company.com', phone: '+1-555-0111',
    address: '987 Cedar Ln, Philadelphia, PA 19101',
    departmentId: 'dept-4', designation: 'Marketing Manager',
    joiningDate: '2022-09-05', salary: 72000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'David Wilson', relation: 'Husband', phone: '+1-555-0112' },
    documents: [],
  },
  {
    id: 'emp-7', employeeId: 'EMP1007', userId: 'user-7',
    name: 'David Thompson', email: 'david@company.com', phone: '+1-555-0113',
    address: '246 Birch Blvd, San Antonio, TX 78201',
    departmentId: 'dept-5', designation: 'Sales Manager',
    joiningDate: '2022-01-15', salary: 80000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Kate Thompson', relation: 'Wife', phone: '+1-555-0114' },
    documents: [],
  },
  {
    id: 'emp-8', employeeId: 'EMP1008', userId: 'user-8',
    name: 'Lisa Anderson', email: 'lisa@company.com', phone: '+1-555-0115',
    address: '135 Walnut St, San Diego, CA 92101',
    departmentId: 'dept-6', designation: 'UI/UX Designer',
    joiningDate: '2023-03-20', salary: 68000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Mark Anderson', relation: 'Father', phone: '+1-555-0116' },
    documents: [],
  },
  {
    id: 'emp-9', employeeId: 'EMP1009', userId: 'user-9',
    name: 'James Taylor', email: 'james@company.com', phone: '+1-555-0117',
    address: '579 Spruce Ave, Dallas, TX 75201',
    departmentId: 'dept-1', designation: 'Senior Software Engineer',
    joiningDate: '2021-08-01', salary: 90000, employmentType: 'Full-time',
    status: 'Inactive', avatar: null,
    emergencyContact: { name: 'Anne Taylor', relation: 'Mother', phone: '+1-555-0118' },
    documents: [],
  },
  {
    id: 'emp-10', employeeId: 'EMP1010', userId: 'user-10',
    name: 'Ashley Brown', email: 'ashley@company.com', phone: '+1-555-0119',
    address: '864 Ash Court, San Jose, CA 95101',
    departmentId: 'dept-3', designation: 'Accountant',
    joiningDate: '2022-11-15', salary: 60000, employmentType: 'Full-time',
    status: 'Active', avatar: null,
    emergencyContact: { name: 'Chris Brown', relation: 'Sibling', phone: '+1-555-0120' },
    documents: [],
  },
];

export const USERS = [
  { id: 'user-admin', employeeId: null, name: 'Admin User', email: 'admin@company.com', role: 'Admin', password: hashPassword('Admin@123'), createdAt: '2021-01-01' },
  ...EMPLOYEES.map((emp, i) => ({
    id: emp.userId,
    employeeId: emp.id,
    name: emp.name,
    email: emp.email,
    role: i === 2 || i === 3 ? 'HR' : 'Employee',
    password: hashPassword('Pass@123'),
    createdAt: emp.joiningDate,
  })),
];

const today = new Date().toISOString().split('T')[0];

export const ATTENDANCE = [
  ...EMPLOYEES.slice(0, 7).map((emp) => ({
    id: `att-${emp.id}-today`,
    employeeId: emp.id,
    date: today,
    checkIn: '09:05',
    checkOut: '17:30',
    status: 'Present',
    workingHours: 8.42,
    isLate: false,
  })),
  {
    id: `att-emp-9-today`,
    employeeId: 'emp-9',
    date: today,
    checkIn: null,
    checkOut: null,
    status: 'Absent',
    workingHours: 0,
    isLate: false,
  },
];

export const LEAVES = [
  {
    id: 'leave-1', employeeId: 'emp-2', type: 'Casual Leave',
    from: '2024-11-25', to: '2024-11-26', days: 2,
    reason: 'Personal work', status: 'Pending',
    appliedAt: '2024-11-20', reviewedBy: null, reviewedAt: null,
  },
  {
    id: 'leave-2', employeeId: 'emp-4', type: 'Sick Leave',
    from: '2024-11-18', to: '2024-11-19', days: 2,
    reason: 'Not feeling well', status: 'Approved',
    appliedAt: '2024-11-17', reviewedBy: 'emp-3', reviewedAt: '2024-11-17',
  },
  {
    id: 'leave-3', employeeId: 'emp-6', type: 'Paid Leave',
    from: '2024-12-23', to: '2024-12-27', days: 5,
    reason: 'Holiday travel', status: 'Approved',
    appliedAt: '2024-11-10', reviewedBy: 'emp-3', reviewedAt: '2024-11-11',
  },
  {
    id: 'leave-4', employeeId: 'emp-8', type: 'Casual Leave',
    from: '2024-11-28', to: '2024-11-29', days: 2,
    reason: 'Family function', status: 'Rejected',
    appliedAt: '2024-11-19', reviewedBy: 'emp-3', reviewedAt: '2024-11-20',
    rejectionReason: 'Project deadline conflict',
  },
];

export const LEAVE_BALANCES = EMPLOYEES.map((emp) => ({
  employeeId: emp.id,
  casualLeave: 10,
  sickLeave: 7,
  paidLeave: 15,
  unpaidLeave: 0,
  usedCasual: Math.floor(Math.random() * 4),
  usedSick: Math.floor(Math.random() * 3),
  usedPaid: Math.floor(Math.random() * 7),
  usedUnpaid: 0,
}));

export const PAYROLL = EMPLOYEES.map((emp) => ({
  id: `pay-${emp.id}-nov24`,
  employeeId: emp.id,
  month: '2024-11',
  basicSalary: emp.salary,
  hra: Math.round(emp.salary * 0.2),
  transportAllowance: 500,
  medicalAllowance: 300,
  bonus: emp.id === 'emp-1' ? 5000 : 0,
  taxDeduction: Math.round(emp.salary * 0.1),
  pfDeduction: Math.round(emp.salary * 0.12),
  otherDeductions: 0,
  netSalary: Math.round(emp.salary + emp.salary * 0.2 + 500 + 300 - emp.salary * 0.1 - emp.salary * 0.12),
  status: 'Paid',
  paidAt: '2024-11-30',
}));

export const TASKS = [
  {
    id: 'task-1', title: 'Redesign Login Page', description: 'Update the login page with new branding.',
    assignedTo: 'emp-8', assignedBy: 'emp-1', departmentId: 'dept-6',
    priority: 'High', status: 'In Progress',
    deadline: '2024-12-05', createdAt: '2024-11-15', completedAt: null,
    attachments: [],
  },
  {
    id: 'task-2', title: 'Q4 Sales Report', description: 'Compile and analyze Q4 sales data.',
    assignedTo: 'emp-7', assignedBy: 'user-admin', departmentId: 'dept-5',
    priority: 'High', status: 'Pending',
    deadline: '2024-12-10', createdAt: '2024-11-18', completedAt: null,
    attachments: [],
  },
  {
    id: 'task-3', title: 'Employee Onboarding Documentation', description: 'Create onboarding guide for new hires.',
    assignedTo: 'emp-4', assignedBy: 'emp-3', departmentId: 'dept-2',
    priority: 'Medium', status: 'Completed',
    deadline: '2024-11-20', createdAt: '2024-11-01', completedAt: '2024-11-19',
    attachments: [],
  },
  {
    id: 'task-4', title: 'Fix Authentication Bug', description: 'Resolve JWT token refresh issue.',
    assignedTo: 'emp-2', assignedBy: 'emp-1', departmentId: 'dept-1',
    priority: 'High', status: 'In Progress',
    deadline: '2024-11-25', createdAt: '2024-11-20', completedAt: null,
    attachments: [],
  },
  {
    id: 'task-5', title: 'Monthly Newsletter', description: 'Write November company newsletter.',
    assignedTo: 'emp-6', assignedBy: 'user-admin', departmentId: 'dept-4',
    priority: 'Low', status: 'Completed',
    deadline: '2024-11-30', createdAt: '2024-11-10', completedAt: '2024-11-28',
    attachments: [],
  },
];

export const PERFORMANCE_REVIEWS = EMPLOYEES.slice(0, 5).map((emp, i) => ({
  id: `review-${emp.id}`,
  employeeId: emp.id,
  reviewerId: 'emp-3',
  period: '2024-Q3',
  rating: [4.5, 3.8, 4.2, 3.5, 4.8][i],
  attendance: [95, 88, 92, 85, 98][i],
  taskCompletion: [90, 80, 95, 75, 100][i],
  feedback: 'Good performance this quarter. Continue the momentum.',
  goals: ['Improve code quality', 'Complete advanced training', 'Lead a project'],
  createdAt: '2024-10-01',
}));

export const NOTIFICATIONS = [
  { id: 'notif-1', type: 'leave', message: 'Sarah Williams applied for 2 days casual leave.', userId: 'user-admin', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'notif-2', type: 'task', message: 'New task "Fix Authentication Bug" assigned to you.', userId: 'user-2', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'notif-3', type: 'payroll', message: 'November payroll has been processed successfully.', userId: 'user-admin', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'notif-4', type: 'attendance', message: 'You were marked late today (09:15 AM check-in).', userId: 'user-6', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
];
