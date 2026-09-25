import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
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

  const columns = [
    {
      key: 'name',
      title: 'Role Name',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#028A97]/10 text-[#028A97] flex items-center justify-center font-bold text-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-[#202338] text-sm">{val}</p>
            {row.description && (
              <p className="text-xs text-[#626981] mt-0.5 max-w-md">{row.description}</p>
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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F8FC] text-[#202338] font-mono text-xs font-semibold border border-[#E2E5F0]">
          <KeyRound className="w-3 h-3 text-[#01ADC1]" />
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
            className="text-xs h-7.5 px-2.5"
          >
            Assign permissions
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => handleOpenEdit(row)}
            className="text-xs h-7.5 px-2"
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
        description="Role definitions, administrative scope configurations, and granular capability matrix setup."
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
        count={roles.length}
      >
        <DataTable embedded
                columns={columns}
                data={roles}
                isLoading={isLoading}
              />
      </TablePageWorkspace>

      {/* Create / Edit Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingRole ? 'Edit Role' : 'Create Role'}
        subtitle="Define new operational role designation"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveRole}>
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveRole} className="space-y-4">
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
            placeholder="Describe operational responsibilities and authority bounds..."
            rows={3}
          />
        </form>
      </Modal>

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
