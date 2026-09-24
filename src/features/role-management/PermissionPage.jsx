import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Select, SearchableSelect } from '../../components/forms/Select.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, KeyRound } from 'lucide-react';

export const PermissionPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [parents, setParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParentFilter, setSelectedParentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    name: '',
    parentId: '',
    path: '',
    icon: 'KeyRound',
    position: 1,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [perms, pars] = await Promise.all([
        mockApi.getPermissions(),
        mockApi.getParents(),
      ]);
      setPermissions(perms);
      setParents(pars);
    } catch (err) {
      addToast('Failed to load permissions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormState({
      name: '',
      parentId: parents.length > 0 ? parents[0].id : '',
      path: '',
      icon: 'KeyRound',
      position: permissions.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      parentId: item.parentId,
      path: item.path,
      icon: item.icon,
      position: item.position,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.path.trim() || !formState.parentId) {
      addToast('Please fill all required permission fields.', 'error');
      return;
    }

    const parentObj = parents.find((p) => p.id === formState.parentId);
    const parentName = parentObj ? parentObj.name : 'Parent Module';

    if (editingItem) {
      setPermissions((prev) =>
        prev.map((p) =>
          p.id === editingItem.id ? { ...p, ...formState, parentName } : p
        )
      );
      addToast(`Permission "${formState.name}" updated.`, 'success');
    } else {
      const newItem = {
        id: `perm-${Date.now().toString().slice(-4)}`,
        ...formState,
        parentName,
      };
      setPermissions((prev) => [...prev, newItem]);
      addToast(`Permission "${formState.name}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredData = permissions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParent =
      selectedParentFilter === 'All' || item.parentId === selectedParentFilter;
    return matchesSearch && matchesParent;
  });

  const columns = [
    {
      key: 'name',
      title: 'Permission Name',
      render: (val) => (
        <div className="flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-[#028A97]" />
          <span className="font-semibold text-[#202338]">{val}</span>
        </div>
      ),
    },
    {
      key: 'position',
      title: 'Position',
      isMono: true,
      width: '80px',
      render: (val) => <span className="font-mono text-center block text-[#626981]">{val}</span>,
    },
    {
      key: 'parentName',
      title: 'Parent Name',
      render: (val) => (
        <span className="text-xs font-medium text-[#01ADC1] bg-[#01ADC1]/10 px-2 py-0.5 rounded">
          {val}
        </span>
      ),
    },
    {
      key: 'path',
      title: 'Path',
      isMono: true,
      render: (val) => <span className="font-mono text-xs text-[#626981]">{val}</span>,
    },
    {
      key: 'icon',
      title: 'Icon',
      isMono: true,
      render: (val) => <span className="font-mono text-xs text-[#7A8197]">{val}</span>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '90px',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Edit2}
          onClick={() => handleOpenEdit(row)}
          className="text-xs h-7 px-2"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Permission"
        description="Manage page-level access permissions and navigation endpoints associated with NEIR modules."
        breadcrumbs={[
          { label: 'Role Management', href: '/role-management/roles' },
          { label: 'Permission' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Permission
          </Button>
        }
      />

      <TablePageWorkspace
        title="Permission List"
        count={filteredData.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Filter permissions..."
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setSelectedParentFilter('All');
                  }}
                  filters={
                    <div className="w-52">
                      <select
                        value={selectedParentFilter}
                        onChange={(e) => setSelectedParentFilter(e.target.value)}
                        className="w-full h-8.5 px-2 text-xs bg-[#F7F8FC] border border-[#E2E5F0] rounded-md text-[#202338] outline-hidden cursor-pointer"
                      >
                        <option value="All">All Parent Modules</option>
                        {parents.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={filteredData}
                isLoading={isLoading}
              />
      </TablePageWorkspace>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Permission' : 'Create Permission'}
        subtitle="Route and capability permission node"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create Permission'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <SearchableSelect
            label="Parent Module"
            value={formState.parentId}
            onChange={(val) => setFormState({ ...formState, parentId: val })}
            options={parents.map((p) => ({ value: p.id, label: p.name }))}
            required
          />

          <TextInput
            label="Permission Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g. Review Special Registration Dossier"
            required
          />

          <TextInput
            label="Endpoint / View Path"
            value={formState.path}
            onChange={(e) => setFormState({ ...formState, path: e.target.value })}
            placeholder="e.g. /special-registration/review"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Icon Identifier"
              value={formState.icon}
              onChange={(e) => setFormState({ ...formState, icon: e.target.value })}
              placeholder="e.g. Eye"
            />

            <TextInput
              label="Position"
              type="number"
              value={formState.position}
              onChange={(e) => setFormState({ ...formState, position: Number(e.target.value) })}
              min={1}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
