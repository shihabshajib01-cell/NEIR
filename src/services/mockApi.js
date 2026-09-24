import { mockDashboardData } from '../mocks/dashboard.js';
import { mockSpecialRegistrations } from '../mocks/specialRegistration.js';
import { mockLostStolenDevices } from '../mocks/lostStolen.js';
import { mockParents, mockPermissions, mockServiceActions, mockRoles } from '../mocks/roleManagement.js';
import {
  mockSupportTickets,
  mockDepartments,
  mockDesignations,
  mockUsers,
  mockBlockedImeis,
  mockManufacturerUploads,
  mockMsisdnImeiRecords
} from '../mocks/office.js';

// Simulated delay helper
const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Dashboard
  async getDashboardSummary() {
    await delay(100);
    return { ...mockDashboardData };
  },

  // Special Registrations
  async getSpecialRegistrations(filters = {}) {
    await delay(120);
    let items = [...mockSpecialRegistrations];
    if (filters.status && filters.status !== 'All') {
      items = items.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(r =>
        r.imei.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q) ||
        r.model.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return {
      items,
      total: items.length,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10
    };
  },

  async getSpecialRegistrationById(id) {
    await delay(100);
    const item = mockSpecialRegistrations.find(r => r.id === id);
    if (!item) throw new Error(`Special Registration ${id} not found`);
    return { ...item };
  },

  async updateSpecialRegistrationStatus(id, verdict, remarks) {
    await delay(150);
    const item = mockSpecialRegistrations.find(r => r.id === id);
    if (item) {
      item.status = verdict;
      if (remarks) item.remarks = remarks;
    }
    return { success: true, item };
  },

  // Lost & Stolen Devices
  async getLostStolenDevices(filters = {}) {
    await delay(120);
    let items = [...mockLostStolenDevices];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(r =>
        r.imei.toLowerCase().includes(q) ||
        r.requestedBy.toLowerCase().includes(q) ||
        r.gdNumber.toLowerCase().includes(q)
      );
    }
    return { items, total: items.length };
  },

  // Device De-registration simulation
  async deregisterDevice(payload) {
    await delay(250);
    // Mock business-error verification trigger
    if (payload.imei === '999999999999999' || payload.triggerError) {
      throw new Error('Device de-registration is not allowed for this IMEI. Device is flagged under legal hold or EIR restriction.');
    }
    return {
      success: true,
      message: `Device with IMEI ${payload.imei} has been successfully de-registered from MSISDN ${payload.currentPhoneNumber}.`,
      referenceId: `DREG-${Date.now().toString().slice(-6)}`
    };
  },

  // Auto Registration simulation
  async autoRegisterDevice(payload) {
    await delay(250);
    return {
      success: true,
      message: `Device with IMEI ${payload.imei} is registered and paired with ${payload.currentPhoneNumber}.`,
      referenceId: `AREG-${Date.now().toString().slice(-6)}`
    };
  },

  // Role Management
  async getParents() {
    await delay(100);
    return [...mockParents];
  },
  async getPermissions() {
    await delay(100);
    return [...mockPermissions];
  },
  async getServiceActions() {
    await delay(100);
    return [...mockServiceActions];
  },
  async getRoles() {
    await delay(100);
    return [...mockRoles];
  },

  // IMEI Check
  async checkImei(imei) {
    await delay(200);
    const clean = (imei || '').trim();
    const isRegistered = !clean.startsWith('999');
    const isBlocked = clean.startsWith('864920');

    return {
      imei: clean,
      status: isBlocked ? 'Blocked' : isRegistered ? 'White Listed' : 'Not Registered',
      tac: clean.slice(0, 8),
      brand: 'Samsung Electronics',
      model: 'Galaxy Series 5G (Certified)',
      bengaliMessage: `IMEI নম্বর ${clean} বৈধ এবং বিটিআরসি এনইআইআর ডেটাবেজে নিবন্ধনের জন্য প্রস্তুত।`,
      englishMessage: `IMEI number ${clean} is valid and verified in BTRC NEIR Registry.`,
      registeredDate: '2025-11-14',
      mnoAttachment: 'Grameenphone / Robi / Banglalink active',
      importType: 'Authorized Commercial Import (Type Approved by BTRC)'
    };
  },

  // Global IMEI Block
  async blockImeiGlobally(payload) {
    await delay(250);
    const newRecord = {
      id: `blk-${Date.now().toString().slice(-4)}`,
      imei: payload.imei,
      blockedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      blockedBy: 'Current Active Admin',
      reason: payload.reason || 'Manual Administrative Block Requisition',
      status: 'Blocked',
      details: payload.details || 'Immediate hard EIR broadcast across all 4 licensed MNOs.'
    };
    mockBlockedImeis.unshift(newRecord);
    return { success: true, record: newRecord };
  },

  async getBlockedImeis(filters = {}) {
    await delay(120);
    let items = [...mockBlockedImeis];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(r => r.imei.includes(q) || r.reason.toLowerCase().includes(q) || r.blockedBy.toLowerCase().includes(q));
    }
    return { items, total: items.length };
  },

  // Manufacturer Upload
  async getManufacturerUploads() {
    await delay(100);
    return [...mockManufacturerUploads];
  },

  async uploadManufacturerCsv(fileName, fileCount = 250) {
    await delay(400);
    return {
      success: true,
      fileName,
      totalParsed: fileCount,
      validRecords: fileCount,
      message: `Successfully processed ${fileCount} IMEI records into BTRC National Register.`
    };
  },

  // Support Tickets
  async getSupportTickets(filters = {}) {
    await delay(120);
    let items = [...mockSupportTickets];
    if (filters.status && filters.status !== 'All') {
      items = items.filter(t => t.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(t =>
        t.trackingId.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      );
    }
    return { items, total: items.length };
  },

  // Office Administration
  async getDepartments() {
    await delay(100);
    return [...mockDepartments];
  },
  async getDesignations() {
    await delay(100);
    return [...mockDesignations];
  },
  async getUsers(filters = {}) {
    await delay(120);
    let items = [...mockUsers];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.phoneNumber.toLowerCase().includes(q)
      );
    }
    return { items, total: items.length };
  },

  async getUserById(id) {
    await delay(100);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    return { ...user };
  },

  async saveUser(userData) {
    await delay(200);
    if (userData.id) {
      const idx = mockUsers.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...userData };
        return mockUsers[idx];
      }
    }
    const newUser = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      no: mockUsers.length + 1,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // MSISDN IMEI Lookup
  async lookupMsisdnImei(type, query) {
    await delay(150);
    if (!query) return [];
    const q = query.trim().toLowerCase();
    return mockMsisdnImeiRecords.filter(r => {
      if (type === 'MSISDN') return r.msisdn.replace(/[\s+-]/g, '').includes(q.replace(/[\s+-]/g, ''));
      return r.imei.toLowerCase().includes(q);
    });
  }
};
