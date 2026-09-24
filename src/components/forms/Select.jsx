import React, { useId } from 'react';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { muiFieldSx, muiFilterSx } from '../../system/muiFieldSx.js';

const normalizeOptions = (options = []) => options.map((option) =>
  typeof option === 'string' ? { value: option, label: option } : option
);

const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 0.5,
      maxHeight: 304,
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--field-radius)',
      boxShadow: 'var(--shadow-md)',
      backgroundColor: 'var(--color-surface)',
      backgroundImage: 'none',
    },
  },
  MenuListProps: {
    sx: {
      py: 0.5,
    },
  },
};

const standardOptionSx = {
  minHeight: 48,
  px: 2,
  py: 1,
  fontSize: 'var(--field-font-size)',
  lineHeight: 1.45,
  whiteSpace: 'normal',
  '&:hover': {
    backgroundColor: 'var(--color-surface-hover)',
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontWeight: 600,
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'var(--color-primary-light)',
  },
};

export const Select = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select option', error, helperText,
  required = false, disabled = false, readOnly = false, density = 'standard', className = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const selectId = id || name || generatedId;
  const normalizedOptions = normalizeOptions(options);
  const fieldLabel = typeof label === 'string' ? t(label) : label;
  const supportingText = typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText);
  const fieldSx = density === 'compact' ? muiFilterSx : muiFieldSx;
  const optionSx = density === 'compact'
    ? { ...standardOptionSx, minHeight: 40, py: 0.75, fontSize: 'var(--type-control-size)' }
    : standardOptionSx;

  return (
    <div className={className}>
      <TextField
        id={selectId}
        name={name}
        select
        label={fieldLabel}
        value={value ?? ''}
        onChange={onChange}
        error={Boolean(error)}
        helperText={supportingText}
        required={required}
        disabled={disabled}
        variant="outlined"
        size="medium"
        fullWidth
        InputLabelProps={{
          shrink: Boolean(value) || undefined,
        }}
        SelectProps={{
          displayEmpty: !fieldLabel,
          readOnly,
          MenuProps: selectMenuProps,
          inputProps: {
            'aria-invalid': Boolean(error) || undefined,
            'aria-describedby': supportingText ? selectId + '-helper' : undefined,
          },
        }}
        FormHelperTextProps={{ id: selectId + '-helper' }}
        sx={fieldSx}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled={required} sx={optionSx}>
            <span className="text-[var(--color-text-muted)]">{t(placeholder)}</span>
          </MenuItem>
        )}
        {normalizedOptions.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={optionSx}>
            {t(option.label)}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export const SearchableSelect = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select or search...', error, helperText,
  required = false, disabled = false, readOnly = false, density = 'standard', className = '',
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const normalizedOptions = normalizeOptions(options);
  const selectedOption = normalizedOptions.find((option) => option.value === value) || null;
  const fieldLabel = typeof label === 'string' ? t(label) : label;
  const supportingText = typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText);
  const fieldSx = density === 'compact' ? muiFilterSx : muiFieldSx;
  const optionSx = density === 'compact'
    ? { ...standardOptionSx, minHeight: 40, py: 0.75, fontSize: 'var(--type-control-size)' }
    : standardOptionSx;

  return (
    <div className={className}>
      <Autocomplete
        id={inputId}
        options={normalizedOptions}
        value={selectedOption}
        onChange={(_, option) => onChange?.(option?.value ?? '')}
        disabled={disabled}
        readOnly={readOnly}
        autoHighlight
        openOnFocus
        getOptionLabel={(option) => t(option.label)}
        isOptionEqualToValue={(option, selected) => option.value === selected.value}
        noOptionsText={t('No options found')}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--field-radius)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--color-surface)',
              backgroundImage: 'none',
            },
          },
          listbox: {
            sx: {
              py: 0.5,
              maxHeight: 304,
              '& .MuiAutocomplete-option': optionSx,
            },
          },
          popper: {
            sx: {
              zIndex: 'var(--z-toast)',
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            label={fieldLabel}
            placeholder={t(placeholder)}
            error={Boolean(error)}
            helperText={supportingText}
            required={required}
            variant="outlined"
            size="medium"
            InputLabelProps={{
              ...params.InputLabelProps,
              shrink: Boolean(selectedOption) || Boolean(placeholder) || undefined,
            }}
            inputProps={{
              ...params.inputProps,
              'aria-invalid': Boolean(error) || undefined,
              'aria-describedby': supportingText ? inputId + '-helper' : undefined,
            }}
            FormHelperTextProps={{ id: inputId + '-helper' }}
            sx={fieldSx}
          />
        )}
      />
    </div>
  );
};


export const CompactSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  ...props
}) => (
  <Select
    value={value}
    onChange={onChange}
    options={options}
    placeholder={placeholder}
    density="compact"
    className={className}
    {...props}
  />
);
