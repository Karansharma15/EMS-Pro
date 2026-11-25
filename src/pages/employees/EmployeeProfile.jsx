import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, 
  DollarSign, FileText, Upload, Trash2, Download, CheckCircle, 
  Clock, ShieldAlert, Award, User, AlertCircle
} from 'lucide-react';
import useEmployeeStore from '../../store/employeeStore';
import useDepartmentStore from '../../store/departmentStore';
import useAttendanceStore from '../../store/attendanceStore';
import useLeaveStore from '../../store/leaveStore';
import usePayrollStore from '../../store/payrollStore';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import { formatDate, formatCurrency } from '../../utils/helpers';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const { employees, load: loadEmployees, updateEmployee, uploadDocument, deleteDocument } = useEmployeeStore();
  const { departments, load: loadDepartments } = useDepartmentStore();
  const { attendance, load: loadAttendance } = useAttendanceStore();
  const { leaves, load: loadLeaves } = useLeaveStore();
  const { payroll, load: loadPayroll } = usePayrollStore();
  const { tasks, load: loadTasks } = useTaskStore();

  const [activeTab, setActiveTab] = useState('personal');
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Offer Letter');

  useEffect(() => {
    loadEmployees();
    loadDepartments();
    loadAttendance();
    loadLeaves();
    loadPayroll();
    loadTasks();
  }, []);

  const employee = employees.find(e => e.id === id);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">Employee Not Found</h3>
        <p className="text-sm text-slate-400 mt-1 mb-4">The requested employee record does not exist or was deleted.</p>
        <Button variant="secondary" onClick={() => navigate('/employees')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const dept = departments.find(d => d.id === employee.departmentId);
  const empAttendance = attendance.filter(a => a.employeeId === employee.id);
  const empLeaves = leaves.filter(l => l.employeeId === employee.id);
  const empPayroll = payroll.filter(p => p.employeeId === employee.id);
  const empTasks = tasks.filter(t => t.assignedTo === employee.id);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateEmployee(employee.id, { avatar: reader.result });
        addToast('Profile picture updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!docName) return;
    uploadDocument(employee.id, {
      title: docName,
      type: docType,
      fileName: `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    });
    addToast('Document attached to employee profile.', 'success');
    setDocModalOpen(false);
    setDocName('');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'documents', label: `Documents (${employee.documents?.length || 0})` },
    { id: 'attendance', label: `Attendance (${empAttendance.length})` },
    { id: 'leaves', label: `Leaves (${empLeaves.length})` },
    { id: 'payroll', label: `Payroll (${empPayroll.length})` },
    { id: 'tasks', label: `Tasks (${empTasks.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/employees')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-slate-500">Back to Employees</span>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar name={employee.name} src={employee.avatar} size="2xl" />
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Upload className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800">{employee.name}</h1>
                <Badge status={employee.status}>{employee.status}</Badge>
              </div>
              <p className="text-blue-600 font-medium text-sm mt-0.5">{employee.designation}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> {dept?.name || 'Department'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined {formatDate(employee.joiningDate)}
                </span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {employee.employeeId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center sm:text-right min-w-36">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Annual Salary</span>
              <span className="text-lg font-bold text-slate-800">{formatCurrency(employee.salary)}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Work Email</span>
                    <span className="text-sm font-medium text-slate-700">{employee.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Phone Number</span>
                    <span className="text-sm font-medium text-slate-700">{employee.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Address</span>
                    <span className="text-sm font-medium text-slate-700">{employee.address || 'Not specified'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Employment Type</span>
                    <span className="text-sm font-medium text-slate-700">{employee.employmentType || 'Full-time'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Contact Name</span>
                    <span className="text-sm font-medium text-slate-700">
                      {employee.emergencyContact?.name || 'Not provided'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Relationship</span>
                    <span className="text-sm font-medium text-slate-700">
                      {employee.emergencyContact?.relation || 'Not provided'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Emergency Phone</span>
                    <span className="text-sm font-medium text-slate-700">
                      {employee.emergencyContact?.phone || 'Not provided'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Employee Documents</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Contracts, ID proofs, and certifications</p>
              </div>
              <Button size="sm" variant="primary" icon={<Upload className="w-4 h-4" />} onClick={() => setDocModalOpen(true)}>
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              {!employee.documents || employee.documents.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  No documents uploaded for this employee yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employee.documents.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="w-8 h-8 text-blue-500 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{doc.title}</p>
                          <span className="text-xs text-slate-400 block">{doc.type} • {doc.size || '1.2 MB'}</span>
                          <span className="text-xs text-slate-400 block mt-1">Uploaded {formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => addToast(`Downloading ${doc.title}...`, 'info')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDocument(employee.id, doc.id)}
                          className="p-1 hover:bg-slate-200 rounded text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Log</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={empAttendance}
                columns={[
                  { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                  { key: 'checkIn', label: 'Check In', render: (val) => val || '--' },
                  { key: 'checkOut', label: 'Check Out', render: (val) => val || '--' },
                  { key: 'workingHours', label: 'Hours', render: (val) => `${val || 0} hrs` },
                  { key: 'status', label: 'Status', render: (val) => <Badge status={val}>{val}</Badge> }
                ]}
                pageSize={6}
                emptyMessage="No attendance records found."
              />
            </CardContent>
          </Card>
        )}

        {/* Leaves Tab */}
        {activeTab === 'leaves' && (
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={empLeaves}
                columns={[
                  { key: 'type', label: 'Type' },
                  { key: 'from', label: 'From Date', render: (val) => formatDate(val) },
                  { key: 'to', label: 'To Date', render: (val) => formatDate(val) },
                  { key: 'days', label: 'Days' },
                  { key: 'reason', label: 'Reason' },
                  { key: 'status', label: 'Status', render: (val) => <Badge status={val}>{val}</Badge> }
                ]}
                pageSize={6}
                emptyMessage="No leave records found."
              />
            </CardContent>
          </Card>
        )}

        {/* Payroll Tab */}
        {activeTab === 'payroll' && (
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={empPayroll}
                columns={[
                  { key: 'month', label: 'Month' },
                  { key: 'basicSalary', label: 'Basic Salary', render: (val) => formatCurrency(val) },
                  { key: 'netSalary', label: 'Net Paid', render: (val) => <span className="font-semibold text-emerald-600">{formatCurrency(val)}</span> },
                  { key: 'status', label: 'Status', render: (val) => <Badge status={val}>{val}</Badge> },
                  { 
                    key: 'actions', 
                    label: 'Salary Slip', 
                    render: (_, row) => (
                      <Button size="xs" variant="outline" onClick={() => addToast(`Opening Slip for ${row.month}`, 'info')}>
                        View Slip
                      </Button>
                    ) 
                  }
                ]}
                pageSize={6}
                emptyMessage="No payroll records generated yet."
              />
            </CardContent>
          </Card>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={empTasks}
                columns={[
                  { key: 'title', label: 'Task Title' },
                  { key: 'priority', label: 'Priority', render: (val) => <Badge status={val}>{val}</Badge> },
                  { key: 'status', label: 'Status', render: (val) => <Badge status={val}>{val}</Badge> },
                  { key: 'deadline', label: 'Deadline', render: (val) => formatDate(val) }
                ]}
                pageSize={6}
                emptyMessage="No tasks currently assigned."
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Document Modal */}
      <Modal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="Upload Employee Document"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDocModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddDoc}>Upload Document</Button>
          </div>
        }
      >
        <form onSubmit={handleAddDoc} className="space-y-4">
          <Input
            label="Document Title"
            required
            placeholder="e.g. Employment Contract 2024"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
          <Select
            label="Document Category"
            options={[
              { label: 'Offer Letter', value: 'Offer Letter' },
              { label: 'Employment Contract', value: 'Employment Contract' },
              { label: 'ID Proof / Passport', value: 'ID Proof' },
              { label: 'Experience Certificate', value: 'Experience Certificate' },
              { label: 'Other Document', value: 'Other' },
            ]}
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          />
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">Click to browse or drag and drop file here</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PNG up to 10MB</p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeProfile;
