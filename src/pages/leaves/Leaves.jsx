import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, 
  Plus, Filter, Check, X, ShieldAlert, Award, FileText 
} from 'lucide-react';
import useLeaveStore from '../../store/leaveStore';
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

const Leaves = () => {
  const { user } = useAuthStore();
  const { leaves, balances, load: loadLeaves, applyLeave, approveLeave, rejectLeave } = useLeaveStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Apply form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadLeaves();
    loadEmployees();
  }, []);

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';
  const currentEmpId = user?.employeeId || employees.find(e => e.email === user?.email)?.id;

  // Calculate day difference
  const calcDays = () => {
    try {
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!currentEmpId) {
      addToast('No employee record found for your user.', 'error');
      return;
    }
    if (!reason.trim()) {
      addToast('Please provide a reason for the leave.', 'warning');
      return;
    }

    const days = calcDays();
    applyLeave({
      employeeId: currentEmpId,
      type: leaveType,
      from: fromDate,
      to: toDate,
      days,
      reason,
    });

    addToast(`Leave application submitted (${days} days)`, 'success');
    setApplyModalOpen(false);
    setReason('');
  };

  const handleApprove = (id) => {
    approveLeave(id, user?.id);
    addToast('Leave request approved.', 'success');
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (selectedLeaveId) {
      rejectLeave(selectedLeaveId, user?.id, rejectionReason || 'Declined by Manager');
      addToast('Leave request rejected.', 'info');
      setRejectModalOpen(false);
      setSelectedLeaveId(null);
      setRejectionReason('');
    }
  };

  // Leave balance for current user
  const myBalance = balances.find(b => b.employeeId === currentEmpId) || {
    casualLeave: 10, sickLeave: 7, paidLeave: 15, unpaidLeave: 0,
    usedCasual: 2, usedSick: 1, usedPaid: 3, usedUnpaid: 0
  };

  // Filter leaves
  const displayLeaves = leaves.filter(l => {
    if (!isAdminOrHR && l.employeeId !== currentEmpId) return false;
    if (statusFilter && l.status !== statusFilter) return false;
    return true;
  });

  const empMap = employees.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

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
              <span className="font-semibold text-slate-800 text-xs block">{emp?.name || 'Employee'}</span>
              <span className="text-[11px] text-slate-400 font-mono">{emp?.employeeId || val}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      label: 'Leave Type',
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val}</span>
    },
    {
      key: 'dates',
      label: 'Duration',
      render: (_, row) => (
        <div className="text-xs text-slate-600">
          <span className="font-medium">{formatDate(row.from)} - {formatDate(row.to)}</span>
          <span className="text-slate-400 block">{row.days} {row.days === 1 ? 'day' : 'days'}</span>
        </div>
      )
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (val) => <span className="text-xs text-slate-600 line-clamp-1 max-w-xs">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        if (!isAdminOrHR || row.status !== 'Pending') {
          return <span className="text-xs text-slate-400 font-mono">{row.reviewedAt ? formatDate(row.reviewedAt) : '--'}</span>;
        }
        return (
          <div className="flex items-center gap-1.5">
            <Button
              size="xs"
              variant="success"
              onClick={() => handleApprove(row.id)}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Approve
            </Button>
            <Button
              size="xs"
              variant="danger"
              onClick={() => {
                setSelectedLeaveId(row.id);
                setRejectModalOpen(true);
              }}
              icon={<X className="w-3.5 h-3.5" />}
            >
              Reject
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Apply for time off, manage approval workflows, and monitor company leave balances.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setApplyModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balances Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Casual Leave</p>
            <p className="text-2xl font-bold text-blue-600">
              {myBalance.casualLeave - (myBalance.usedCasual || 0)}
              <span className="text-xs text-slate-400 font-normal ml-1">/ {myBalance.casualLeave} days left</span>
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Sick Leave</p>
            <p className="text-2xl font-bold text-emerald-600">
              {myBalance.sickLeave - (myBalance.usedSick || 0)}
              <span className="text-xs text-slate-400 font-normal ml-1">/ {myBalance.sickLeave} days left</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Paid Leave</p>
            <p className="text-2xl font-bold text-indigo-600">
              {myBalance.paidLeave - (myBalance.usedPaid || 0)}
              <span className="text-xs text-slate-400 font-normal ml-1">/ {myBalance.paidLeave} days left</span>
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
            <p className="text-2xl font-bold text-amber-600">
              {leaves.filter(l => l.status === 'Pending').length}
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex gap-2">
          {['', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status || 'All Leaves'}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          Showing {displayLeaves.length} applications
        </span>
      </div>

      {/* Leaves Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <DataTable
          data={displayLeaves}
          columns={columns}
          searchable={false}
          pageSize={8}
          emptyMessage="No leave records matching filter."
        />
      </div>

      {/* Apply Leave Modal */}
      <Modal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for Leave of Absence"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setApplyModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleApply}>Submit Application</Button>
          </div>
        }
      >
        <form onSubmit={handleApply} className="space-y-4">
          <Select
            label="Leave Type"
            options={[
              { label: 'Casual Leave', value: 'Casual Leave' },
              { label: 'Sick Leave', value: 'Sick Leave' },
              { label: 'Paid Leave', value: 'Paid Leave' },
              { label: 'Unpaid Leave', value: 'Unpaid Leave' },
            ]}
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              required
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Input
              label="To Date"
              type="date"
              required
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 font-medium">
            Requested Duration: <span className="font-bold">{calcDays()} day(s)</span>
          </div>

          <Input
            label="Reason for Leave"
            required
            placeholder="Briefly state the reason for absence..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Leave Request"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRejectSubmit}>Confirm Rejection</Button>
          </div>
        }
      >
        <form onSubmit={handleRejectSubmit} className="space-y-3">
          <p className="text-sm text-slate-600">Provide an optional reason for rejecting this leave application:</p>
          <Input
            placeholder="e.g. Critical project deadline conflict"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Leaves;
