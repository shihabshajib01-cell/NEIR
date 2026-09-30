import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/overlays/Modal.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import {
  FolderTree,
  KeyRound,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';

export const AssignPermissionModal = ({
  isOpen,
  onClose,
  role,
  parents = [],
  permissions = [],
  serviceActions = [],
  onSave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionIds, setSelectedActionIds] = useState(new Set());
  const [expandedParents, setExpandedParents] = useState(new Set());
  const { addToast } = useToast();

  useEffect(() => {
    if (!role) return;

    const initial = new Set();
    if (role.name === 'Super Admin') {
      serviceActions.forEach((action) => initial.add(action.id));
    } else {
      serviceActions
        .slice(0, Math.min(serviceActions.length, role.assignedActionsCount || 6))
        .forEach((action) => initial.add(action.id));
    }
    setSelectedActionIds(initial);
    setExpandedParents(new Set(parents.map((parent) => parent.id)));
    setSearchTerm('');
  }, [role, serviceActions, parents]);

  const query = searchTerm.trim().toLowerCase();

  const visibleParents = useMemo(() => {
    if (!query) return parents;

    return parents.filter((parent) => {
      if (parent.name.toLowerCase().includes(query)) return true;
      const parentPermissions = permissions.filter((permission) => permission.parentId === parent.id);
      return parentPermissions.some((permission) => {
        if (
          permission.name.toLowerCase().includes(query) ||
          String(permission.path || '').toLowerCase().includes(query)
        ) return true;

        return serviceActions.some((action) =>
          action.permissionId === permission.id &&
          (
            action.name.toLowerCase().includes(query) ||
            String(action.path || '').toLowerCase().includes(query) ||
            String(action.method || '').toLowerCase().includes(query)
          )
        );
      });
    });
  }, [parents, permissions, serviceActions, query]);

  if (!role) return null;

  const toggleParentExpand = (parentId) => {
    setExpandedParents((previous) => {
      const next = new Set(previous);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  const handleToggleAction = (actionId) => {
    setSelectedActionIds((previous) => {
      const next = new Set(previous);
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return next;
    });
  };

  const handleSelectAllInParent = (parentId, select = true) => {
    const permissionIds = permissions
      .filter((permission) => permission.parentId === parentId)
      .map((permission) => permission.id);
    const actionIds = serviceActions
      .filter((action) => permissionIds.includes(action.permissionId))
      .map((action) => action.id);

    setSelectedActionIds((previous) => {
      const next = new Set(previous);
      actionIds.forEach((id) => {
        if (select) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const handleSave = () => {
    onSave?.(role.id, selectedActionIds.size);
    addToast(`Updated permissions for ${role.name} (${selectedActionIds.size} service actions assigned).`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Permissions — ${role.name}`}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex flex-col gap-2.5 w-full md:flex-row md:items-center md:justify-between">
          <p className="type-meta text-[var(--color-text-secondary)] font-medium">
            <strong className="font-mono font-semibold text-[var(--color-primary-dark)]">{selectedActionIds.size}</strong> of{' '}
            <strong className="font-mono font-semibold text-[var(--color-text-primary)]">{serviceActions.length}</strong> actions selected
          </p>
          <div className="flex items-center gap-2 w-full md:w-auto max-md:flex-col-reverse max-md:[&>button]:w-full">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save Permissions</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="table-filter-bar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex-1 min-w-0">
            <TextInput
              density="compact"
              icon={Search}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search permissions..."
              aria-label="Search permissions"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
            <Button
              variant="outline"
              onClick={() => setSelectedActionIds(new Set(serviceActions.map((action) => action.id)))}
              className="w-full sm:w-auto"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedActionIds(new Set())}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden divide-y divide-[var(--color-border)] max-md:max-h-none max-md:overflow-visible md:max-h-[460px] md:overflow-y-auto bg-[var(--color-surface)]">
          {visibleParents.length === 0 ? (
            <div className="p-6 text-center">
              <p className="type-body-sm font-medium text-[var(--color-text-primary)]">No matching permissions</p>
              <p className="type-meta text-[var(--color-text-secondary)] mt-1">Try a different search term.</p>
            </div>
          ) : visibleParents.map((parent) => {
            const parentPermissions = permissions.filter((permission) => permission.parentId === parent.id);
            const isExpanded = expandedParents.has(parent.id);

            const allParentActions = serviceActions.filter((action) =>
              parentPermissions.some((permission) => permission.id === action.permissionId)
            );

            const selectedParentActions = allParentActions.filter((action) =>
              selectedActionIds.has(action.id)
            );

            const allSelected =
              allParentActions.length > 0 &&
              selectedParentActions.length === allParentActions.length;

            const visiblePermissions = parentPermissions.filter((permission) => {
              if (!query || parent.name.toLowerCase().includes(query)) return true;
              if (
                permission.name.toLowerCase().includes(query) ||
                String(permission.path || '').toLowerCase().includes(query)
              ) return true;
              return serviceActions.some((action) =>
                action.permissionId === permission.id &&
                (
                  action.name.toLowerCase().includes(query) ||
                  String(action.path || '').toLowerCase().includes(query) ||
                  String(action.method || '').toLowerCase().includes(query)
                )
              );
            });

            return (
              <section key={parent.id} className="bg-[var(--color-surface)]">
                <div className="min-h-12 px-4 py-2.5 bg-[var(--color-background-subtle)] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleParentExpand(parent.id)}
                    className="flex items-center gap-2 min-w-0 flex-1 text-left rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />}
                    <FolderTree className="w-4 h-4 text-[var(--color-primary-dark)] shrink-0" />
                    <p className="type-label font-semibold text-[var(--color-text-primary)] truncate">{parent.name}</p>
                    <p className="type-meta font-mono text-[var(--color-text-muted)] shrink-0">
                      {selectedParentActions.length}/{allParentActions.length}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAllInParent(parent.id, !allSelected)}
                    className="type-meta font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] shrink-0"
                  >
                    {allSelected ? 'Clear group' : 'Select group'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-3 space-y-3 bg-[var(--color-background)] sm:pl-8">
                    {visiblePermissions.map((permission) => {
                      const actionsForPermission = serviceActions.filter((action) => {
                        if (action.permissionId !== permission.id) return false;
                        if (!query || parent.name.toLowerCase().includes(query) || permission.name.toLowerCase().includes(query)) return true;
                        return (
                          action.name.toLowerCase().includes(query) ||
                          String(action.path || '').toLowerCase().includes(query) ||
                          String(action.method || '').toLowerCase().includes(query)
                        );
                      });

                      return (
                        <div
                          key={permission.id}
                          className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)] p-3 space-y-2"
                        >
                          <div className="flex flex-col gap-1 pb-2 border-b border-[var(--color-border-subtle)] sm:flex-row sm:items-center sm:gap-2">
                            <KeyRound className="w-3.5 h-3.5 text-[var(--color-primary-dark)] shrink-0" />
                            <p className="type-label font-semibold text-[var(--color-text-primary)]">{permission.name}</p>
                            <p className="type-meta font-mono text-[var(--color-text-muted)] break-all sm:ml-auto">{permission.path}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {actionsForPermission.length === 0 ? (
                              <p className="type-meta text-[var(--color-text-muted)]">No actions configured</p>
                            ) : actionsForPermission.map((action) => {
                              const checked = selectedActionIds.has(action.id);

                              return (
                                <div
                                  key={action.id}
                                  className={'rounded-[var(--radius-md)] border p-2 transition-colors ' +
                                    (checked
                                      ? 'bg-[var(--color-info-bg)] border-[var(--color-info-border)]'
                                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-background-subtle)]')}
                                >
                                  <Checkbox
                                    label={action.name}
                                    description={`${action.method.charAt(0) + action.method.slice(1).toLowerCase()} · ${action.path}`}
                                    checked={checked}
                                    onChange={() => handleToggleAction(action.id)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
