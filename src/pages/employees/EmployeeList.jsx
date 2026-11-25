import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Eye, Edit2, Trash2, 
  Building2, Mail, Phone, Calendar, Download, UserCheck
} from 'lucide-react';
import useEmployeeStore from '../../store/employeeStore';
import useDepartmentStore from '../../store/departmentStore';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmployeeForm from './EmployeeForm';
import { formatDate, formatCurrency } from '../../utils/helpers';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { employees, load: loadEmployees, deleteEmployee } = useEmployeeStore();
  const { departments, load: loadDepartments } = useDepartmentStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Filters
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const filteredEmployees = employees.filter(emp => {
    if (selectedDept && emp.departmentId !== selectedDept) return false;
    if (selectedStatus && emp.status !== selectedStatus) return false;
    return true;
  });

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteEmployee(deleteId);
      addToast('Employee record deleted permanently.', 'info');
      setDeleteId(null);
    }
  };

  const deptMap = departments.reduce((acc, d) => ({ ...acc, [d.id]: d.name }), {});

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.avatar} size="sm" />
          <div>
            <span 
              onClick={() => navigate(`/employees/${row.id}`)}
              className="font-medium text-slate-800 hover:text-blue-600 cursor-pointer block"
            >
              {row.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">{row.employeeId}</span>
          </div>
        </div>
      )
    },
    {
      key: 'departmentId',
      label: 'Department',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {deptMap[val] || 'General'}
        </span>
      )
    },
    {
      key: 'designation',
      label: 'Designation',
      sortable: true,
      render: (val) => <span className="text-xs font-medium text-slate-700">{val}</span>
    },
    {
      key: 'email',
      label: 'Contact',
      render: (_, row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1 text-slate-600">
            <Mail className="w-3 h-3 text-slate-400" /> {row.email}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Phone className="w-3 h-3 text-slate-400" /> {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'joiningDate',
      label: 'Joined',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-slate-500">{formatDate(val)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            size="xs"
            variant="ghost"
            title="View Profile"
            onClick={() => navigate(`/employees/${row.id}`)}
          >
            <Eye className="w-4 h-4 text-slate-500 hover:text-blue-600" />
          </Button>

          {isAdminOrHR && (
            <>
              <Button
                size="xs"
                variant="ghost"
                title="Edit Employee"
                onClick={() => {
                  setSelectedEmp(row);
                  setFormOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4 text-slate-500 hover:text-amber-600" />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                title="Delete Employee"
                onClick={() => setDeleteId(row.id)}
              >
                <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your company workforce, view profile details, and track employment records.
          </p>
        </div>

        {isAdminOrHR && (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setSelectedEmp(null);
                setFormOpen(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Employee
            </Button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="w-48">
          <Select
            placeholder="All Departments"
            options={[{ label: 'All Departments', value: '' }, ...departments.map(d => ({ label: d.name, value: d.id }))]}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          />
        </div>

        <div className="w-44">
          <Select
            placeholder="All Statuses"
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
              { label: 'Resigned', value: 'Resigned' }
            ]}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          />
        </div>

        {(selectedDept || selectedStatus) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedDept('');
              setSelectedStatus('');
            }}
          >
            Clear Filters
          </Button>
        )}

        <div className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-blue-600 font-semibold">{filteredEmployees.length}</span> of {employees.length} employees
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <DataTable
          data={filteredEmployees}
          columns={columns}
          searchable={true}
          searchKeys={['name', 'employeeId', 'email', 'designation']}
          pageSize={8}
          emptyMessage="No employees found matching the current criteria."
        />
      </div>

      {/* Add / Edit Modal */}
      {formOpen && (
        <EmployeeForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setSelectedEmp(null);
          }}
          employee={selectedEmp}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete Record</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this employee? This action cannot be undone and will permanently remove their profile data.
        </p>
      </Modal>
    </div>
  );
};

export default EmployeeList;
