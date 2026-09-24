# BTRC NEIR Admin Portal

Frontend skeleton for the Bangladesh Telecommunication Regulatory Commission (BTRC) National Equipment Identity Register (NEIR) administrative portal.

## Stack

- React 19
- Vite 8
- Tailwind CSS v4
- React Router
- Lucide React
- JavaScript / JSX only
- Mock service layer for future API integration

## Run locally

```bash
npm install
npm run dev
```

The local development server runs on port 3000.

## Build

```bash
npm run build
```

The production build is generated in `dist/`.

## GitHub Pages

The project is configured for the repository path `/NEIR/` and uses hash routing so GitHub Pages refreshes and deep links remain stable.

Live URL:

`https://shihabshajib01-cell.github.io/NEIR/`

## Current routes

- `#/login`
- `#/dashboard`
- `#/special-registration`
- `#/lost-stolen`
- `#/device-deregister`
- `#/auto-registration`
- `#/role-management/parent`
- `#/role-management/permission`
- `#/role-management/service-action`
- `#/role-management/roles`
- `#/imei-check`
- `#/manufacturer-imei-upload`
- `#/support-ticket`
- `#/global-imei-block`
- `#/global-imei-block/list`
- `#/office/departments`
- `#/office/designations`
- `#/office/users`
- `#/office/users/new`
- `#/office/users/:id/edit`
- `#/msisdn-imei`

## Authentication

Authentication is intentionally mocked for the frontend skeleton. Any non-empty username and password can be used. Production authentication is not connected.

The mock session is stored in `sessionStorage` by default and in `localStorage` only when “Remember this browser” is selected.

## API integration

All current operational data is mock data. The service seam is:

`src/services/mockApi.js`

Production API integration should replace this service layer without changing page-level UI structure.

## Important

This repository currently contains a UI skeleton only. It must not be treated as a production NEIR system until real authentication, authorization, APIs, validation, audit logging, and backend security controls are connected and verified.
