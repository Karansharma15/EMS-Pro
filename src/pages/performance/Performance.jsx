import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Award, Star, CheckSquare, Plus, 
  Calendar, UserCheck, MessageSquare, Target 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import usePerformanceStore from '../../store/performanceStore';
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

const Performance = () => {
  const { user } = useAuthStore();
  const { reviews, load: loadReviews, addReview } = usePerformanceStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Form states
  const [empId, setEmpId] = useState('');
  const [period, setPeriod] = useState('2024-Q3');
  const [rating, setRating] = useState('4.5');
  const [attendanceScore, setAttendanceScore] = useState('92');
  const [taskScore, setTaskScore] = useState('88');
  const [feedback, setFeedback] = useState('');
  const [goals, setGoals] = useState('Deliver architecture redesign, Mentor junior engineers');

  useEffect(() => {
    loadReviews();
    loadEmployees();
  }, []);

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';
  const currentEmpId = user?.employeeId || employees.find(e => e.email === user?.email)?.id;

  const handleOpenAdd = () => {
    setEmpId(employees[0]?.id || '');
    setPeriod('2024-Q3');
    setRating('4.5');
    setAttendanceScore('95');
    setTaskScore('90');
    setFeedback('');
    setGoals('Drive innovation in core modules, Enhance unit test coverage');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!empId) return;

    addReview({
      employeeId: empId,
      reviewerId: user?.id,
      period,
      rating: parseFloat(rating),
      attendance: parseInt(attendanceScore),
      taskCompletion: parseInt(taskScore),
      feedback,
      goals: goals.split(',').map(g => g.trim()),
    });

    addToast('Performance review submitted successfully.', 'success');
    setModalOpen(false);
  };

  const displayReviews = reviews.filter(r => {
    if (!isAdminOrHR && r.employeeId !== currentEmpId) return false;
    return true;
  });

  const empMap = employees.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

  // Chart data: compare employee ratings
  const chartData = reviews.slice(0, 6).map(r => {
    const emp = empMap[r.employeeId];
    return {
      name: emp?.name ? emp.name.split(' ')[0] : 'Staff',
      rating: r.rating,
      attendance: r.attendance,
      tasks: r.taskCompletion
    };
  });

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
              <span className="text-[11px] text-slate-400 font-mono">{emp?.designation || 'Staff'}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'period',
      label: 'Review Period',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val}</span>
    },
    {
      key: 'rating',
      label: 'Overall Rating',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{val} / 5.0</span>
        </div>
      )
    },
    {
      key: 'attendance',
      label: 'Attendance Rate',
      render: (val) => (
        <div className="w-24">
          <div className="flex justify-between text-[11px] mb-1 font-medium text-slate-600">
            <span>{val}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${val}%` }} />
          </div>
        </div>
      )
    },
    {
      key: 'taskCompletion',
      label: 'Task Completion',
      render: (val) => (
        <div className="w-24">
          <div className="flex justify-between text-[11px] mb-1 font-medium text-slate-600">
            <span>{val}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${val}%` }} />
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Feedback',
      render: (_, row) => (
        <Button
          size="xs"
          variant="outline"
          onClick={() => setSelectedReview(row)}
        >
          View Evaluation
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Performance & Appraisals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Conduct 360-degree performance reviews, set quarterly goals, and track appraisals.
          </p>
        </div>

        {isAdminOrHR && (
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Conduct Review
          </Button>
        )}
      </div>

      {/* Analytics Chart */}
      {isAdminOrHR && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Workforce Performance Overview (Current Period)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="tasks" name="Task Completion %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance %" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <DataTable
          data={displayReviews}
          columns={columns}
          searchable={false}
          pageSize={8}
          emptyMessage="No performance reviews recorded yet."
        />
      </div>

      {/* Conduct Review Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Conduct Employee Performance Review"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save Appraisal</Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Employee"
            required
            options={employees.map(e => ({ label: `${e.name} (${e.designation})`, value: e.id }))}
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Evaluation Period"
              placeholder="e.g. 2024-Q3"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <Input
              label="Overall Rating (1.0 - 5.0)"
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Attendance Score (%)"
              type="number"
              min="0"
              max="100"
              value={attendanceScore}
              onChange={(e) => setAttendanceScore(e.target.value)}
            />
            <Input
              label="Task Completion (%)"
              type="number"
              min="0"
              max="100"
              value={taskScore}
              onChange={(e) => setTaskScore(e.target.value)}
            />
          </div>

          <Input
            label="Appraisal Feedback & Notes"
            placeholder="Key strengths, areas for improvement, project accomplishments..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <Input
            label="Key Development Goals (comma separated)"
            placeholder="e.g. Master React 18, Lead sprint planning, Mentor junior staff"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </form>
      </Modal>

      {/* Review Detail Modal */}
      <Modal
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Appraisal Summary"
        size="md"
        footer={
          <Button variant="primary" onClick={() => setSelectedReview(null)}>Close</Button>
        }
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-800">{empMap[selectedReview.employeeId]?.name}</h3>
                <p className="text-xs text-slate-400">Review Period: {selectedReview.period}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 text-sm">{selectedReview.rating} / 5.0</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Attendance Punctuality:</span>
                <span className="font-bold text-emerald-600">{selectedReview.attendance}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Task Delivery Rate:</span>
                <span className="font-bold text-blue-600">{selectedReview.taskCompletion}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Feedback</h4>
              <p className="text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg">
                {selectedReview.feedback || 'Consistent high quality execution and teamwork.'}
              </p>
            </div>

            {selectedReview.goals && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReview.goals.map((g, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                      ✓ {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Performance;
