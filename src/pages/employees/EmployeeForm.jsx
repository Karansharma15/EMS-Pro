import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import useEmployeeStore from '../../store/employeeStore';
import useDepartmentStore from '../../store/departmentStore';
import { DESIGNATIONS } from '../../data/seedData';
import { useToast } from '../../components/layout/AppLayout';

const EmployeeForm = ({ open, onClose, employee = null }) => {
  const { addEmployee, updateEmployee } = useEmployeeStore();
  const { departments, load: loadDepartments } = useDepartmentStore();
  const { addToast } = useToast() || { addToast: () => {} };

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      departmentId: '',
      designation: '',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: '',
      employmentType: 'Full-time',
      status: 'Active',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
    }
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        departmentId: employee.departmentId || '',
        designation: employee.designation || '',
        joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0],
        salary: employee.salary || '',
        employmentType: employee.employmentType || 'Full-time',
        status: employee.status || 'Active',
        emergencyName: employee.emergencyContact?.name || '',
        emergencyRelation: employee.emergencyContact?.relation || '',
        emergencyPhone: employee.emergencyContact?.phone || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        departmentId: departments[0]?.id || '',
        designation: DESIGNATIONS[0] || '',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: '',
        employmentType: 'Full-time',
        status: 'Active',
        emergencyName: '',
        emergencyRelation: '',
        emergencyPhone: '',
      });
    }
  }, [employee, reset, departments]);

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      departmentId: data.departmentId,
      designation: data.designation,
      joiningDate: data.joiningDate,
      salary: Number(data.salary) || 0,
      employmentType: data.employmentType,
      status: data.status,
      emergencyContact: {
        name: data.emergencyName,
        relation: data.emergencyRelation,
        phone: data.emergencyPhone,
      }
    };

    if (employee) {
      const res = updateEmployee(employee.id, payload);
      if (res.success) {
        addToast('Employee details updated successfully!', 'success');
        onClose();
      } else {
        addToast(res.message || 'Failed to update employee', 'error');
      }
    } else {
      const res = addEmployee(payload);
      if (res.success) {
        addToast(`New employee added with ID ${res.employee.employeeId}`, 'success');
        onClose();
      } else {
        addToast('Failed to create employee record', 'error');
      }
    }
  };

  const deptOptions = departments.map(d => ({ label: d.name, value: d.id }));
  const desigOptions = DESIGNATIONS.map(d => ({ label: d, value: d }));
  const empTypeOptions = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Intern', value: 'Intern' },
  ];
  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Resigned', value: 'Resigned' },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={employee ? 'Edit Employee Details' : 'Add New Employee'}
      size="lg"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {employee ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register('name', { required: 'Full name is required' })}
          />
          <Input
            label="Work Email"
            type="email"
            required
            placeholder="e.g. john@company.com"
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            required
            placeholder="+1-555-0100"
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone is required' })}
          />
          <Input
            label="Home / Work Address"
            placeholder="123 Street, City, State"
            {...register('address')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Department"
            required
            options={deptOptions}
            error={errors.departmentId?.message}
            {...register('departmentId', { required: 'Department is required' })}
          />
          <Select
            label="Designation / Role"
            required
            options={desigOptions}
            error={errors.designation?.message}
            {...register('designation', { required: 'Designation is required' })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Joining Date"
            type="date"
            required
            error={errors.joiningDate?.message}
            {...register('joiningDate', { required: 'Joining date is required' })}
          />
          <Select
            label="Employment Type"
            options={empTypeOptions}
            {...register('employmentType')}
          />
          <Input
            label="Annual Salary ($)"
            type="number"
            required
            placeholder="75000"
            error={errors.salary?.message}
            {...register('salary', { required: 'Salary is required' })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Employment Status"
            options={statusOptions}
            {...register('status')}
          />
        </div>

        {/* Emergency Contact */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Emergency Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Contact Name"
              placeholder="e.g. Mary Doe"
              {...register('emergencyName')}
            />
            <Input
              label="Relationship"
              placeholder="Spouse / Parent"
              {...register('emergencyRelation')}
            />
            <Input
              label="Contact Phone"
              placeholder="+1-555-0199"
              {...register('emergencyPhone')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;
