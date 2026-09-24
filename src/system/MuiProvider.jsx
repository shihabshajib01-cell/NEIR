import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#01ADC1',
      dark: '#028A97',
      light: '#E1F7FB',
      contrastText: '#FFFFFF',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#EF8F22' },
    error: { main: '#C62828' },
    background: {
      default: '#F7F8FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202338',
      secondary: '#626981',
    },
    divider: '#E2E5F0',
  },
  typography: {
    fontFamily: "var(--font-ui)",
    htmlFontSize: 16,
    fontSize: 14,
    h1: { fontSize: 'var(--type-page-title-size)', lineHeight: 'var(--type-title-line)', fontWeight: 600 },
    h2: { fontSize: 'var(--type-section-title-size)', lineHeight: 'var(--type-title-line)', fontWeight: 600 },
    h3: { fontSize: 'var(--type-card-title-size)', lineHeight: 'var(--type-title-line)', fontWeight: 600 },
    body1: { fontSize: 'var(--type-body-size)', lineHeight: 'var(--type-body-line)' },
    body2: { fontSize: 'var(--type-body-sm-size)', lineHeight: 'var(--type-body-line)' },
    caption: { fontSize: 'var(--type-meta-size)', lineHeight: 'var(--type-compact-line)' },
    button: {
      fontSize: 'var(--type-control-size)',
      lineHeight: 'var(--type-compact-line)',
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 4,
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        },
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--type-control-size)',
          color: 'var(--color-text-primary)',
          '&:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.07)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)',
            fontWeight: 600,
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.16)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-control-size)',
        },
        notchedOutline: {
          borderColor: 'var(--color-border)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--type-control-size)',
          '&.Mui-focused': { color: 'var(--color-primary-dark)' },
          '&.Mui-error': { color: 'var(--color-error)' },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          fontSize: 'var(--type-meta-size)',
          color: 'var(--color-text-muted)',
          '&.Mui-error': { color: 'var(--color-error)' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'var(--color-text-secondary)' },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        },
        option: {
          minHeight: 40,
          fontSize: 'var(--type-control-size)',
          '&[aria-selected="true"]': {
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--color-border)',
          padding: 4,
          '&.Mui-checked': { color: 'var(--color-primary)' },
          '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' },
          '&:hover': { backgroundColor: 'rgba(1, 173, 193, 0.08)' },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'var(--color-border)',
          '&.Mui-checked': { color: 'var(--color-primary)' },
          '&:hover': { backgroundColor: 'rgba(1, 173, 193, 0.08)' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-secondary)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-table-cell-size)',
          lineHeight: 'var(--type-body-line)',
          padding: '12px 16px',
        },
        head: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-table-head-size)',
          fontWeight: 600,
          lineHeight: 'var(--type-compact-line)',
          paddingTop: 12,
          paddingBottom: 12,
          zIndex: 2,
        },
        sizeSmall: {
          paddingTop: 8,
          paddingBottom: 8,
        },
        paddingCheckbox: {
          width: 52,
          paddingLeft: 12,
          paddingRight: 8,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.045)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(1, 173, 193, 0.08)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(1, 173, 193, 0.11)',
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-primary)',
          fontWeight: 600,
          '&:hover': {
            color: 'var(--color-primary-dark)',
          },
          '&.Mui-active': {
            color: 'var(--color-text-primary)',
          },
          '&.Mui-active .MuiTableSortLabel-icon': {
            color: 'var(--color-text-secondary)',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-primary)',
          fontSize: 'var(--type-table-cell-size)',
        },
        toolbar: {
          minHeight: 56,
          paddingLeft: 16,
          paddingRight: 8,
          flexWrap: 'wrap',
          rowGap: 4,
        },
        selectLabel: {
          margin: 0,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--type-table-cell-size)',
        },
        displayedRows: {
          margin: 0,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--type-table-cell-size)',
        },
      },
    },
  },
});

export function MuiProvider({ children }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
