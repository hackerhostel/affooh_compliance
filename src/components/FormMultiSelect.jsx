import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

const FormMultiSelect = ({
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  isLoading = false,
  required = false,
  showLabel = true,
  className = '',
}) => {
  // Map internalRecipients (array of strings/numbers) to react-select value format
  const selectedOptions = options.filter(option => 
    value && Array.isArray(value) && value.some(v => v.toString() === option.value.toString())
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: '2px',
      borderRadius: '0.5rem',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
      },
      minHeight: '48px',
      backgroundColor: disabled ? '#f3f4f6' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#eff6ff',
      borderRadius: '0.375rem',
      border: '1px solid #dbeafe',
      padding: '1px 4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af',
      fontWeight: '500',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#3b82f6',
      '&:hover': {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderRadius: '0.375rem',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
      border: '1px solid #e5e7eb',
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      fontSize: '0.875rem',
      padding: '10px 12px',
      '&:active': {
        backgroundColor: '#3b82f6',
      },
    }),
  };

  const handleSelectChange = (selected) => {
    const values = selected ? selected.map(option => option.value) : [];
    onChange(name, values);
  };

  return (
    <div className={classNames('w-full', className)}>
      {showLabel && label && (
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        isMulti
        name={name}
        options={options}
        value={selectedOptions}
        onChange={handleSelectChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={isLoading}
        styles={customStyles}
        classNamePrefix="react-select"
        isSearchable={true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        menuPortalTarget={document.body}
        noOptionsMessage={() => "No other users found"}
      />
    </div>
  );
};

export default FormMultiSelect;
