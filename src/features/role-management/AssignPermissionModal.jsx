import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/overlays/Modal.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import {
  FolderTree,
  KeyRound,
  Layers,
  ChevronDown,
  ChevronRight,
  Search,
  CheckSquare,
  Square,
  ShieldCheck
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
  if (!role) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionIds, setSelectedActionIds] = useState(new Set());
  const [expandedParents, setExpandedParents] = useState(new Set());
  const { addToast } = useToast();

  useEffect(() => {
    if (role) {
      // Seed default checked IDs based on role
      const initial = new Set();
      if (role.name === 'Super Admin') {
        serviceActions.forEach((sa) => initial.add(sa.id));
      } else {
        serviceActions.slice(0, Math.min(serviceActions.length, role.assignedActionsCount || 6)).forEach((sa) => {
          initial.add(sa.id);
        });
      }
      setSelectedActionIds(initial);

      // Expand all parents by default
      const allParentIds = new Set(parents.map((p) => p.id));
      setExpandedParents(allParentIds);
    }
  }, [role, serviceActions, parents]);

  const toggleParentExpand = (parentId) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  const handleToggleAction = (actionId) => {
    setSelectedActionIds((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return next;
    });
  };

  const handleSelectAllInParent = (parentId, select = true) => {
    const permIds = permissions.filter((p) => p.parentId === parentId).map((p) => p.id);
    const actIds = serviceActions.filter((sa) => permIds.includes(sa.permissionId)).map((sa) => sa.id);

    setSelectedActionIds((prev) => {
      const next = new Set(prev);
      actIds.forEach((id) => {
        if (select) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const handleSave = () => {
    onSave && onSave(role.id, selectedActionIds.size);
    addToast(`Updated permissions for ${role.name} (${selectedActionIds.size} service actions assigned).`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Permissions Matrix — ${role.name}`}
      subtitle="Configure hierarchical capabilities (Parent > Permission > Service Action)"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#626981] font-medium">
            <span className="font-mono font-bold text-[#4B5694]">{selectedActionIds.size}</span> of{' '}
            <span className="font-mono">{serviceActions.length}</span> actions selected
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Permission Matrix
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Bulk Select Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8197]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search parent module, permission or service action..."
              className="w-full h-8.5 pl-9 pr-3 text-xs bg-[#F7F8FC] border border-[#E2E5F0] rounded-md text-[#202338] outline-hidden focus:border-[#4B5694]"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const all = new Set(serviceActions.map((s) => s.id));
                setSelectedActionIds(all);
              }}
              className="text-xs h-8"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedActionIds(new Set())}
              className="text-xs h-8 text-[#7A8197]"
            >
              Deselect All
            </Button>
          </div>
        </div>

        {/* Hierarchical Tree Container */}
        <div className="border border-[#E2E5F0] rounded-lg overflow-hidden divide-y divide-[#E2E5F0] max-h-[460px] overflow-y-auto bg-white">
          {parents.map((parent) => {
            const parentPerms = permissions.filter((p) => p.parentId === parent.id);
            const isExpanded = expandedParents.has(parent.id);

            // Get all actions for this parent
            const allParentActions = serviceActions.filter((sa) =>
              parentPerms.some((p) => p.id === sa.permissionId)
            );

            const selectedParentActions = allParentActions.filter((sa) =>
              selectedActionIds.has(sa.id)
            );

            const allSelected =
              allParentActions.length > 0 &&
              selectedParentActions.length === allParentActions.length;
            const partiallySelected =
              selectedParentActions.length > 0 && !allSelected;

            return (
              <div key={parent.id} className="bg-white">
                {/* Level 1: Parent Group */}
                <div className="px-4 py-2.5 bg-[#F7F8FC] flex items-center justify-between border-b border-[#EEF0FA] hover:bg-[#F1F5F9] transition-colors">
                  <div
                    onClick={() => toggleParentExpand(parent.id)}
                    className="flex items-center gap-2 cursor-pointer select-none flex-1 truncate"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#7A8197] shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#7A8197] shrink-0" />
                    )}
                    <FolderTree className="w-4 h-4 text-[#4B5694] shrink-0" />
                    <span className="text-xs font-bold text-[#202338] truncate">
                      {parent.name}
                    </span>
                    <span className="text-[11px] text-[#7A8197] font-mono">
                      ({selectedParentActions.length}/{allParentActions.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAllInParent(parent.id, !allSelected)}
                      className="text-[11px] font-semibold text-[#4B5694] hover:underline cursor-pointer"
                    >
                      {allSelected ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>
                </div>

                {/* Level 2 & Level 3: Permissions and Actions (visible when parent expanded) */}
                {isExpanded && (
                  <div className="p-3 pl-8 space-y-3 bg-[#F7F8FC]">
                    {parentPerms.map((perm) => {
                      const actionsForPerm = serviceActions.filter(
                        (sa) => sa.permissionId === perm.id
                      );

                      return (
                        <div
                          key={perm.id}
                          className="border border-[#EEF0FA] rounded-md bg-white p-3 space-y-2"
                        >
                          {/* Level 2: Permission Node */}
                          <div className="flex items-center gap-2 pb-1.5 border-b border-[#F7F8FC]">
                            <KeyRound className="w-3.5 h-3.5 text-[#343D73] shrink-0" />
                            <span className="text-xs font-semibold text-[#202338]">
                              {perm.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#7A8197] ml-auto">
                              {perm.path}
                            </span>
                          </div>

                          {/* Level 3: Service Actions Checkboxes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-4">
                            {actionsForPerm.length === 0 ? (
                              <span className="text-[11px] text-[#7A8197] italic">
                                No granular API endpoints configured
                              </span>
                            ) : (
                              actionsForPerm.map((action) => {
                                const isChecked = selectedActionIds.has(action.id);
                                return (
                                  <label
                                    key={action.id}
                                    className={`flex items-start gap-2 p-1.5 rounded border transition-colors cursor-pointer text-xs ${
                                      isChecked
                                        ? 'bg-[#4B5694]/5 border-[#4B5694]/30 text-[#343D73]'
                                        : 'bg-white border-[#E2E5F0] text-[#202338] hover:bg-[#F7F8FC]'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleAction(action.id)}
                                      className="rounded border-[#E2E5F0] text-[#4B5694] mt-0.5"
                                    />
                                    <div className="truncate">
                                      <p className="font-medium truncate">{action.name}</p>
                                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8197] mt-0.5">
                                        <span className="font-bold uppercase text-[#4B5694]">
                                          {action.method}
                                        </span>
                                        <span className="truncate">{action.path}</span>
                                      </div>
                                    </div>
                                  </label>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
