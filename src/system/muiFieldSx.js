export const muiFieldSx = {
  '& .MuiInputLabel-root': {
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-ui)',
    fontSize: '16px',
    lineHeight: 1.25,
    transform: 'translate(14px, 18px) scale(1)',
    transformOrigin: 'top left',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.875)',
      color: 'var(--color-text-secondary)',
    },
    '&.Mui-focused': {
      color: 'var(--color-primary-dark)',
    },
    '&.Mui-error': {
      color: 'var(--color-error)',
    },
    '&.Mui-disabled': {
      color: 'var(--color-text-muted)',
    },
  },

  '& .MuiOutlinedInput-root': {
    height: 'var(--field-height)',
    minHeight: 'var(--field-height)',
    borderRadius: 'var(--field-radius)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--field-font-size)',
    boxShadow: 'none',
    transition: 'background-color var(--motion-fast), border-color var(--motion-fast)',
    '& fieldset': {
      borderColor: 'var(--color-border-strong)',
      borderWidth: '1px',
      transition: 'border-color var(--motion-fast), border-width var(--motion-fast)',
    },
    '&:hover:not(.Mui-focused):not(.Mui-disabled) fieldset': {
      borderColor: 'var(--color-text-secondary)',
    },
    '&.Mui-focused': {
      boxShadow: 'none',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary) !important',
      borderWidth: '2px !important',
    },
    '&.Mui-error fieldset': {
      borderColor: 'var(--color-error) !important',
      borderWidth: '1px !important',
    },
    '&.Mui-error.Mui-focused fieldset': {
      borderWidth: '2px !important',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--field-disabled-bg)',
      color: 'var(--color-text-muted)',
      '& fieldset': {
        borderColor: 'var(--color-border) !important',
      },
    },
    '&:has(input[readonly]), &:has(textarea[readonly])': {
      backgroundColor: 'var(--field-readonly-bg)',
    },
    '&:not(.MuiInputBase-multiline) .MuiInputBase-input': {
      height: '100%',
      boxSizing: 'border-box',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 'var(--field-padding-x)',
      paddingRight: 'var(--field-padding-x)',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiInputBase-input': {
      color: 'var(--color-text-primary)',
      fontSize: 'var(--field-font-size)',
      lineHeight: 1.5,
      '&::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1,
      },
      '&.Mui-disabled': {
        WebkitTextFillColor: 'var(--color-text-muted)',
      },
    },
    '&.MuiInputBase-multiline': {
      height: 'auto',
      minHeight: 'var(--textarea-min-height)',
      alignItems: 'flex-start',
      padding: '18px 14px 12px',
    },
    '&.MuiInputBase-multiline .MuiInputBase-input': {
      padding: 0,
      minHeight: '76px',
    },
    '& .MuiSelect-select': {
      minHeight: 'unset !important',
      height: '100%',
      boxSizing: 'border-box',
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
      paddingLeft: 'var(--field-padding-x) !important',
      paddingRight: '40px !important',
      display: 'flex',
      alignItems: 'center',
      fontSize: 'var(--field-font-size)',
    },
    '& .MuiInputAdornment-root': {
      color: 'var(--color-text-muted)',
      '& .MuiSvgIcon-root, & svg': {
        width: 18,
        height: 18,
      },
    },
  },

  '& .MuiAutocomplete-inputRoot': {
    height: 'var(--field-height)',
    minHeight: 'var(--field-height)',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    paddingLeft: '6px !important',
    paddingRight: '40px !important',
    alignItems: 'center',
  },

  '& .MuiAutocomplete-input': {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    fontSize: 'var(--field-font-size) !important',
  },

  '& .MuiFormHelperText-root': {
    marginLeft: '14px',
    marginRight: '14px',
    marginTop: '6px',
    minHeight: '20px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    lineHeight: 1.4,
    '&.Mui-error': {
      color: 'var(--color-error)',
    },
  },

  '& .MuiFormLabel-asterisk': {
    color: 'var(--color-error)',
  },
};

export const muiFilterSx = {
  ...muiFieldSx,
  '& .MuiOutlinedInput-root': {
    ...muiFieldSx['& .MuiOutlinedInput-root'],
    minHeight: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--type-control-size)',
    '&:not(.MuiInputBase-multiline) .MuiInputBase-input': {
      ...muiFieldSx['& .MuiOutlinedInput-root']['&:not(.MuiInputBase-multiline) .MuiInputBase-input'],
      fontSize: 'var(--type-control-size)',
    },
  },
  '& .MuiAutocomplete-inputRoot': {
    ...muiFieldSx['& .MuiAutocomplete-inputRoot'],
    minHeight: '40px',
    height: '40px',
  },
  '& .MuiInputLabel-root': {
    ...muiFieldSx['& .MuiInputLabel-root'],
    fontSize: 'var(--type-control-size)',
  },
  '& .MuiFormHelperText-root': {
    ...muiFieldSx['& .MuiFormHelperText-root'],
    fontSize: 'var(--type-meta-size)',
    minHeight: 0,
  },
};
