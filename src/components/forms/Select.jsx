import React, { useId } from 'react';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { muiFieldSx } from '../../system/muiFieldSx.js';

const normalizeOptions = (options = []) => options.map((option) =>
  typeof option === 'string' ? { value: option, label: option } : option
);

export const Select = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select option', error, helperText,
  required = false, disabled = false, readOnly = false, className = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const selectId = id || name || generatedId;
  const normalizedOptions = normalizeOptions(options);
  const fieldLabel = typeof label === 'string' ? t(label) : label;
  const supportingText = typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText);

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
          inputProps: {
            'aria-invalid': Boolean(error) || undefined,
            'aria-describedby': supportingText ? selectId + '-helper' : undefined,
          },
        }}
        FormHelperTextProps={{ id: selectId + '-helper' }}
        sx={muiFieldSx}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled={required}>
            <span className="text-[var(--color-text-muted)]">{t(placeholder)}</span>
          </MenuItem>
        )}
        {normalizedOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {t(option.label)}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export const SearchableSelect = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select or search...', error, helperText,
  required = false, disabled = false, readOnly = false, className = '',
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const normalizedOptions = normalizeOptions(options);
  const selectedOption = normalizedOptions.find((option) => option.value === value) || null;
  const fieldLabel = typeof label === 'string' ? t(label) : label;
  const supportingText = typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText);

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
            sx={muiFieldSx}
          />
        )}
      />
    </div>
  );
};
