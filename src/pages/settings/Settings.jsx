import { useState, useRef, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  Camera,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check,
  Shield,
  Building2,
  Clock,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/layout/AppLayout';
import { cn, getInitials } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// ─── Helpers ────────────────────────────────────────────────────────────────

const LS_SETTINGS_KEY = 'ems_settings';
const LS_NOTIF_KEY    = 'ems_notifications';

const DEFAULT_SYSTEM = {
  companyName: 'Acme Corporation',
  timezone: 'UTC',
  workStart: '09:00',
  workEnd: '17:00',
};

const DEFAULT_NOTIF = {
  leaveNotifications: true,
  taskNotifications: true,
  attendanceReminders: true,
  payrollNotifications: true,
};

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: '',          color: '' },
    { score: 1, label: 'Very Weak', color: 'bg-red-500' },
    { score: 2, label: 'Weak',      color: 'bg-orange-500' },
    { score: 3, label: 'Fair',      color: 'bg-yellow-500' },
    { score: 4, label: 'Strong',    color: 'bg-blue-500' },
    { score: 5, label: 'Very Strong', color: 'bg-green-500' },
  ];
  return levels[score] ?? levels[levels.length - 1];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PasswordInput({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border px-3 py-2 pr-10 text-sm shadow-sm transition',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
          )}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          checked ? 'bg-blue-600' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

// ─── Tab Panels ──────────────────────────────────────────────────────────────

function ProfileTab({ user, addToast }) {
  const { updateProfile } = useAuthStore();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name:    user?.name    ?? '',
    phone:   user?.phone   ?? '',
    address: user?.address ?? '',
    avatar:  user?.avatar  ?? null,
  });
  const [preview, setPreview] = useState(user?.avatar ?? null);
  const [saving,  setSaving]  = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm(f => ({ ...f, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      addToast({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateProfile({ ...form });
    setSaving(false);
    addToast({ type: 'success', message: 'Profile updated successfully!' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-500 mt-0.5">Update your personal details and profile picture.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-white">
              {getInitials(form.name || 'U')}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition"
          >
            <Camera size={13} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Profile Photo</p>
          <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or GIF. Max 2 MB.</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 text-xs text-blue-600 hover:underline font-medium"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Read-only fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            value={user?.email ?? ''}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <input
            value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Editable fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your full name"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+91-8545545485"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          placeholder="123 Main St, City, Country"
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

function SecurityTab({ addToast }) {
  const { changePassword } = useAuthStore();

  const [form, setForm]     = useState({ current: '', newPwd: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);

  const strength = getPasswordStrength(form.newPwd);

  const validate = () => {
    const e = {};
    if (!form.current)                 e.current = 'Current password is required.';
    if (form.newPwd.length < 8)        e.newPwd  = 'Password must be at least 8 characters.';
    if (form.newPwd !== form.confirm)  e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    await new Promise(r => setTimeout(r, 700));

    const ok = changePassword?.(form.current, form.newPwd);
    setSaving(false);

    if (ok === false) {
      setErrors({ current: 'Current password is incorrect.' });
      addToast({ type: 'error', message: 'Current password is incorrect.' });
    } else {
      setDone(true);
      setForm({ current: '', newPwd: '', confirm: '' });
      setErrors({});
      addToast({ type: 'success', message: 'Password changed successfully!' });
      setTimeout(() => setDone(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500 mt-0.5">Keep your account secure by updating your password regularly.</p>
      </div>

      {/* Info card */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-100 p-4">
        <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Use a strong, unique password with at least 8 characters, including uppercase letters, numbers, and special characters.
        </p>
      </div>

      <div className="space-y-4 max-w-md">
        <PasswordInput
          label="Current Password"
          value={form.current}
          onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
          placeholder="Enter current password"
          error={errors.current}
        />

        <div className="space-y-1">
          <PasswordInput
            label="New Password"
            value={form.newPwd}
            onChange={e => setForm(f => ({ ...f, newPwd: e.target.value }))}
            placeholder="Enter new password (min. 8 chars)"
            error={errors.newPwd}
          />
          {/* Strength bar */}
          {form.newPwd && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-all',
                      i <= strength.score ? strength.color : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
              <p className={cn('text-xs font-medium', {
                'text-red-500':    strength.score <= 1,
                'text-orange-500': strength.score === 2,
                'text-yellow-600': strength.score === 3,
                'text-blue-600':   strength.score === 4,
                'text-green-600':  strength.score === 5,
              })}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm New Password"
          value={form.confirm}
          onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
          placeholder="Re-enter new password"
          error={errors.confirm}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : done ? (
            <Check size={15} />
          ) : (
            <Save size={15} />
          )}
          {saving ? 'Saving…' : done ? 'Saved!' : 'Update Password'}
        </Button>
        {done && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <Check size={14} /> Password updated!
          </span>
        )}
      </div>
    </div>
  );
}

function NotificationsTab({ addToast }) {
  const [notif, setNotif] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_NOTIF_KEY);
      return stored ? { ...DEFAULT_NOTIF, ...JSON.parse(stored) } : DEFAULT_NOTIF;
    } catch {
      return DEFAULT_NOTIF;
    }
  });

  const toggle = (key) => {
    setNotif(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(LS_NOTIF_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSave = () => {
    localStorage.setItem(LS_NOTIF_KEY, JSON.stringify(notif));
    addToast({ type: 'success', message: 'Notification preferences saved!' });
  };

  const items = [
    {
      key: 'leaveNotifications',
      label: 'Leave Notifications',
      description: 'Get notified when leave requests are submitted, approved, or rejected.',
    },
    {
      key: 'taskNotifications',
      label: 'Task Notifications',
      description: 'Receive alerts when tasks are assigned, updated, or completed.',
    },
    {
      key: 'attendanceReminders',
      label: 'Attendance Reminders',
      description: 'Daily reminders for clock-in/out and attendance anomalies.',
    },
    {
      key: 'payrollNotifications',
      label: 'Payroll Notifications',
      description: 'Get notified when payroll is processed or payslips are ready.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-0.5">Control which notifications you receive.</p>
      </div>

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
        {items.map(({ key, label, description }) => (
          <div key={key} className="px-5">
            <Toggle
              checked={notif[key]}
              onChange={() => toggle(key)}
              label={label}
              description={description}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} className="gap-2">
          <Save size={15} />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

function SystemTab({ addToast }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_SETTINGS_KEY);
      return stored ? { ...DEFAULT_SYSTEM, ...JSON.parse(stored) } : DEFAULT_SYSTEM;
    } catch {
      return DEFAULT_SYSTEM;
    }
  });
  const [saving,   setSaving]   = useState(false);

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
    'America/Los_Angeles', 'Europe/London', 'Europe/Paris',
    'Europe/Berlin', 'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney',
  ];

  const handleSave = async () => {
    if (!settings.companyName.trim()) {
      addToast({ type: 'error', message: 'Company name is required.' });
      return;
    }
    if (settings.workStart >= settings.workEnd) {
      addToast({ type: 'error', message: 'Work start time must be before end time.' });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
    setSaving(false);
    addToast({ type: 'success', message: 'System settings saved!' });
  };

  const handleReset = () => {
    setSettings(DEFAULT_SYSTEM);
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(DEFAULT_SYSTEM));
    addToast({ type: 'info', message: 'Settings reset to defaults.' });
  };

  const field = (label, children, hint) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure global settings for the organisation.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        {field(
          'Company Name',
          <input
            value={settings.companyName}
            onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))}
            placeholder="Acme Corporation"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />,
          'Displayed in reports and emails.'
        )}

        {field(
          'Timezone',
          <select
            value={settings.timezone}
            onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        )}

        {field(
          'Work Start Time',
          <input
            type="time"
            value={settings.workStart}
            onChange={e => setSettings(s => ({ ...s, workStart: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />,
          'Default office opening time.'
        )}

        {field(
          'Work End Time',
          <input
            type="time"
            value={settings.workEnd}
            onChange={e => setSettings(s => ({ ...s, workEnd: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />,
          'Default office closing time.'
        )}
      </div>

      {/* Working hours preview */}
      <div className="flex items-center gap-2 max-w-2xl rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
        <Clock size={15} className="text-gray-400 shrink-0" />
        <p className="text-sm text-gray-600">
          Working hours:{' '}
          <span className="font-medium text-gray-800">
            {settings.workStart} – {settings.workEnd}
          </span>{' '}
          ({settings.timezone})
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw size={14} />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User,         adminOnly: false },
  { id: 'security',      label: 'Security',      icon: Lock,         adminOnly: false },
  { id: 'notifications', label: 'Notifications', icon: Bell,         adminOnly: true  },
  { id: 'system',        label: 'System',        icon: SettingsIcon, adminOnly: true  },
];

export default function Settings() {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const isAdmin = user?.role === 'admin';

  const availableTabs = TABS.filter(t => !t.adminOnly || isAdmin);
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id ?? 'profile');

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={22} className="text-blue-600" />
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and system preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ── */}
        <aside className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {availableTabs.map((tab, idx) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left',
                    idx !== 0 && 'border-t border-gray-100',
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    size={16}
                    className={active ? 'text-blue-600' : 'text-gray-400'}
                  />
                  {tab.label}
                  {tab.adminOnly && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User card */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {getInitials(user?.name ?? 'U')}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {activeTab === 'profile'       && <ProfileTab       user={user}  addToast={addToast} />}
            {activeTab === 'security'      && <SecurityTab                   addToast={addToast} />}
            {activeTab === 'notifications' && <NotificationsTab              addToast={addToast} />}
            {activeTab === 'system'        && <SystemTab                     addToast={addToast} />}
          </div>
        </main>
      </div>
    </div>
  );
}
