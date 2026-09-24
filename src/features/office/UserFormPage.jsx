import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { TextInput, PasswordInput, PhoneInput, Textarea } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Save, ArrowLeft, User, KeyRound, ShieldCheck } from 'lucide-react';

export const UserFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    department: 'Engineering & Operations',
    designation: 'Director (EIR)',
    role: 'Super Admin',
    password: '',
    confirmPassword: '',
    status: 'Active',
    notes: '',
  });

  const [changePassword, setChangePassword] = useState(!isEditing);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [depts, des, r, allUsers] = await Promise.all([
          mockApi.getDepartments(),
          mockApi.getDesignations(),
          mockApi.getRoles(),
          mockApi.getOfficeUsers(),
        ]);
        setDepartments(depts);
        setDesignations(des);
        setRoles(r);

        if (isEditing) {
          const user = allUsers.find((u) => u.id === id);
          if (user) {
            setFormState({
              fullName: user.fullName,
              email: user.email,
              username: user.username,
              phone: user.phone,
              department: user.department,
              designation: user.designation,
              role: user.role,
              password: '',
              confirmPassword: '',
              status: user.status,
              notes: 'Authorized operational account.',
            });
          }
        }
      } catch (err) {
        addToast('Failed to load form dependencies.', 'error');
      }
    };
    loadDependencies();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.fullName.trim() || !formState.email.trim() || !formState.username.trim()) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    if (changePassword) {
      if (!formState.password || formState.password.length < 6) {
        addToast('Password must be at least 6 characters long.', 'error');
        return;
      }
      if (formState.password !== formState.confirmPassword) {
        addToast('Password confirmation does not match.', 'error');
        return;
      }
    }

    try {
      setIsLoading(true);
      await mockApi.saveOfficeUser({
        id: isEditing ? id : undefined,
        ...formState,
      });
      addToast(
        isEditing
          ? `Officer account for ${formState.fullName} updated.`
          : `New officer account for ${formState.fullName} created.`,
        'success'
      );
      navigate('/office/users');
    } catch (err) {
      addToast('Failed to save user account.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Officer Account' : 'Create New Officer'}
        description={
          isEditing
            ? `Update portal credentials and administrative privileges for ${formState.fullName || 'Officer'}.`
            : 'Provision a new BTRC administrative account with assigned roles and department scopes.'
        }
        breadcrumbs={[
          { label: 'Office' },
          { label: 'User', href: '/office/users' },
          { label: isEditing ? 'Edit User' : 'New User' }
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/office/users')}
          >
            Back to User Directory
          </Button>
        }
      />

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity & Contact Details */}
          <Card title="Personnel & Contact Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Full Name (Official)"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  placeholder="e.g. Engr. Md. Shakil Ahmed"
                  required
                />

                <TextInput
                  label="Official Email Address"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="e.g. shakil.ahmed@btrc.gov.bd"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="System Username"
                  value={formState.username}
                  onChange={(e) => setFormState({ ...formState, username: e.target.value.toLowerCase().replace(/\s+/g, '.') })}
                  placeholder="e.g. shakil.btrc"
                  helperText="Unique login identifier"
                  required
                />

                <PhoneInput
                  label="Official Contact Phone"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  placeholder="+880 1711-XXXXXX"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Department Placement & Access Roles */}
          <Card title="Organizational Assignment & Security Role">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  value={formState.department}
                  onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                  options={departments.map((d) => d.name)}
                  required
                />

                <Select
                  label="Official Designation"
                  value={formState.designation}
                  onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                  options={designations.map((d) => d.title)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Assigned Security Role"
                  value={formState.role}
                  onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                  options={roles.map((r) => r.name)}
                  required
                />

                <Select
                  label="Account Status"
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  options={['Active', 'Inactive', 'Suspended']}
                  required
                />
              </div>

              <Textarea
                label="Administrative Notes"
                value={formState.notes}
                onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                placeholder="Office location, desk extension, and clearance notes..."
                rows={2}
              />
            </div>
          </Card>

          {/* Security & Password Settings */}
          <Card title="Portal Authentication Credentials">
            <div className="space-y-4">
              {isEditing && (
                <div className="pb-2 border-b border-[#E2E5F0]">
                  <Checkbox
                    label="Reset / Change Officer Password"
                    description="Check to set a new password for this administrative user"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                  />
                </div>
              )}

              {changePassword && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Account Password"
                    value={formState.password}
                    onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                    placeholder="••••••••"
                    required={changePassword}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    value={formState.confirmPassword}
                    onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required={changePassword}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/office/users')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              isLoading={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Create Officer Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
