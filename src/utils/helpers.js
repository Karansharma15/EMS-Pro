// src/utils/helpers.js

import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return 'Invalid Date';
  }
};

export const timeAgo = (date) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

export const generateId = (prefix = 'EMP') => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${num}`;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const calculateWorkingHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  const diff = (outH * 60 + outM) - (inH * 60 + inM);
  return Math.max(0, (diff / 60).toFixed(2));
};

export const getStatusColor = (status) => {
  const map = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    Resigned: 'bg-red-100 text-red-700 border-red-200',
    Present: 'bg-green-100 text-green-700 border-green-200',
    Absent: 'bg-red-100 text-red-700 border-red-200',
    'Half Day': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Late: 'bg-orange-100 text-orange-700 border-orange-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Approved: 'bg-green-100 text-green-700 border-green-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Paid: 'bg-blue-100 text-blue-700 border-blue-200',
    Unpaid: 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    Completed: 'bg-green-100 text-green-700 border-green-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    High: 'bg-red-100 text-red-700 border-red-200',
  };
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};
