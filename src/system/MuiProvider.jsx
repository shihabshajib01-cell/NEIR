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
    fontFamily: "'Poppins', 'Noto Sans Bengali', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    button: {
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
          fontSize: '0.875rem',
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
          fontSize: '1rem',
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
          fontSize: '0.875rem',
          '&.Mui-focused': { color: 'var(--color-primary-dark)' },
          '&.Mui-error': { color: 'var(--color-error)' },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          fontSize: '0.75rem',
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
          fontSize: '0.875rem',
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
  },
});

export function MuiProvider({ children }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
