import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { TextInput, NumberInput } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, FolderTree } from 'lucide-react';

export const ParentPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addToast } = useToast();

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    path: '',
    icon: 'FolderTree',
    position: 1,
    location: 'Main Navigation Rail',
    hasChildren: false,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getParents();
      setData(res);
    } catch (err) {
      addToast('Failed to load parents.', 'error');
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
      path: '',
      icon: 'FolderTree',
      position: data.length + 1,
      location: 'Main Navigation Rail',
      hasChildren: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      path: item.path,
      icon: item.icon,
      position: item.position,
      location: item.location,
      hasChildren: item.hasChildren || false,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.path.trim()) {
      addToast('Please enter both Name and Path.', 'error');
      return;
    }

    if (editingItem) {
      setData((prev) =>
        prev.map((p) => (p.id === editingItem.id ? { ...p, ...formState } : p))
      );
      addToast(`Parent "${formState.name}" updated.`, 'success');
    } else {
      const newItem = {
        id: `p-${Date.now().toString().slice(-4)}`,
        ...formState,
      };
      setData((prev) => [...prev, newItem]);
      addToast(`Parent "${formState.name}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      title: 'Parent Name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[#01ADC1]" />
          <span className="font-semibold text-[#202338]">{val}</span>
        </div>
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
      render: (val) => <span className="font-mono text-xs bg-[#F7F8FC] px-2 py-0.5 rounded border border-[#E2E5F0]">{val}</span>,
    },
    {
      key: 'location',
      title: 'Location',
      render: (val) => <span className="text-xs text-[#202338]">{val}</span>,
    },
    {
      key: 'position',
      title: 'Position',
      isMono: true,
      width: '80px',
      render: (val) => <span className="font-mono font-bold text-center block text-[#202338]">{val}</span>,
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
        title="Parent"
        description="Configure high-level structural menu groupings and parent navigation modules for NEIR."
        breadcrumbs={[
          { label: 'Role Management', href: '/role-management/roles' },
          { label: 'Parent' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Parent
          </Button>
        }
      />

      <FilterBar
        searchPlaceholder="Filter by parent name or route path..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onReset={() => setSearchTerm('')}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Parent Module' : 'Create Parent Module'}
        subtitle="Structural navigation grouping configuration"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create Parent'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <TextInput
            label="Parent Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g. Device Operations"
            required
          />

          <TextInput
            label="Route Path"
            value={formState.path}
            onChange={(e) => setFormState({ ...formState, path: e.target.value })}
            placeholder="e.g. /device-operations"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Icon Identifier"
              value={formState.icon}
              onChange={(e) => setFormState({ ...formState, icon: e.target.value })}
              placeholder="e.g. ShieldCheck"
            />

            <TextInput
              label="Sort Position"
              type="number"
              value={formState.position}
              onChange={(e) => setFormState({ ...formState, position: Number(e.target.value) })}
              min={1}
            />
          </div>

          <Select
            label="Menu Location"
            value={formState.location}
            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            options={[
              'Main Navigation Rail',
              'Top Navigation Bar',
              'Administrative Settings Rail',
              'Footer Links'
            ]}
          />

          <div className="pt-2">
            <Checkbox
              label="Has Nested Child Routes"
              description="Check if this parent houses sub-menus and permissions"
              checked={formState.hasChildren}
              onChange={(e) => setFormState({ ...formState, hasChildren: e.target.checked })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
