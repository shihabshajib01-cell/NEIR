import React, { useId } from 'react';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { muiFieldSx } from '../../system/muiFieldSx.js';

const normalizeOptions = (options = []) => options.map((option) =>
  typeof option === 'string' ? { value: option, label: option } : option
);

const FieldLabel = ({ id, label, required = false }) => {
  if (!label) return null;

  return (
    <label id={id} className="text-sm font-medium leading-5 text-[var(--color-text-primary)]">
      {label}
      {required ? <span className="text-[var(--color-error)]" aria-hidden="true"> *</span> : null}
    </label>
  );
};

export const Select = ({
  label, id, name, value, onChange, options = [], placeholder = 'Select option', error, helperText,
  required = false, disabled = false, className = '', ...props
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const selectId = id || name || generatedId;
  const labelId = selectId + '-label';
  const normalizedOptions = normalizeOptions(options);
  const fieldLabel = typeof label === 'string' ? t(label) : label;

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      <FieldLabel id={labelId} label={fieldLabel} required={required} />
      <TextField
        id={selectId}
        name={name}
        select
        value={value ?? ''}
        onChange={onChange}
        error={Boolean(error)}
        helperText={typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText)}
        required={required}
        disabled={disabled}
        variant="outlined"
        size="small"
        fullWidth
        SelectProps={{
          displayEmpty: true,
          inputProps: { 'aria-labelledby': fieldLabel ? labelId : undefined },
        }}
        inputProps={{
          'aria-invalid': Boolean(error) || undefined,
          'aria-describedby': error || helperText ? selectId + '-helper' : undefined,
        }}
        FormHelperTextProps={{ id: selectId + '-helper' }}
        sx={muiFieldSx}
        {...props}
      >
        {placeholder && (
          <MenuItem value="">
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
  required = false, disabled = false, className = '',
}) => {
  const generatedId = useId();
  const { t } = usePreferences();
  const inputId = id || name || generatedId;
  const labelId = inputId + '-label';
  const normalizedOptions = normalizeOptions(options);
  const selectedOption = normalizedOptions.find((option) => option.value === value) || null;
  const fieldLabel = typeof label === 'string' ? t(label) : label;

  return (
    <div className={'flex flex-col gap-1.5 ' + className}>
      <FieldLabel id={labelId} label={fieldLabel} required={required} />
      <Autocomplete
        id={inputId}
        options={normalizedOptions}
        value={selectedOption}
        onChange={(_, option) => onChange?.(option?.value ?? '')}
        disabled={disabled}
        autoHighlight
        openOnFocus
        getOptionLabel={(option) => t(option.label)}
        isOptionEqualToValue={(option, selected) => option.value === selected.value}
        noOptionsText={t('No options found')}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            placeholder={t(placeholder)}
            error={Boolean(error)}
            helperText={typeof (error || helperText) === 'string' ? t(error || helperText) : (error || helperText)}
            required={required}
            variant="outlined"
            size="small"
            inputProps={{
              ...params.inputProps,
              'aria-labelledby': fieldLabel ? labelId : undefined,
              'aria-invalid': Boolean(error) || undefined,
              'aria-describedby': error || helperText ? inputId + '-helper' : undefined,
            }}
            FormHelperTextProps={{ id: inputId + '-helper' }}
            sx={muiFieldSx}
          />
        )}
      />
    </div>
  );
};
