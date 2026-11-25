import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, FileText, Plus, Download, Printer, 
  Calendar, CheckCircle, TrendingUp, ShieldCheck, Building2 
} from 'lucide-react';
import usePayrollStore from '../../store/payrollStore';
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
import { formatDate, formatCurrency } from '../../utils/helpers';

const Payroll = () => {
  const { user } = useAuthStore();
  const { payroll, load: loadPayroll, addPayroll } = usePayrollStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Form states
  const [empId, setEmpId] = useState('');
  const [month, setMonth] = useState('2024-11');
  const [basicSalary, setBasicSalary] = useState('');
  const [bonus, setBonus] = useState(0);

  useEffect(() => {
    loadPayroll();
    loadEmployees();
  }, []);

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';
  const currentEmpId = user?.employeeId || employees.find(e => e.email === user?.email)?.id;

  const handleEmpSelect = (id) => {
    setEmpId(id);
    const emp = employees.find(e => e.id === id);
    if (emp) {
      setBasicSalary(emp.salary || 60000);
    }
  };

  const handleProcessSubmit = (e) => {
    e.preventDefault();
    if (!empId) {
      addToast('Please select an employee.', 'warning');
      return;
    }

    const res = addPayroll({
      employeeId: empId,
      month,
      basicSalary: Number(basicSalary) || 50000,
      transportAllowance: 500,
      medicalAllowance: 300,
      bonus: Number(bonus) || 0,
      otherDeductions: 0,
    });

    if (res.success) {
      addToast(`Payroll generated for ${month}`, 'success');
      setProcessModalOpen(false);
      setEmpId('');
      setBonus(0);
    } else {
      addToast(res.message || 'Error processing payroll', 'error');
    }
  };

  const displayPayroll = payroll.filter(p => {
    if (!isAdminOrHR && p.employeeId !== currentEmpId) return false;
    return true;
  });

  const empMap = employees.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

  // Total payroll stats
  const totalPaidOut = displayPayroll.reduce((sum, p) => sum + (p.netSalary || 0), 0);

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
      key: 'month',
      label: 'Pay Period',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val}</span>
    },
    {
      key: 'basicSalary',
      label: 'Base Pay',
      render: (val) => <span className="text-xs text-slate-600">{formatCurrency(val)}</span>
    },
    {
      key: 'allowances',
      label: 'Allowances',
      render: (_, row) => {
        const totalAllowances = (row.hra || 0) + (row.transportAllowance || 0) + (row.medicalAllowance || 0) + (row.bonus || 0);
        return <span className="text-xs text-emerald-600 font-medium">+{formatCurrency(totalAllowances)}</span>;
      }
    },
    {
      key: 'deductions',
      label: 'Deductions',
      render: (_, row) => {
        const totalDeductions = (row.taxDeduction || 0) + (row.pfDeduction || 0) + (row.otherDeductions || 0);
        return <span className="text-xs text-red-500 font-medium">-{formatCurrency(totalDeductions)}</span>;
      }
    },
    {
      key: 'netSalary',
      label: 'Net Disbursed',
      sortable: true,
      render: (val) => <span className="text-xs font-bold text-slate-900">{formatCurrency(val)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Payslip',
      render: (_, row) => (
        <Button
          size="xs"
          variant="outline"
          icon={<FileText className="w-3.5 h-3.5 text-blue-600" />}
          onClick={() => {
            setSelectedSlip(row);
            setSlipModalOpen(true);
          }}
        >
          Slip
        </Button>
      )
    }
  ];

  const slipEmp = selectedSlip ? empMap[selectedSlip.employeeId] : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll & Salary Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate allowances, deductions, generate monthly payslips, and manage compensation.
          </p>
        </div>

        {isAdminOrHR && (
          <Button
            variant="primary"
            onClick={() => {
              if (employees.length > 0) handleEmpSelect(employees[0].id);
              setProcessModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Process Payroll
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Disbursed</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalPaidOut)}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Payroll Runs</p>
            <p className="text-2xl font-bold text-blue-600">{displayPayroll.length}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Compensation</p>
            <p className="text-2xl font-bold text-indigo-600">
              {formatCurrency(displayPayroll.length ? totalPaidOut / displayPayroll.length : 0)}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <DataTable
          data={displayPayroll}
          columns={columns}
          searchable={true}
          searchKeys={['month']}
          pageSize={8}
          emptyMessage="No payroll records found."
        />
      </div>

      {/* Process Payroll Modal */}
      <Modal
        open={processModalOpen}
        onClose={() => setProcessModalOpen(false)}
        title="Run Employee Payroll"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setProcessModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleProcessSubmit}>Process & Disburse</Button>
          </div>
        }
      >
        <form onSubmit={handleProcessSubmit} className="space-y-4">
          <Select
            label="Employee"
            required
            options={employees.map(e => ({ label: `${e.name} (${e.designation})`, value: e.id }))}
            value={empId}
            onChange={(e) => handleEmpSelect(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pay Period (Month)"
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <Input
              label="Basic Salary (₹)"
              type="number"
              required
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bonus / Incentive (₹)"
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
            />
            <div className="pt-6 text-xs text-slate-500">
              HRA (20%), Transport (₹2500), Medical (₹3000), Tax (10%), PF (12%) auto-computed.
            </div>
          </div>
        </form>
      </Modal>

      {/* Salary Slip Modal */}
      <Modal
        open={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        title="Official Payslip"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              icon={<Printer className="w-4 h-4" />}
              onClick={() => {
                window.print();
              }}
            >
              Print Payslip
            </Button>
            <Button variant="primary" onClick={() => setSlipModalOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        {selectedSlip && (
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 print:border-none print:shadow-none">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    EMS
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Skyline Business Solutions Pvt. Ltd.</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">Office No. 402, 4th Floor, Tower B, Sector 62, Noida, Uttar Pradesh – 201309, India.</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-xs uppercase tracking-wider">
                  PAID
                </span>
                <p className="text-xs text-slate-400 mt-1">Period: {selectedSlip.month}</p>
              </div>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-slate-400 font-medium">EMPLOYEE NAME</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{slipEmp?.name || 'Employee'}</p>
                <p className="text-slate-500 mt-1">ID: {slipEmp?.employeeId || selectedSlip.employeeId}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-medium">DESIGNATION</p>
                <p className="font-semibold text-slate-700 text-sm mt-0.5">{slipEmp?.designation || 'Staff'}</p>
                <p className="text-slate-500 mt-1">Disbursed on: {formatDate(selectedSlip.paidAt)}</p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2 border-b pb-1">Earnings</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Basic Salary</span>
                    <span>{formatCurrency(selectedSlip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>House Rent Allowance (HRA)</span>
                    <span>{formatCurrency(selectedSlip.hra)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Transport Allowance</span>
                    <span>{formatCurrency(selectedSlip.transportAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Medical Allowance</span>
                    <span>{formatCurrency(selectedSlip.medicalAllowance)}</span>
                  </div>
                  {selectedSlip.bonus > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Performance Bonus</span>
                      <span>{formatCurrency(selectedSlip.bonus)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2 border-b pb-1">Deductions</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Income Tax (TDS)</span>
                    <span className="text-red-500">-{formatCurrency(selectedSlip.taxDeduction)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Provident Fund (PF)</span>
                    <span className="text-red-500">-{formatCurrency(selectedSlip.pfDeduction)}</span>
                  </div>
                  {selectedSlip.otherDeductions > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Other Deductions</span>
                      <span className="text-red-500">-{formatCurrency(selectedSlip.otherDeductions)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Net */}
            <div className="border-t border-slate-200 pt-4 flex justify-between items-center bg-blue-50/50 p-4 rounded-xl">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Net Salary Paid</span>
                <span className="text-xs text-slate-400">Direct Deposit via Corporate Payroll</span>
              </div>
              <div className="text-2xl font-black text-blue-700">
                {formatCurrency(selectedSlip.netSalary)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payroll;
