import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, AlertTriangle, 
  Calendar, UserCheck, Plus, Filter, Search, ArrowRight,
  LogIn, LogOut, CheckCircle2
} from 'lucide-react';
import useAttendanceStore from '../../store/attendanceStore';
import useEmployeeStore from '../../store/employeeStore';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { formatDate } from '../../utils/helpers';

const Attendance = () => {
  const { user } = useAuthStore();
  const { attendance, load: loadAttendance, checkIn, checkOut, markAttendance } = useAttendanceStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [manualModalOpen, setManualModalOpen] = useState(false);

  // Manual record state
  const [manualEmpId, setManualEmpId] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualCheckIn, setManualCheckIn] = useState('09:00');
  const [manualCheckOut, setManualCheckOut] = useState('17:00');
  const [manualStatus, setManualStatus] = useState('Present');

  useEffect(() => {
    loadAttendance();
    loadEmployees();
  }, []);

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';
  const todayStr = new Date().toISOString().split('T')[0];
  const currentEmpId = user?.employeeId || employees.find(e => e.email === user?.email)?.id;
  const myTodayAtt = attendance.find(a => a.employeeId === currentEmpId && a.date === todayStr);

  const handleSelfCheckIn = () => {
    if (!currentEmpId) {
      addToast('No employee record linked to user.', 'error');
      return;
    }
    const res = checkIn(currentEmpId);
    if (res.success) {
      addToast('Checked in successfully for today!', 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  const handleSelfCheckOut = () => {
    if (!currentEmpId) {
      addToast('No employee record linked to user.', 'error');
      return;
    }
    const res = checkOut(currentEmpId);
    if (res.success) {
      addToast('Checked out recorded successfully!', 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualEmpId) {
      addToast('Please select an employee.', 'error');
      return;
    }

    const [inH, inM] = manualCheckIn.split(':').map(Number);
    const [outH, outM] = manualCheckOut.split(':').map(Number);
    const hours = Math.max(0, (((outH * 60 + outM) - (inH * 60 + inM)) / 60)).toFixed(2);

    markAttendance({
      id: `att-${manualEmpId}-${manualDate}`,
      employeeId: manualEmpId,
      date: manualDate,
      checkIn: manualCheckIn,
      checkOut: manualCheckOut,
      workingHours: parseFloat(hours),
      status: manualStatus,
      isLate: inH > 9 || (inH === 9 && inM > 15)
    });

    addToast('Attendance record saved successfully.', 'success');
    setManualModalOpen(false);
  };

  // Filter records
  const displayRecords = attendance.filter(rec => {
    if (!isAdminOrHR && rec.employeeId !== currentEmpId) return false;
    if (filterDate && rec.date !== filterDate) return false;
    if (filterStatus && rec.status !== filterStatus) return false;
    return true;
  });

  const empMap = employees.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

  // Stats
  const todayTotal = attendance.filter(a => a.date === todayStr);
  const presentCount = todayTotal.filter(a => a.status === 'Present').length;
  const lateCount = todayTotal.filter(a => a.isLate).length;
  const absentCount = todayTotal.filter(a => a.status === 'Absent').length;

  const columns = [
    {
      key: 'employeeId',
      label: 'Employee',
      render: (val) => {
        const emp = empMap[val];
        return (
          <div className="flex items-center gap-3">
            <Avatar name={emp?.name} size="xs" />
            <div>
              <span className="font-semibold text-slate-800 text-xs block">{emp?.name || 'Unknown'}</span>
              <span className="text-[11px] text-slate-400 font-mono">{emp?.employeeId || val}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => <span className="text-xs text-slate-600 font-medium">{formatDate(val)}</span>
    },
    {
      key: 'checkIn',
      label: 'Check In',
      render: (val, row) => (
        <span className={`text-xs font-mono font-medium ${row.isLate ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
          {val || '--:--'}
        </span>
      )
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      render: (val) => <span className="text-xs font-mono font-medium text-slate-700">{val || '--:--'}</span>
    },
    {
      key: 'workingHours',
      label: 'Working Hours',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-semibold text-slate-800">
          {val ? `${val} hrs` : '--'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <Badge status={val}>{val}</Badge>
          {row.isLate && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
              Late
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Check-in */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time biometric attendance, clock-in tracking, working hours and monthly records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Check-in button */}
          <div className="flex gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
            {!myTodayAtt?.checkIn ? (
              <Button size="sm" variant="success" onClick={handleSelfCheckIn} icon={<LogIn className="w-4 h-4" />}>
                Check In Today
              </Button>
            ) : !myTodayAtt?.checkOut ? (
              <Button size="sm" variant="danger" onClick={handleSelfCheckOut} icon={<LogOut className="w-4 h-4" />}>
                Check Out Today
              </Button>
            ) : (
              <span className="text-xs font-medium text-emerald-700 px-3 py-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Day Completed
              </span>
            )}
          </div>

          {isAdminOrHR && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setManualEmpId(employees[0]?.id || '');
                setManualModalOpen(true);
              }}
            >
              Log Attendance
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      {isAdminOrHR && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Logged Today</p>
              <p className="text-2xl font-bold text-slate-800">{todayTotal.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">On-Time Present</p>
              <p className="text-2xl font-bold text-emerald-600">{presentCount - lateCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Late Arrivals</p>
              <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Absent Marked</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="w-44">
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="w-44">
          <Select
            placeholder="All Statuses"
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Present', value: 'Present' },
              { label: 'Absent', value: 'Absent' },
              { label: 'Half Day', value: 'Half Day' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>

        {(filterDate || filterStatus) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setFilterDate('');
              setFilterStatus('');
            }}
          >
            Clear Filters
          </Button>
        )}

        <div className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-blue-600 font-semibold">{displayRecords.length}</span> records
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <DataTable
          data={displayRecords}
          columns={columns}
          searchable={false}
          pageSize={10}
          emptyMessage="No attendance logs found for the selected filter."
        />
      </div>

      {/* Manual Attendance Entry Modal */}
      <Modal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        title="Manual Attendance Entry"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setManualModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleManualSubmit}>Save Record</Button>
          </div>
        }
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <Select
            label="Select Employee"
            required
            options={employees.map(e => ({ label: `${e.name} (${e.employeeId})`, value: e.id }))}
            value={manualEmpId}
            onChange={(e) => setManualEmpId(e.target.value)}
          />

          <Input
            label="Attendance Date"
            type="date"
            required
            value={manualDate}
            onChange={(e) => setManualDate(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check-In Time"
              type="time"
              value={manualCheckIn}
              onChange={(e) => setManualCheckIn(e.target.value)}
            />
            <Input
              label="Check-Out Time"
              type="time"
              value={manualCheckOut}
              onChange={(e) => setManualCheckOut(e.target.value)}
            />
          </div>

          <Select
            label="Attendance Status"
            options={[
              { label: 'Present', value: 'Present' },
              { label: 'Absent', value: 'Absent' },
              { label: 'Half Day', value: 'Half Day' },
            ]}
            value={manualStatus}
            onChange={(e) => setManualStatus(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
