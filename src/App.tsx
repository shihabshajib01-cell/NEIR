/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext.jsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute.jsx';
import { ToastProvider } from './components/feedback/Toast.jsx';
import { AppShell } from './components/layout/AppShell.jsx';

// Feature Pages
import { LoginPage } from './features/auth/LoginPage.jsx';
import { DashboardPage } from './features/dashboard/DashboardPage.jsx';
import { SpecialRegistrationPage } from './features/special-registration/SpecialRegistrationPage.jsx';
import { LostStolenPage } from './features/lost-stolen/LostStolenPage.jsx';
import { DeviceDeregisterPage } from './features/device-deregister/DeviceDeregisterPage.jsx';
import { AutoRegistrationPage } from './features/auto-registration/AutoRegistrationPage.jsx';

// Role Management Pages
import { ParentPage } from './features/role-management/ParentPage.jsx';
import { PermissionPage } from './features/role-management/PermissionPage.jsx';
import { ServiceActionPage } from './features/role-management/ServiceActionPage.jsx';
import { RolesPage } from './features/role-management/RolesPage.jsx';

// Tools & Operations
import { ImeiCheckPage } from './features/imei-check/ImeiCheckPage.jsx';
import { ManufacturerUploadPage } from './features/manufacturer-upload/ManufacturerUploadPage.jsx';
import { SupportTicketPage } from './features/support-ticket/SupportTicketPage.jsx';
import { GlobalImeiBlockPage } from './features/global-imei-block/GlobalImeiBlockPage.jsx';
import { GlobalImeiBlockListPage } from './features/global-imei-block/GlobalImeiBlockListPage.jsx';

// Office Pages
import { DepartmentsPage } from './features/office/DepartmentsPage.jsx';
import { DesignationsPage } from './features/office/DesignationsPage.jsx';
import { UsersListPage } from './features/office/UsersListPage.jsx';
import { UserFormPage } from './features/office/UserFormPage.jsx';

// MSISDN IMEI Page
import { MsisdnImeiPage } from './features/msisdn-imei/MsisdnImeiPage.jsx';

// 404 Page
import { NotFoundPage } from './features/not-found/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Application Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="special-registration" element={<SpecialRegistrationPage />} />
              <Route path="lost-stolen" element={<LostStolenPage />} />
              <Route path="device-deregister" element={<DeviceDeregisterPage />} />
              <Route path="auto-registration" element={<AutoRegistrationPage />} />

              {/* Role Management Sub-routes */}
              <Route path="role-management" element={<Navigate to="/role-management/roles" replace />} />
              <Route path="role-management/parent" element={<ParentPage />} />
              <Route path="role-management/permission" element={<PermissionPage />} />
              <Route path="role-management/service-action" element={<ServiceActionPage />} />
              <Route path="role-management/roles" element={<RolesPage />} />

              {/* IMEI Operations */}
              <Route path="imei-check" element={<ImeiCheckPage />} />
              <Route path="manufacturer-imei-upload" element={<ManufacturerUploadPage />} />
              <Route path="support-ticket" element={<SupportTicketPage />} />

              {/* Global IMEI Block */}
              <Route path="global-imei-block" element={<GlobalImeiBlockPage />} />
              <Route path="global-imei-block/list" element={<GlobalImeiBlockListPage />} />

              {/* Office Sub-routes */}
              <Route path="office" element={<Navigate to="/office/departments" replace />} />
              <Route path="office/departments" element={<DepartmentsPage />} />
              <Route path="office/designations" element={<DesignationsPage />} />
              <Route path="office/users" element={<UsersListPage />} />
              <Route path="office/users/new" element={<UserFormPage />} />
              <Route path="office/users/:id/edit" element={<UserFormPage />} />

              {/* MSISDN IMEI */}
              <Route path="msisdn-imei" element={<MsisdnImeiPage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
