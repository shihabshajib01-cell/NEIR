import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { TextInput, Textarea } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, Award } from 'lucide-react';

export const DesignationsPage = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    title: '',
    departmentId: '',
    rankGrade: 'Grade-5',
    description: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [des, depts] = await Promise.all([
        mockApi.getDesignations(),
        mockApi.getDepartments(),
      ]);
      setDesignations(des);
      setDepartments(depts);
    } catch (err) {
      addToast('Failed to load designations.', 'error');
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
      title: '',
      departmentId: departments.length > 0 ? departments[0].id : '',
      rankGrade: 'Grade-5',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      title: item.title,
      departmentId: item.departmentId,
      rankGrade: item.rankGrade,
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.departmentId) {
      addToast('Please complete required fields.', 'error');
      return;
    }

    const deptObj = departments.find((d) => d.id === formState.departmentId);
    const departmentName = deptObj ? deptObj.name : 'Engineering';

    if (editingItem) {
      setDesignations((prev) =>
        prev.map((d) =>
          d.id === editingItem.id ? { ...d, ...formState, departmentName } : d
        )
      );
      addToast(`Designation "${formState.title}" updated.`, 'success');
    } else {
      const newItem = {
        id: `des-${Date.now().toString().slice(-4)}`,
        ...formState,
        departmentName,
        userCount: 0,
      };
      setDesignations((prev) => [...prev, newItem]);
      addToast(`Designation "${formState.title}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredData = designations.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDeptFilter === 'All' || d.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'title',
      title: 'Designation Title',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#147D83]" />
          <span className="font-semibold text-[#102A43]">{val}</span>
        </div>
      ),
    },
    {
      key: 'departmentName',
      title: 'Department',
      render: (val) => <span className="text-xs text-[#172B4D]">{val}</span>,
    },
    {
      key: 'rankGrade',
      title: 'Pay Grade / Rank',
      isMono: true,
      width: '130px',
      render: (val) => (
        <span className="font-mono text-xs bg-[#F4F7FA] px-2 py-0.5 rounded border border-[#D8E0E8] font-semibold text-[#147D83]">
          {val}
        </span>
      ),
    },
    {
      key: 'userCount',
      title: 'Staff Assigned',
      width: '120px',
      isMono: true,
      render: (val) => <span className="font-mono text-xs text-[#52677A]">{val} Officers</span>,
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
        title="Designation"
        description="Official civil service designations, officer ranks, and regulatory administrative titles."
        breadcrumbs={[
          { label: 'Office' },
          { label: 'Designation' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Designation
          </Button>
        }
      />

      <FilterBar
        searchPlaceholder="Filter designations..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onReset={() => {
          setSearchTerm('');
          setSelectedDeptFilter('All');
        }}
        filters={
          <div className="w-56">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full h-8.5 px-2 text-xs bg-[#F4F7FA] border border-[#D8E0E8] rounded-md text-[#172B4D] outline-hidden cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Designation' : 'Create Designation'}
        subtitle="Rank and organizational title definition"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create Designation'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <TextInput
            label="Designation Title"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            placeholder="e.g. Senior Deputy Director (Spectrum)"
            required
          />

          <Select
            label="Department"
            value={formState.departmentId}
            onChange={(e) => setFormState({ ...formState, departmentId: e.target.value })}
            options={departments.map((d) => ({ value: d.id, label: d.name }))}
            required
          />

          <TextInput
            label="National Pay Grade / Rank"
            value={formState.rankGrade}
            onChange={(e) => setFormState({ ...formState, rankGrade: e.target.value })}
            placeholder="e.g. Grade-4"
          />

          <Textarea
            label="Job Description Summary"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            placeholder="Brief scope of responsibilities..."
            rows={3}
          />
        </form>
      </Modal>
    </div>
  );
};
