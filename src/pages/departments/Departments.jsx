import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, Users, 
  Briefcase, Calendar, Search, ShieldCheck 
} from 'lucide-react';
import useDepartmentStore from '../../store/departmentStore';
import useEmployeeStore from '../../store/employeeStore';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';

const Departments = () => {
  const { user } = useAuthStore();
  const { departments, load: loadDepartments, addDepartment, updateDepartment, deleteDepartment } = useDepartmentStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  const isAdmin = user?.role === 'Admin';

  const handleOpenAdd = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setManagerId('');
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setName(dept.name || '');
    setDescription(dept.description || '');
    setManagerId(dept.managerId || '');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingDept) {
      updateDepartment(editingDept.id, { name, description, managerId });
      addToast('Department updated successfully!', 'success');
    } else {
      addDepartment({ name, description, managerId });
      addToast('New department created successfully!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteDepartment(deleteId);
      addToast('Department deleted successfully.', 'info');
      setDeleteId(null);
    }
  };

  const empMap = employees.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

  const columns = [
    {
      key: 'name',
      label: 'Department',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 block">{row.name}</span>
            <span className="text-xs text-slate-400 line-clamp-1">{row.description || 'No description provided'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'managerId',
      label: 'Department Head',
      render: (val) => {
        const mgr = empMap[val];
        if (!mgr) return <span className="text-xs text-slate-400 italic">Unassigned</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar name={mgr.name} size="xs" />
            <span className="text-xs font-medium text-slate-700">{mgr.name}</span>
          </div>
        );
      }
    },
    {
      key: 'employeeCount',
      label: 'Staff Count',
      sortable: true,
      render: (_, row) => {
        const count = employees.filter(e => e.departmentId === row.id).length;
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
            <Users className="w-3 h-3 text-slate-400" />
            {count} {count === 1 ? 'member' : 'members'}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      sortable: true,
      render: (val) => <span className="text-xs text-slate-500">{formatDate(val)}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {isAdmin && (
            <>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleOpenEdit(row)}
                title="Edit Department"
              >
                <Edit2 className="w-4 h-4 text-slate-500 hover:text-blue-600" />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setDeleteId(row.id)}
                title="Delete Department"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departments & Divisions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize company units, allocate department heads, and monitor employee allocations.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Department
          </Button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Divisions</p>
            <p className="text-2xl font-bold text-slate-800">{departments.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Assigned Managers</p>
            <p className="text-2xl font-bold text-slate-800">
              {departments.filter(d => d.managerId).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Staff / Dept</p>
            <p className="text-2xl font-bold text-slate-800">
              {departments.length ? Math.round(employees.length / departments.length) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <DataTable
          data={departments}
          columns={columns}
          searchable={true}
          searchKeys={['name', 'description']}
          pageSize={8}
          emptyMessage="No departments found."
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create New Department'}
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingDept ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Department Name"
            required
            placeholder="e.g. Product Engineering"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Description"
            placeholder="Short overview of roles and responsibilities"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            label="Department Head / Manager"
            placeholder="Select a manager (optional)"
            options={[
              { label: 'Unassigned', value: '' },
              ...employees.map(e => ({ label: `${e.name} (${e.designation})`, value: e.id }))
            ]}
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Department"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this department? Employees linked to this department will not be deleted, but will need to be reassigned.
        </p>
      </Modal>
    </div>
  );
};

export default Departments;
