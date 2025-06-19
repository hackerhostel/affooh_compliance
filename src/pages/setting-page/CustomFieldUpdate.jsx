import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import { fetchCustomFields } from '../../state/slice/customFieldSlice';

import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import DataGrid, { Column, Paging, Scrolling, Sorting } from 'devextreme-react/data-grid';
import { TrashIcon, ArrowLongLeftIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import '../../components/sprint-table/custom-style.css';

const OptionsTable = ({
  options,
  handleDelete,
  showAddRow,
  newValue,
  setNewValue,
  handleAdd,
  adding,
  onCancelAdd,
}) => (
  <div>
    <div className="flex justify-end mb-2">
      {!showAddRow && (
        <button
          className="flex items-center bg-primary-pink text-white px-3 py-1 rounded hover:bg-pink-600"
          onClick={handleAdd}
        >
          <PlusCircleIcon className="w-5 h-5 mr-1" />
          Add New
        </button>
      )}
    </div>
    <DataGrid
      dataSource={showAddRow ? [{ id: 'new', value: newValue }, ...options] : options}
      allowColumnReordering
      showBorders={false}
      width="100%"
      className="rounded-lg overflow-hidden"
      showRowLines
      showColumnLines={false}
    >
      <Scrolling columnRenderingMode="virtual" />
      <Sorting mode="multiple" />
      <Paging enabled pageSize={4} />
      <Column
  dataField="value"
  caption="Option Name"
  width="65%"
  cellRender={(data) =>
    data.data.id === 'new' ? (
      <FormInput
        type="text"
        name="value"
        formValues={{ value: newValue }}
        placeholder="Enter new value"
        onChange={({ target: { value } }) => setNewValue(value)}
        formErrors={{}}
        showErrors={false}
        disabled={adding}
        autoFocus
      />
    ) : (
      <span>{data.data.value}</span>
    )
  }
/>

          ) : (
            <span>{data.data.value}</span>
          )
        }
      />
      <Column
        caption="Actions"
        width="35%"
        cellRender={(data) => {
          if (data.data.id === 'new') {
            return (
              <div className="flex space-x-2">
                <button
                  className="bg-primary-pink text-white px-3 py-1 rounded"
                  onClick={handleAdd}
                  disabled={adding || !newValue.trim()}
                >
                  {adding ? 'Adding...' : 'Add'}
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                  onClick={onCancelAdd}
                  disabled={adding}
                >
                  Cancel
                </button>
              </div>
            );
          }
          return (
            <button
              onClick={() => handleDelete(data.data.id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          );
        }}
      />
    </DataGrid>
  </div>
);

const CustomFieldUpdate = ({ onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const customFieldId = useSelector((state) => state.customField.selectedCustomFieldId);
  const customFields = useSelector((state) => state.customField.customFields);
  const [fieldType, setFieldType] = useState("");
  const [formValues, setFormValues] = useState({ name: '', description: '' });
  const [options, setOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

  // State for adding new value
  const [showAddRow, setShowAddRow] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomFields());
  }, [dispatch]);

  useEffect(() => {
    if (customFieldId && customFields.length > 0) {
      const selected = customFields.find((field) => field.id === customFieldId);
      if (selected) {
        setFormValues({
          name: selected.name || '',
          description: selected.description || '',
        });
        setOptions(selected.fieldValues || []);
        setFieldType(selected.fieldType?.name || '');
      }
    }
  }, [customFieldId, customFields]);

  const handleFormChange = (name, value, validate) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (validate) {
      // validation logic here if needed
    }
  };

  const handleDeleteOption = async (optionId) => {
    try {
      await axios.delete(`/custom-fields/${customFieldId}/field-values/${optionId}`);
      dispatch(fetchCustomFields());
    } catch (error) {
      console.error('Error deleting custom field option:', error);
    }
  };

  const handleShowAddRow = () => {
    setShowAddRow(true);
    setNewValue('');
  };

  const handleCancelAdd = () => {
    setShowAddRow(false);
    setNewValue('');
  };

  const handleAddOption = async () => {
    if (!newValue.trim()) return;
    setAdding(true);
    try {
      await axios.post(`/custom-fields/${customFieldId}/field-values`, {
        customFieldValue: {
          taskFieldID: Number(customFieldId),
          value: newValue,
          colourCode: "#fff",
        },
      });
      addToast('Option added successfully!', { appearance: 'success' });
      setShowAddRow(false);
      setNewValue('');
      dispatch(fetchCustomFields());
    } catch (error) {
      console.error('Error adding option:', error);
      addToast('Failed to add option', { appearance: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateCustomField = async () => {
    if (!customFieldId) {
      addToast('Invalid custom field ID', { appearance: 'error' });
      return;
    }

    try {
      const payload = {
        customField: {
          name: formValues.name,
          description: formValues.description,
        },
      };

      await axios.put(`/custom-fields/${customFieldId}`, payload);

      addToast('Custom field updated successfully!', { appearance: 'success' });
      dispatch(fetchCustomFields());
      if (onClose) onClose();
    } catch (error) {
      console.error('Error updating custom field:', error);
      addToast('Failed to update custom field', { appearance: 'error' });
    }
  };

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div className="flex p-3 justify-between">
        <div className="flex flex-col space-y-5">
          <button
            className="w-8"
            onClick={onClose}
          >
            <ArrowLongLeftIcon />
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold">Custom Field</span>
            <span className="bg-primary-pink text-white rounded-full px-6 py-1 inline-block">
              {fieldType || '—'}
            </span>
          </div>
          <div className="flex space-x-5 text-text-color">
            <span>
              Created date: <span>05/03/2025</span>
            </span>
            <span>Created By: Nilanga</span>
          </div>
        </div>
        <div>
          <button
            className="bg-primary-pink px-8 py-2 rounded-md text-white"
            onClick={handleUpdateCustomField}
          >
            Update
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-md">
        <div className="p-4">
          <FormInput
            type="text"
            name="name"
            formValues={formValues}
            placeholder="Name"
            onChange={({ target: { name, value } }) =>
              handleFormChange(name, value, true)
            }
            formErrors={formErrors}
            showErrors={isValidationErrorsShown}
          />

          <FormTextArea
            name="description"
            placeholder="Description"
            showShadow={false}
            formValues={formValues}
            onChange={({ target: { name, value } }) =>
              handleFormChange(name, value, true)
            }
            rows={6}
            formErrors={formErrors}
            showErrors={isValidationErrorsShown}
          />
        </div>

        {(fieldType === 'DDL' || fieldType === 'MULTI_SELECT') && (
          <OptionsTable
            options={options}
            handleDelete={handleDeleteOption}
            showAddRow={showAddRow}
            newValue={newValue}
            setNewValue={setNewValue}
            handleAdd={showAddRow ? handleAddOption : handleShowAddRow}
            adding={adding}
            onCancelAdd={handleCancelAdd}
          />
        )}
      </div>
    </div>
  );
};

export default CustomFieldUpdate;
