export const muiFieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    transition: 'box-shadow var(--motion-fast), background-color var(--motion-fast)',
    '& fieldset': {
      borderColor: 'var(--color-border)',
      transition: 'border-color var(--motion-fast), border-width var(--motion-fast)',
    },
    '&:hover:not(.Mui-focused):not(.Mui-disabled) fieldset': {
      borderColor: 'var(--color-text-muted)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary) !important',
      borderWidth: '2px !important',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(1, 173, 193, 0.12)',
    },
    '&.Mui-error fieldset': {
      borderColor: 'var(--color-error) !important',
      borderWidth: '2px !important',
    },
    '&.Mui-error.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(198, 40, 40, 0.10)',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-background-subtle)',
      '& fieldset': { borderColor: 'var(--color-border) !important' },
    },
    '& .MuiInputBase-input': {
      color: 'var(--color-text-primary)',
      fontSize: '1rem',
      '&::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1,
      },
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiInputAdornment-root': {
      color: 'var(--color-text-muted)',
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: '4px',
    color: 'var(--color-text-muted)',
    '&.Mui-error': { color: 'var(--color-error)' },
  },
};

export const muiFilterSx = {
  ...muiFieldSx,
  '& .MuiFormHelperText-root': {
    ...muiFieldSx['& .MuiFormHelperText-root'],
    fontSize: '0.6875rem',
  },
};
