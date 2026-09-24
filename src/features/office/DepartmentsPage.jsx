import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { TextInput, Textarea } from '../../components/forms/TextInput.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, Network, Building2 } from 'lucide-react';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    name: '',
    code: '',
    head: '',
    description: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getDepartments();
      setDepartments(res);
    } catch (err) {
      addToast('Failed to load departments.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormState({
      name: '',
      code: '',
      head: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormState({
      name: dept.name,
      code: dept.code,
      head: dept.head,
      description: dept.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.code.trim()) {
      addToast('Department name and code are required.', 'error');
      return;
    }

    if (editingDept) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editingDept.id ? { ...d, ...formState } : d))
      );
      addToast(`Department "${formState.name}" updated.`, 'success');
    } else {
      const newDept = {
        id: `dept-${Date.now().toString().slice(-4)}`,
        ...formState,
        memberCount: 0,
        status: 'Active',
      };
      setDepartments((prev) => [...prev, newDept]);
      addToast(`Department "${formState.name}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredData = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'name',
      title: 'Department Name',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-[#01ADC1]" />
          <div>
            <span className="font-semibold text-[#202338]">{val}</span>
            <span className="ml-2 font-mono text-xs text-[#626981] bg-[#F7F8FC] px-1.5 py-0.2 rounded border border-[#E2E5F0]">
              {row.code}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'head',
      title: 'Head of Department',
      render: (val) => <span className="text-xs font-medium text-[#202338]">{val}</span>,
    },
    {
      key: 'memberCount',
      title: 'Personnel',
      width: '100px',
      isMono: true,
      render: (val) => <span className="font-mono text-xs font-semibold text-[#202338]">{val} Staff</span>,
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: (val) => <StatusBadge status={val} size="sm" />,
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
        title="Department"
        description="BTRC organizational divisions, engineering branches, and spectrum enforcement departments."
        breadcrumbs={[
          { label: 'Office' },
          { label: 'Department' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Department
          </Button>
        }
      />

      <TablePageWorkspace
        title="Department List"
        count={filteredData.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search departments by name, code, or department head..."
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  onReset={() => setSearchTerm('')}
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={filteredData}
                isLoading={isLoading}
              />
      </TablePageWorkspace>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create Department'}
        subtitle="Organizational hierarchy configuration"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingDept ? 'Save Changes' : 'Create Department'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <TextInput
            label="Department Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g. Spectrum Management Division"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Department Code"
              value={formState.code}
              onChange={(e) => setFormState({ ...formState, code: e.target.value })}
              placeholder="e.g. SMD"
              required
            />

            <TextInput
              label="Head of Department"
              value={formState.head}
              onChange={(e) => setFormState({ ...formState, head: e.target.value })}
              placeholder="e.g. Director General (SM)"
            />
          </div>

          <Textarea
            label="Department Scope & Function"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            placeholder="Describe regulatory jurisdiction and equipment verification duties..."
            rows={3}
          />
        </form>
      </Modal>
    </div>
  );
};
