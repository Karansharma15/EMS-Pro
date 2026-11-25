import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Clock, Calendar, CheckSquare, 
  TrendingUp, Award, AlertCircle, ArrowUpRight, ArrowRight,
  ChevronRight, LogIn, LogOut, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAttendanceStore from '../../store/attendanceStore';
import useLeaveStore from '../../store/leaveStore';
import useEmployeeStore from '../../store/employeeStore';
import useTaskStore from '../../store/taskStore';
import { useToast } from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { formatDate, formatCurrency } from '../../utils/helpers';

const attendanceTrendData = [
  { month: 'Jun', present: 92, absent: 8, late: 5 },
  { month: 'Jul', present: 88, absent: 12, late: 7 },
  { month: 'Aug', present: 95, absent: 5, late: 4 },
  { month: 'Sep', present: 90, absent: 10, late: 6 },
  { month: 'Oct', present: 93, absent: 7, late: 3 },
  { month: 'Nov', present: 96, absent: 4, late: 2 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const { attendance, checkIn, checkOut, load: loadAttendance } = useAttendanceStore();
  const { leaves, balances, load: loadLeaves, approveLeave, rejectLeave } = useLeaveStore();
  const { employees, load: loadEmployees } = useEmployeeStore();
  const { tasks, load: loadTasks } = useTaskStore();

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadAttendance();
    loadLeaves();
    loadEmployees();
    loadTasks();
    const depts = JSON.parse(localStorage.getItem('ems_departments') || '[]');
    setDepartments(depts);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const isEmployee = user?.role === 'Employee';
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  // Stats calculation
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const leavesToday = leaves.filter(l => l.status === 'Approved' && l.from <= todayStr && l.to >= todayStr).length;

  // Department Distribution
  const deptData = departments.map(d => ({
    name: d.name,
    count: employees.filter(e => e.departmentId === d.id).length
  }));

  // Employee Status Distribution
  const statusCounts = [
    { name: 'Active', value: employees.filter(e => e.status === 'Active').length, color: '#10b981' },
    { name: 'Inactive', value: employees.filter(e => e.status === 'Inactive').length, color: '#f59e0b' },
    { name: 'Resigned', value: employees.filter(e => e.status === 'Resigned').length, color: '#ef4444' }
  ].filter(s => s.value > 0);

  // Current Employee Data (if role is Employee or has employeeId)
  const currentEmpId = user?.employeeId || employees.find(e => e.email === user?.email)?.id;
  const myTodayAtt = attendance.find(a => a.employeeId === currentEmpId && a.date === todayStr);
  const myBalance = balances.find(b => b.employeeId === currentEmpId) || { casualLeave: 10, sickLeave: 7, paidLeave: 15, usedCasual: 1, usedSick: 0, usedPaid: 2 };
  const myTasks = tasks.filter(t => t.assignedTo === currentEmpId);
  const myLeaves = leaves.filter(l => l.employeeId === currentEmpId);

  const handleQuickCheckIn = () => {
    if (!currentEmpId) {
      addToast('No employee record linked to your user account.', 'error');
      return;
    }
    const res = checkIn(currentEmpId);
    if (res.success) {
      addToast('Check-in recorded successfully!', 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  const handleQuickCheckOut = () => {
    if (!currentEmpId) {
      addToast('No employee record linked to your user account.', 'error');
      return;
    }
    const res = checkOut(currentEmpId);
    if (res.success) {
      addToast('Check-out recorded successfully! Have a great day.', 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            {user?.role} Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            {isAdminOrHR 
              ? 'Here is an overview of company workforce, real-time attendance, and pending operations.'
              : 'Track your daily check-ins, tasks, leave approvals, and personal payroll right here.'}
          </p>
        </div>

        {/* Quick Check-in/out Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col sm:flex-row items-center gap-3">
          <div className="text-left">
            <p className="text-xs text-blue-200">Today: {formatDate(new Date(), 'EEEE, MMM dd')}</p>
            <p className="text-sm font-semibold">
              Status: {myTodayAtt ? (myTodayAtt.checkOut ? 'Checked Out' : 'Checked In') : 'Not Checked In'}
            </p>
          </div>
          <div className="flex gap-2">
            {!myTodayAtt?.checkIn ? (
              <Button size="sm" variant="success" onClick={handleQuickCheckIn} icon={<LogIn className="w-4 h-4" />}>
                Check In
              </Button>
            ) : !myTodayAtt?.checkOut ? (
              <Button size="sm" variant="danger" onClick={handleQuickCheckOut} icon={<LogOut className="w-4 h-4" />}>
                Check Out
              </Button>
            ) : (
              <span className="text-xs bg-emerald-500/20 text-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-400/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {isAdminOrHR ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Workforce"
            value={totalEmployees}
            subtitle={`${activeEmployees} active employees`}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
            change="+4.5%"
            changeType="up"
          />
          <StatCard
            title="Present Today"
            value={presentToday}
            subtitle={`${Math.round((presentToday / (totalEmployees || 1)) * 100)}% attendance rate`}
            icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
            iconBg="bg-emerald-100"
            change="+2.1%"
            changeType="up"
          />
          <StatCard
            title="On Leave Today"
            value={leavesToday}
            subtitle="Approved leave requests"
            icon={<Calendar className="w-6 h-6 text-amber-600" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            title="Departments"
            value={departments.length}
            subtitle="Operational divisions"
            icon={<Award className="w-6 h-6 text-indigo-600" />}
            iconBg="bg-indigo-100"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Assigned Tasks"
            value={myTasks.length}
            subtitle={`${myTasks.filter(t => t.status === 'Completed').length} completed`}
            icon={<CheckSquare className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Casual Leave Balance"
            value={(myBalance.casualLeave - myBalance.usedCasual) || 0}
            subtitle={`Used: ${myBalance.usedCasual} of ${myBalance.casualLeave}`}
            icon={<Calendar className="w-6 h-6 text-emerald-600" />}
            iconBg="bg-emerald-100"
          />
          <StatCard
            title="Sick Leave Balance"
            value={(myBalance.sickLeave - myBalance.usedSick) || 0}
            subtitle={`Used: ${myBalance.usedSick} of ${myBalance.sickLeave}`}
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            title="Today's Hours"
            value={myTodayAtt?.workingHours ? `${myTodayAtt.workingHours}h` : '--'}
            subtitle={myTodayAtt?.checkIn ? `In at ${myTodayAtt.checkIn}` : 'Not started'}
            icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
            iconBg="bg-indigo-100"
          />
        </div>
      )}

      {/* Admin / HR Charts & Management Sections */}
      {isAdminOrHR && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Attendance Trends (Last 6 Months)</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Percentage of staff present vs late arrivals</p>
              </div>
              <Button size="xs" variant="outline" onClick={() => navigate('/attendance')}>
                Full Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend />
                    <Area type="monotone" dataKey="present" name="Present %" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPresent)" />
                    <Area type="monotone" dataKey="late" name="Late %" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Employee Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Distribution</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Breakdown by current employment status</p>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {statusCounts.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Staffing */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Department Headcount</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Number of active employees by division</p>
              </div>
              <Button size="xs" variant="outline" onClick={() => navigate('/departments')}>
                Manage
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="count" name="Employees" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Approvals</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Requests requiring action</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaves.filter(l => l.status === 'Pending').length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No pending leaves to review.</p>
              ) : (
                leaves.filter(l => l.status === 'Pending').slice(0, 4).map((l) => {
                  const emp = employees.find(e => e.id === l.employeeId);
                  return (
                    <div key={l.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={emp?.name} size="xs" />
                          <span className="text-xs font-semibold text-slate-800">{emp?.name || 'Employee'}</span>
                        </div>
                        <Badge status="Pending">Pending</Badge>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{l.type} ({l.days} days)</span>
                        <span>{formatDate(l.from, 'MMM d')} - {formatDate(l.to, 'MMM d')}</span>
                      </div>
                      <div className="flex gap-2 pt-1 border-t border-slate-200">
                        <Button 
                          size="xs" 
                          variant="success" 
                          fullWidth 
                          onClick={() => {
                            approveLeave(l.id, user?.id);
                            addToast('Leave approved successfully', 'success');
                          }}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="xs" 
                          variant="danger" 
                          fullWidth 
                          onClick={() => {
                            rejectLeave(l.id, user?.id, 'Rejected by Admin');
                            addToast('Leave request rejected', 'warning');
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
              <Button size="sm" variant="ghost" fullWidth onClick={() => navigate('/leaves')}>
                View All Leaves <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Personal Dashboard Sections */}
      {!isAdminOrHR && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Tasks</CardTitle>
              <Button size="xs" variant="outline" onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {myTasks.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No tasks currently assigned.</p>
              ) : (
                myTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-800">{task.title}</p>
                      <p className="text-xs text-slate-500">Deadline: {formatDate(task.deadline)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={task.priority}>{task.priority}</Badge>
                      <Badge status={task.status}>{task.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* My Leave Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Recent Leave Applications</CardTitle>
              <Button size="xs" variant="primary" onClick={() => navigate('/leaves')}>
                Apply Leave
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {myLeaves.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">No leave applications yet.</p>
              ) : (
                myLeaves.slice(0, 5).map(leave => (
                  <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-800">{leave.type}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(leave.from)} - {formatDate(leave.to)} ({leave.days} {leave.days === 1 ? 'day' : 'days'})
                      </p>
                    </div>
                    <Badge status={leave.status}>{leave.status}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
