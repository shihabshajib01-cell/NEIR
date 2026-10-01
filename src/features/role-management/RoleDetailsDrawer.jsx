import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, DrawerSection } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { ChevronDown, ChevronRight, Edit2, Search } from 'lucide-react';

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[minmax(140px,0.72fr)_minmax(0,1.28fr)] sm:gap-x-4">
    <p className="type-meta text-[var(--color-text-secondary)]">{label}</p>
    <p className="type-body-sm font-medium text-[var(--color-text-primary)] sm:text-right break-words">
      {value || '—'}
    </p>
  </div>
);

export const RoleDetailsDrawer = ({
  isOpen,
  onClose,
  role,
  parents = [],
  permissions = [],
  serviceActions = [],
  onSave,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionIds, setSelectedActionIds] = useState(new Set());
  const [initialActionIds, setInitialActionIds] = useState(new Set());
  const [expandedParents, setExpandedParents] = useState(new Set());
  const { addToast } = useToast();

  useEffect(() => {
    if (!role || !isOpen) return;

    const initial = new Set();
    if (role.name === 'Super Admin') {
      serviceActions.forEach((action) => initial.add(action.id));
    } else {
      serviceActions
        .slice(0, Math.min(serviceActions.length, role.assignedActionsCount || 0))
        .forEach((action) => initial.add(action.id));
    }

    setSelectedActionIds(initial);
    setInitialActionIds(new Set(initial));
    setExpandedParents(new Set());
    setSearchTerm('');
  }, [role, serviceActions, isOpen]);

  const query = searchTerm.trim().toLowerCase();

  const isDirty = useMemo(() => {
    if (selectedActionIds.size !== initialActionIds.size) return true;
    for (const id of selectedActionIds) {
      if (!initialActionIds.has(id)) return true;
    }
    return false;
  }, [selectedActionIds, initialActionIds]);

  const visibleParents = useMemo(() => {
    if (!query) return parents;

    return parents.filter((parent) => {
      if (parent.name.toLowerCase().includes(query)) return true;

      const parentPermissions = permissions.filter(
        (permission) => permission.parentId === parent.id
      );

      return parentPermissions.some((permission) => {
        if (
          permission.name.toLowerCase().includes(query) ||
          String(permission.path || '').toLowerCase().includes(query)
        ) {
          return true;
        }

        return serviceActions.some(
          (action) =>
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
    if (query) return;
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
    setInitialActionIds(new Set(selectedActionIds));
    addToast(
      `Updated permissions for ${role.name} (${selectedActionIds.size} actions assigned).`,
      'success'
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Role Details"
      subtitle={role.name}
      width="w-full sm:w-[720px]"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" icon={Edit2} onClick={() => onEdit?.(role)}>
            Edit Role
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!isDirty}>
            Save Permissions
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden rounded-[var(--field-radius)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <DrawerSection title="Role Information">
          <div className="divide-y divide-[var(--color-border-subtle)]">
            <DetailRow label="Role Name" value={role.name} />
            <DetailRow label="Description" value={role.description} />
            <DetailRow
              label="Assigned Actions"
              value={`${selectedActionIds.size} of ${serviceActions.length}`}
            />
          </div>
        </DrawerSection>

        <DrawerSection
          title="Permissions"
          trailing={
            <p className="type-meta text-[var(--color-text-muted)]">
              {selectedActionIds.size}/{serviceActions.length}
            </p>
          }
        >
          <div className="space-y-3 pt-1">
            <TextInput
              density="compact"
              icon={Search}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search permissions..."
              aria-label="Search permissions"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="type-meta text-[var(--color-text-secondary)]">
                {selectedActionIds.size} actions selected
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedActionIds(
                      new Set(serviceActions.map((action) => action.id))
                    )
                  }
                >
                  Select all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedActionIds(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {visibleParents.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="type-body-sm font-medium text-[var(--color-text-primary)]">
                    No matching permissions
                  </p>
                  <p className="type-meta text-[var(--color-text-secondary)] mt-1">
                    Try a different search term.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {visibleParents.map((parent) => {
                    const parentPermissions = permissions.filter(
                      (permission) => permission.parentId === parent.id
                    );

                    const allParentActions = serviceActions.filter((action) =>
                      parentPermissions.some(
                        (permission) => permission.id === action.permissionId
                      )
                    );

                    const selectedParentActions = allParentActions.filter((action) =>
                      selectedActionIds.has(action.id)
                    );

                    const allSelected =
                      allParentActions.length > 0 &&
                      selectedParentActions.length === allParentActions.length;

                    const isExpanded = query
                      ? true
                      : expandedParents.has(parent.id);

                    const visiblePermissions = parentPermissions.filter((permission) => {
                      if (!query || parent.name.toLowerCase().includes(query)) {
                        return true;
                      }

                      if (
                        permission.name.toLowerCase().includes(query) ||
                        String(permission.path || '').toLowerCase().includes(query)
                      ) {
                        return true;
                      }

                      return serviceActions.some(
                        (action) =>
                          action.permissionId === permission.id &&
                          (
                            action.name.toLowerCase().includes(query) ||
                            String(action.path || '').toLowerCase().includes(query) ||
                            String(action.method || '').toLowerCase().includes(query)
                          )
                      );
                    });

                    return (
                      <section key={parent.id}>
                        <div className="flex min-h-11 items-center gap-2 px-3 hover:bg-[var(--color-background-subtle)]">
                          <button
                            type="button"
                            onClick={() => toggleParentExpand(parent.id)}
                            className="flex min-w-0 flex-1 items-center gap-2 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                            )}
                            <p className="type-body-sm font-medium text-[var(--color-text-primary)] truncate">
                              {parent.name}
                            </p>
                            <p className="type-meta text-[var(--color-text-muted)] shrink-0">
                              {selectedParentActions.length}/{allParentActions.length}
                            </p>
                          </button>

                          {allParentActions.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectAllInParent(parent.id, !allSelected)
                              }
                              className="rounded-[var(--radius-sm)] px-2 py-1 type-meta font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                            >
                              {allSelected ? 'Clear' : 'Select all'}
                            </button>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-background)]">
                            {visiblePermissions.length === 0 ? (
                              <p className="px-9 py-3 type-meta text-[var(--color-text-muted)]">
                                No permissions configured
                              </p>
                            ) : (
                              <div className="divide-y divide-[var(--color-border-subtle)]">
                                {visiblePermissions.map((permission) => {
                                  const actionsForPermission = serviceActions.filter((action) => {
                                    if (action.permissionId !== permission.id) return false;

                                    if (
                                      !query ||
                                      parent.name.toLowerCase().includes(query) ||
                                      permission.name.toLowerCase().includes(query)
                                    ) {
                                      return true;
                                    }

                                    return (
                                      action.name.toLowerCase().includes(query) ||
                                      String(action.path || '').toLowerCase().includes(query) ||
                                      String(action.method || '').toLowerCase().includes(query)
                                    );
                                  });

                                  return (
                                    <div key={permission.id} className="px-3 py-3 sm:pl-9">
                                      <div className="flex flex-col gap-0.5">
                                        <p className="type-body-sm font-medium text-[var(--color-text-primary)]">
                                          {permission.name}
                                        </p>
                                        <p className="type-meta text-[var(--color-text-muted)] break-all">
                                          {permission.path}
                                        </p>
                                      </div>

                                      {actionsForPermission.length === 0 ? (
                                        <p className="mt-2 type-meta text-[var(--color-text-muted)]">
                                          No actions configured
                                        </p>
                                      ) : (
                                        <div className="mt-2 space-y-0.5">
                                          {actionsForPermission.map((action) => (
                                            <Checkbox
                                              key={action.id}
                                              className="min-h-10 w-full rounded-[var(--radius-sm)] px-1.5 py-1 hover:bg-[var(--color-surface-hover)]"
                                              label={action.name}
                                              description={`${action.method.charAt(0) + action.method.slice(1).toLowerCase()} · ${action.path}`}
                                              checked={selectedActionIds.has(action.id)}
                                              onChange={() => handleToggleAction(action.id)}
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DrawerSection>
      </div>
    </Drawer>
  );
};
