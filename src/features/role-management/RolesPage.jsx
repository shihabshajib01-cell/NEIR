import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { TextInput, Textarea } from '../../components/forms/TextInput.jsx';
import { AssignPermissionModal } from './AssignPermissionModal.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, ShieldCheck, KeyRound, Edit2, Shield } from 'lucide-react';

export const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [parents, setParents] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [serviceActions, setServiceActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [r, p, perms, sa] = await Promise.all([
        mockApi.getRoles(),
        mockApi.getParents(),
        mockApi.getPermissions(),
        mockApi.getServiceActions(),
      ]);
      setRoles(r);
      setParents(p);
      setPermissions(perms);
      setServiceActions(sa);
    } catch (err) {
      addToast('Failed to load roles setup.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setNewRoleName('');
    setNewRoleDesc('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    setNewRoleDesc(role.description || '');
    setIsCreateModalOpen(true);
  };

  const handleOpenAssign = (role) => {
    setSelectedRole(role);
    setIsAssignModalOpen(true);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      addToast('Please enter role name.', 'error');
      return;
    }

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? { ...r, name: newRoleName, description: newRoleDesc }
            : r
        )
      );
      addToast(`Role "${newRoleName}" updated.`, 'success');
    } else {
      const newRole = {
        id: `role-${Date.now().toString().slice(-4)}`,
        name: newRoleName,
        description: newRoleDesc,
        assignedActionsCount: 0,
      };
      setRoles((prev) => [...prev, newRole]);
      addToast(`Role "${newRoleName}" created.`, 'success');
    }
    setIsCreateModalOpen(false);
  };

  const handlePermissionAssigned = (roleId, newCount) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, assignedActionsCount: newCount } : r
      )
    );
  };

  const filteredRoles = roles.filter((role) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      role.name.toLowerCase().includes(query) ||
      String(role.description || '').toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: 'name',
      title: 'Role Name',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[var(--color-info-bg)] text-[var(--color-primary-dark)] flex items-center justify-center font-bold type-meta">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-[var(--color-text-primary)] type-body-sm">{val}</p>
            {row.description && (
              <p className="type-meta text-[var(--color-text-secondary)] mt-0.5 max-w-md">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'assignedActionsCount',
      title: 'Assigned Actions',
      width: '180px',
      isMono: true,
      render: (val) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-background)] text-[var(--color-text-primary)] font-mono type-meta font-semibold border border-[var(--color-border)]">
          <KeyRound className="w-3 h-3 text-[var(--color-primary)]" />
          <p>{val} Actions</p>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Action',
      width: '240px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={KeyRound}
            onClick={() => handleOpenAssign(row)}
            className="type-meta h-7.5 px-2.5"
          >
            Assign permissions
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => handleOpenEdit(row)}
            className="type-meta h-7.5 px-2"
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Roles"
        breadcrumbs={[
          { label: 'Role Management' },
          { label: 'Roles' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Role
          </Button>
        }
      />

      <TablePageWorkspace
        title="Role List"
        count={filteredRoles.length}
        toolbar={
          <FilterBar
            embedded
            searchPlaceholder="Search roles..."
            searchValue={searchTerm}
            searchSuggestions={roles.flatMap((role) => [role.name, role.description]).filter(Boolean)}
            onSearchChange={setSearchTerm}
          />
        }
      >
        <DataTable
          embedded
          columns={columns}
          data={filteredRoles}
          isLoading={isLoading}
          pagination
          onMobileCardClick={handleOpenEdit}
          renderMobileCard={(row) => (
            <MobileRecordCard
              title={row.name}
              subtitle={row.description}
              fields={[
                { label: 'Assigned Actions', value: `${row.assignedActionsCount} actions`, isMono: true },
              ]}
              actions={
                <Button variant="primary" size="sm" icon={KeyRound} onClick={() => handleOpenAssign(row)}>
                  Assign Permissions
                </Button>
              }
            />
          )}
        />
      </TablePageWorkspace>

      {/* Create / Edit Role Drawer */}
      <FormDrawer
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingRole ? 'Edit Role' : 'Create Role'}
        subtitle={editingRole ? editingRole.name : 'Add a new administrative role'}
        formId="role-form"
        onSubmit={handleSaveRole}
        submitLabel={editingRole ? 'Save Changes' : 'Create Role'}
      >
        <FormDrawerSection title="Role Information">
          <div className="space-y-4 pt-1">
            <TextInput
              label="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Regional Affairs Officer"
              required
            />
            <Textarea
              label="Role Description"
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              placeholder="Describe responsibilities..."
              rows={3}
            />
          </div>
        </FormDrawerSection>
      </FormDrawer>

      {/* Assign Permissions Hierarchical Modal */}
      {selectedRole && (
        <AssignPermissionModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedRole(null);
          }}
          role={selectedRole}
          parents={parents}
          permissions={permissions}
          serviceActions={serviceActions}
          onSave={handlePermissionAssigned}
        />
      )}
    </div>
  );
};
