import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import { ArrowLongLeftIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon, CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import { selectUser } from '../../state/slice/authSlice';
import FormSelect from '../../components/FormSelect';
import { fetchCustomFields } from '../../state/slice/customFieldSlice';

const ScreenUpdate = ({ screen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const customFields = useSelector(state => state.customField.customFields);

  const [formValues, setFormValues] = useState({
    name: screen?.name || '',
    description: screen?.description || '',
  });
  const [fields, setFields] = useState(screen?.fields || []);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    console.log('Screen ID:', screen?.id);
    dispatch(fetchCustomFields());
  }, [dispatch, screen]);

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateScreen = async () => {
    if (!screen?.id) {
      addToast('Invalid screen ID', { appearance: 'error' });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const tabFields = fields.map((f) => ({
        id: f.id?.toString(), // custom field id
        name: f.name,         // custom field name
        required: f.required ?? false,
      }));
  
      const payload = {
        screen: {
          screenID: Number(screen.id),
          name: formValues.name,
          description: formValues.description,
          organizationID: screen?.organizationID || user?.organizationID, // ✅ add this
          tabs: [
            {
              id: screen.tabs?.[0]?.id?.toString() || 'default-tab-id',
              name: screen.tabs?.[0]?.name || 'Main',
              fields: tabFields, // contains fieldID and required
            },
          ],
          generalTabs: [], // optional, send if needed
        },
      };
      
      await axios.put(`/screens/${screen.id}`, payload);
  
      addToast('Screen updated successfully!', { appearance: 'success' });
      onClose?.();
    } catch (error) {
      console.error('Error updating screen:', error);
      addToast('Failed to update screen', { appearance: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  // Field actions
  const handleAddNew = () => {
    setAddingNew(true);
    setNewFieldName('');
  };
  const handleSaveNewField = () => {
    if (!newFieldName) return;
    const selectedField = customFields.find(f => f.id.toString() === newFieldName.toString());
    if (selectedField) {
      setFields([...fields, { id: selectedField.id, name: selectedField.name }]);
    }
    setAddingNew(false);
    setNewFieldName('');
  };
  const handleEditField = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };
  const handleSaveEditField = (id) => {
    setFields(fields.map(f => f.id === id ? { ...f, name: editingValue } : f));
    setEditingId(null);
    setEditingValue('');
  };
  const handleDeleteField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  // Header info
  const createdDate = screen?.createdAt ? new Date(screen.createdAt).toLocaleDateString() : '—';
  const createdBy = screen?.createdBy || '—';

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div className="bg-[#f7f8fa] rounded-t-md px-4 py-3 flex justify-between items-center">
        <div>
          <div className="font-semibold text-base">Screens</div>
          <div className="flex gap-8 text-xs mt-1 text-gray-500">
            <span>Created Date : {createdDate}</span>
            <span>Created By : {createdBy}</span>
          </div>
        </div>
        <button
          className="bg-primary-pink px-8 py-2 rounded-md text-white"
          onClick={handleUpdateScreen}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      </div>
      <div className="mt-5 bg-white rounded-b-md">
        <div className="p-4">
          <FormInput
            type="text"
            name="name"
            formValues={formValues}
            placeholder="Name"
            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
            formErrors={formErrors}
            showErrors={false}
          />
          <FormTextArea
            name="description"
            placeholder="Description"
            showShadow={false}
            formValues={formValues}
            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
            rows={6}
            formErrors={formErrors}
            showErrors={false}
          />
        </div>
        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-base">Options</span>
            {!addingNew && (
              <button className="flex items-center text-primary-pink" onClick={handleAddNew}>
                <PlusCircleIcon className="w-5 h-5 mr-1" /> Add New
              </button>
            )}
          </div>
          <table className="w-full border-t border-gray-200">
            <tbody>
              {addingNew && (
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <FormSelect
                      name="newFieldId"
                      value={newFieldName}
                      options={customFields.map(f => ({ label: f.name, value: f.id }))}
                      onChange={({ target: { value } }) => setNewFieldName(value)}
                      placeholder="Select Custom Field"
                    />
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button onClick={handleSaveNewField} disabled={!newFieldName}>
                      <CheckBadgeIcon className="w-5 h-5 text-primary-pink" />
                    </button>
                    <button onClick={() => setAddingNew(false)}>
                      <XMarkIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              )}
              {fields.map((field) => (
                <tr key={field.id} className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    {editingId === field.id ? (
                      <FormInput
                        type="text"
                        name="editFieldName"
                        value={editingValue}
                        onChange={({ target: { value } }) => setEditingValue(value)}
                      />
                    ) : (
                      field.name
                    )}
                  </td>
                  <td className="py-2 px-2 text-right">
                    {editingId === field.id ? (
                      <>
                        <button onClick={() => handleSaveEditField(field.id)} disabled={!editingValue.trim()}>
                          <CheckBadgeIcon className="w-5 h-5 text-primary-pink" />
                        </button>
                        <button onClick={() => setEditingId(null)}>
                          <XMarkIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </>
                    ) : (
                      <>
                        <PencilSquareIcon className="w-5 h-5 text-text-color cursor-pointer inline-block mr-2" onClick={() => handleEditField(field.id, field.name)} />
                        <TrashIcon className="w-5 h-5 text-text-color cursor-pointer inline-block" onClick={() => handleDeleteField(field.id)} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className="w-8 mt-4 ml-4" onClick={onClose}>
        <ArrowLongLeftIcon />
      </button>
    </div>
  );
};

export default ScreenUpdate; 