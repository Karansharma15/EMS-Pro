import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Clock, AlertCircle, 
  Calendar, User, Edit2, Trash2, ArrowRight, LayoutGrid, List
} from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import useEmployeeStore from '../../store/employeeStore';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import { formatDate } from '../../utils/helpers';

const Tasks = () => {
  const { user } = useAuthStore();
  const { tasks, load: loadTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadTasks();
    loadEmployees();
  }, []);

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';
  const currentEmpId = user?.employeeId || employees.find(e => e.email === user?.email)?.id;

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setAssignedTo(employees[0]?.id || '');
    setPriority('Medium');
    setStatus('Pending');
    setDeadline(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setAssignedTo(task.assignedTo || '');
    setPriority(task.priority || 'Medium');
    setStatus(task.status || 'Pending');
    setDeadline(task.deadline || new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        assignedTo,
        priority,
        status,
        deadline,
      });
      addToast('Task updated successfully!', 'success');
    } else {
      addTask({
        title,
        description,
        assignedTo,
        priority,
        status,
        deadline,
        assignedBy: user?.id,
      });
      addToast('New task assigned successfully!', 'success');
    }
    setModalOpen(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    addToast(`Task moved to ${newStatus}`, 'info');
  };

  const visibleTasks = tasks.filter(t => {
    if (!isAdminOrHR && t.assignedTo !== currentEmpId) return false;
    return true;
  });

  const empMap = employees.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

  const columns = [
    {
      key: 'title',
      label: 'Task',
      render: (_, row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{row.title}</span>
          <span className="text-[11px] text-slate-400 line-clamp-1">{row.description}</span>
        </div>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assignee',
      render: (val) => {
        const emp = empMap[val];
        return (
          <div className="flex items-center gap-2">
            <Avatar name={emp?.name} size="xs" />
            <span className="text-xs text-slate-700 font-medium">{emp?.name || 'Unassigned'}</span>
          </div>
        );
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      key: 'deadline',
      label: 'Due Date',
      render: (val) => <span className="text-xs text-slate-500">{formatDate(val)}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button size="xs" variant="ghost" onClick={() => handleOpenEdit(row)}>
            <Edit2 className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />
          </Button>
          {isAdminOrHR && (
            <Button size="xs" variant="ghost" onClick={() => deleteTask(row.id)}>
              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const kanbanStages = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Delegate responsibilities, monitor progress milestones, and manage workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
          </div>

          {isAdminOrHR && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAdd}
            >
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kanbanStages.map((stage) => {
            const stageTasks = visibleTasks.filter(t => t.status === stage);
            return (
              <div key={stage} className="bg-slate-100/70 rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] border border-slate-200">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      stage === 'Pending' ? 'bg-amber-400' : stage === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />
                    <h3 className="font-bold text-slate-700 text-sm">{stage}</h3>
                  </div>
                  <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                    {stageTasks.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {stageTasks.map((task) => {
                    const assignee = empMap[task.assignedTo];
                    return (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-800 text-sm leading-snug">{task.title}</h4>
                          <Badge status={task.priority}>{task.priority}</Badge>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Avatar name={assignee?.name} size="xs" />
                            <span className="text-slate-600 font-medium">{assignee?.name?.split(' ')[0] || 'Staff'}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {formatDate(task.deadline, 'MMM dd')}
                          </span>
                        </div>

                        {/* Move stage actions */}
                        <div className="flex items-center justify-end gap-1 pt-1">
                          {stage !== 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(task.id, stage === 'Completed' ? 'In Progress' : 'Pending')}
                              className="text-[11px] text-slate-400 hover:text-slate-700 px-2 py-1 bg-slate-50 rounded"
                            >
                              ← Move Back
                            </button>
                          )}
                          {stage !== 'Completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, stage === 'Pending' ? 'In Progress' : 'Completed')}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {stageTasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <DataTable
            data={visibleTasks}
            columns={columns}
            searchable={true}
            searchKeys={['title', 'description']}
            pageSize={8}
            emptyMessage="No tasks found."
          />
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task Assignment' : 'Create & Assign Task'}
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingTask ? 'Save Changes' : 'Assign Task'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            required
            placeholder="e.g. Implement OAuth integration"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Description"
            placeholder="Details, acceptance criteria, or links"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Employee"
              options={employees.map(e => ({ label: e.name, value: e.id }))}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />

            <Select
              label="Priority"
              options={[
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
              ]}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Initial Status"
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

            <Input
              label="Deadline"
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
