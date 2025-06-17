import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import {fetchCustomFields} from '../../state/slice/customFieldSlice';

import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import DataGrid, { Column, Paging, Scrolling, Sorting } from 'devextreme-react/data-grid';
import { TrashIcon, ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import '../../components/sprint-table/custom-style.css';

const OptionsTable = ({ options, handleDelete }) => (
  <DataGrid
    dataSource={options}
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
    <Column dataField="name" caption="Option Name" width="80%" />
    <Column
      caption="Actions"
      width="20%"
      cellRender={(data) => (
        <div className="flex space-x-2">
          <button
            className="text-text-color cursor-pointer"
            onClick={() => handleDelete(data.data.id)}
          >
            <TrashIcon className="w-5" />
          </button>
        </div>
      )}
    />
  </DataGrid>
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

  useEffect(() => {
    dispatch(fetchCustomFields());
  }, [dispatch]);

 useEffect(() => {
  if (customFieldId && customFields.length > 0) {
    const selected = customFields.find((field) => field.id === customFieldId);
    
    if (selected) {
      console.log(" Selected Custom Field Data:", selected); 

      setFormValues({
        name: selected.name || '',
        description: selected.description || '',
      });
      setOptions(selected.options || []);
      setFieldType(selected.fieldType?.name || '')
    }
  }
}, [customFieldId, customFields]);


  const handleFormChange = (name, value, validate) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (validate) {
    
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
        <ArrowLongLeftIcon/>
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

        <OptionsTable options={options} handleDelete={handleDeleteOption} />
      </div>
    </div>
  );
};

export default CustomFieldUpdate;
