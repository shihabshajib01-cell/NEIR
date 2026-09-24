import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Select, SearchableSelect } from '../../components/forms/Select.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, Layers } from 'lucide-react';

export const ServiceActionPage = () => {
  const [serviceActions, setServiceActions] = useState([]);
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
    permissionId: '',
    path: '',
    method: 'GET',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [actions, perms, pars] = await Promise.all([
        mockApi.getServiceActions(),
        mockApi.getPermissions(),
        mockApi.getParents(),
      ]);
      setServiceActions(actions);
      setPermissions(perms);
      setParents(pars);
    } catch (err) {
      addToast('Failed to load service actions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    const initialParent = parents.length > 0 ? parents[0].id : '';
    const availablePerms = permissions.filter((p) => p.parentId === initialParent);

    setFormState({
      name: '',
      parentId: initialParent,
      permissionId: availablePerms.length > 0 ? availablePerms[0].id : '',
      path: '',
      method: 'GET',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const permObj = permissions.find((p) => p.id === item.permissionId);
    setFormState({
      name: item.name,
      parentId: permObj ? permObj.parentId : '',
      permissionId: item.permissionId,
      path: item.path,
      method: item.method,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.path.trim() || !formState.permissionId) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    const permObj = permissions.find((p) => p.id === formState.permissionId);
    const parentObj = parents.find((p) => p.id === formState.parentId);

    if (editingItem) {
      setServiceActions((prev) =>
        prev.map((sa) =>
          sa.id === editingItem.id
            ? {
                ...sa,
                ...formState,
                permissionName: permObj ? permObj.name : sa.permissionName,
                parentName: parentObj ? parentObj.name : sa.parentName,
              }
            : sa
        )
      );
      addToast(`Service Action "${formState.name}" updated.`, 'success');
    } else {
      const newItem = {
        id: `sa-${Date.now().toString().slice(-4)}`,
        ...formState,
        permissionName: permObj ? permObj.name : 'Permission Node',
        parentName: parentObj ? parentObj.name : 'Parent Module',
      };
      setServiceActions((prev) => [...prev, newItem]);
      addToast(`Service Action "${formState.name}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  // Dependent permissions based on selected Parent
  const dependentPermissions = permissions.filter(
    (p) => !formState.parentId || p.parentId === formState.parentId
  );

  const filteredData = serviceActions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.permissionName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getMethodBadge = (method) => {
    const colors = {
      GET: 'bg-blue-50 text-blue-700 border-blue-200',
      POST: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      PUT: 'bg-amber-50 text-amber-700 border-amber-200',
      DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
          colors[method] || 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        {method}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      title: 'Service Action Name',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#147D83]" />
          <span className="font-semibold text-[#102A43]">{val}</span>
        </div>
      ),
    },
    {
      key: 'permissionName',
      title: 'Permission Name',
      render: (val) => <span className="text-xs text-[#172B4D]">{val}</span>,
    },
    {
      key: 'parentName',
      title: 'Parent Name',
      render: (val) => (
        <span className="text-xs text-[#52677A] bg-[#F4F7FA] px-2 py-0.5 rounded border border-[#D8E0E8]">
          {val}
        </span>
      ),
    },
    {
      key: 'path',
      title: 'Path',
      isMono: true,
      render: (val) => <span className="font-mono text-xs text-[#52677A]">{val}</span>,
    },
    {
      key: 'method',
      title: 'Method',
      width: '90px',
      render: (val) => getMethodBadge(val),
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
        title="Service Action"
        description="Configure granular REST/RPC endpoints and HTTP verb operations tied to operational permissions."
        breadcrumbs={[
          { label: 'Role Management', href: '/role-management/roles' },
          { label: 'Service Action' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Service Action
          </Button>
        }
      />

      <FilterBar
        searchPlaceholder="Filter service actions..."
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
        title={editingItem ? 'Edit Service Action' : 'Create Service Action'}
        subtitle="Granular API action and HTTP verb mapping"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create Service Action'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <Select
            label="Parent Module"
            value={formState.parentId}
            onChange={(e) => {
              const pId = e.target.value;
              const perms = permissions.filter((p) => p.parentId === pId);
              setFormState({
                ...formState,
                parentId: pId,
                permissionId: perms.length > 0 ? perms[0].id : '',
              });
            }}
            options={parents.map((p) => ({ value: p.id, label: p.name }))}
            required
          />

          <Select
            label="Associated Permission"
            value={formState.permissionId}
            onChange={(e) => setFormState({ ...formState, permissionId: e.target.value })}
            options={dependentPermissions.map((p) => ({ value: p.id, label: p.name }))}
            required
          />

          <TextInput
            label="Service Action Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g. Broadcast Global IMEI Blacklist"
            required
          />

          <TextInput
            label="API Route Path"
            value={formState.path}
            onChange={(e) => setFormState({ ...formState, path: e.target.value })}
            placeholder="e.g. /api/v1/imei/global-block"
            required
          />

          <Select
            label="Action HTTP Method"
            value={formState.method}
            onChange={(e) => setFormState({ ...formState, method: e.target.value })}
            options={['GET', 'POST', 'PUT', 'DELETE']}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
