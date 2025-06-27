import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import {
  ArrowLongLeftIcon,
  PlusCircleIcon,
  TrashIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput";
import FormTextArea from "../../components/FormTextArea";
import FormSelect from "../../components/FormSelect";
import { selectUser } from "../../state/slice/authSlice";
import { fetchCustomFields } from "../../state/slice/customFieldSlice";
import { fetchScreensByOrganization } from "../../state/slice/screenSlice";

const ScreenUpdate = ({ screen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const customFields = useSelector((state) => state.customField.customFields);

  const [formValues, setFormValues] = useState({
    name: screen?.name || "",
    description: screen?.description || "",
  });
  const [fields, setFields] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addingNewField, setAddingNewField] = useState(false);
  const [newFieldId, setNewFieldId] = useState("");

  useEffect(() => {
<<<<<<< HEAD
    console.log("Screen:", screen);
=======
>>>>>>> 39e0388c758d3986b4dd60143985633d2ff1c534
    dispatch(fetchCustomFields());

    // Set initial form values and fields from screen data
    setFormValues({
      name: screen?.name || "",
      description: screen?.description || "",
    });

    // Set existing fields from the main tab (first tab)
    const mainTab =
      screen?.tabs?.find((tab) => tab.isDefaultScreenTab) || screen?.tabs?.[0];
    setFields(mainTab?.fields || []);
  }, [dispatch, screen]);

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpdateScreen = async () => {
    if (!screen?.id) {
      addToast("Invalid screen ID", { appearance: "error" });
      return;
    }

    setIsLoading(true);

    try {
<<<<<<< HEAD
      const mainTab =
        screen?.tabs?.find((tab) => tab.isDefaultScreenTab) ||
        screen?.tabs?.[0];

=======
      const tabFields = fields.map((f) => ({
        id: f.id?.toString(), 
        name: f.name,        
        required: f.required ?? false,
      }));
  
>>>>>>> 39e0388c758d3986b4dd60143985633d2ff1c534
      const payload = {
        screen: {
          screenID: Number(screen.id),
          name: formValues.name,
          description: formValues.description,
<<<<<<< HEAD
          organizationID: screen?.organizationID || user?.organizationID,
          tabs: [
            {
              id: mainTab?.id?.toString() || "default-tab-id",
              name: mainTab?.name || "Main",
              fields: fields.map((f) => ({
                id: f.id,
                required: f.required ?? false,
              })),
            },
          ],
=======
          organizationID: screen?.organizationID || user?.organizationID, 
          tabs: [
            {
              id: screen.tabs?.[0]?.id?.toString() || 'default-tab-id',
              name: screen.tabs?.[0]?.name || 'Main',
              fields: tabFields, 
            },
          ],
          generalTabs: [], 
>>>>>>> 39e0388c758d3986b4dd60143985633d2ff1c534
        },
      };

      console.log("Update payload:", payload);

      await axios.put(`/screens/${screen.id}`, payload);
      addToast("Screen updated successfully!", { appearance: "success" });
      dispatch(fetchScreensByOrganization());
      onClose?.();
    } catch (error) {
      console.error("Error updating screen:", error);
      addToast("Failed to update screen", { appearance: "error" });
    } finally {
      setIsLoading(false);
    }
  };
<<<<<<< HEAD

  // Field actions
  const handleAddNewField = () => {
    setAddingNewField(true);
    setNewFieldId("");
=======
  
  
  
  const handleAddNew = () => {
    setAddingNew(true);
    setNewFieldName('');
>>>>>>> 39e0388c758d3986b4dd60143985633d2ff1c534
  };

  const handleSaveNewField = () => {
    if (!newFieldId) return;

    const selectedField = customFields.find(
      (f) => f.id.toString() === newFieldId.toString()
    );

    if (selectedField) {
      // Check if field already exists
      const fieldExists = fields.some((f) => f.id === selectedField.id);
      if (fieldExists) {
        addToast("Field already exists!", { appearance: "warning" });
        return;
      }

      setFields([
        ...fields,
        { id: selectedField.id, name: selectedField.name, required: false },
      ]);
    }
    setAddingNewField(false);
    setNewFieldId("");
  };

  const handleToggleFieldRequired = (id) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  };

  const handleDeleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

<<<<<<< HEAD
  // Header info
  const createdDate = screen?.createdAt
    ? new Date(screen.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const createdBy = screen?.createdBy || "—";

  // Available fields for dropdown 
  const availableFields = customFields.filter(
    (cf) => !fields.some((f) => f.id === cf.id)
  );
=======
  const createdDate = screen?.createdAt ? new Date(screen.createdAt).toLocaleDateString() : '—';
  const createdBy = screen?.createdBy || '—';
>>>>>>> 39e0388c758d3986b4dd60143985633d2ff1c534

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div className="bg-[#f7f8fa] rounded-t-md px-4 py-3 flex justify-between items-center">
        <div>
          <div className="font-semibold text-base">Screens</div>
          <div className="flex gap-8 text-xs mt-1 text-gray-500">
            <span>Created Date: {createdDate}</span>
            <span>Created By: {createdBy}</span>
          </div>
        </div>
        <button
          className="bg-primary-pink px-8 py-2 rounded-md text-white"
          onClick={handleUpdateScreen}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>

      <div className="mt-5 bg-white rounded-b-md">
        <div className="p-4">
          <FormInput
            type="text"
            name="name"
            formValues={formValues}
            placeholder="Name"
            value={formValues.name}
            onChange={({ target: { name, value } }) =>
              handleFormChange(name, value)
            }
            formErrors={formErrors}
            showErrors={false}
          />
          <FormTextArea
            name="description"
            placeholder="Description"
            showShadow={false}
            formValues={formValues}
            value={formValues.description}
            onChange={({ target: { name, value } }) =>
              handleFormChange(name, value)
            }
            rows={6}
            formErrors={formErrors}
            showErrors={false}
          />
        </div>

        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-base">Fields</span>
            {!addingNewField && availableFields.length > 0 && (
              <button
                className="flex items-center text-primary-pink"
                onClick={handleAddNewField}
              >
                <PlusCircleIcon className="w-5 h-5 mr-1" /> Add New Field
              </button>
            )}
          </div>

          <table className="w-full border-t border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left font-medium">Field Name</th>
                <th className="py-2 px-2 text-left font-medium">Required</th>
                <th className="py-2 px-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addingNewField && (
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <FormSelect
                      name="newFieldId"
                      value={newFieldId}
                      options={availableFields.map((f) => ({
                        label: f.name,
                        value: f.id,
                      }))}
                      onChange={({ target: { value } }) => setNewFieldId(value)}
                      placeholder="Select Custom Field"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      disabled
                    />
                    <span className="ml-2 text-sm text-gray-400">Required</span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={handleSaveNewField}
                      disabled={!newFieldId}
                      className="mr-2"
                    >
                      <CheckBadgeIcon className="w-5 h-5 text-primary-pink" />
                    </button>
                    <button onClick={() => setAddingNewField(false)}>
                      <XMarkIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              )}

              {fields.length === 0 && !addingNewField && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-2 text-center text-gray-500"
                  >
                    No fields added yet. Click "Add New Field" to get started.
                  </td>
                </tr>
              )}

              {fields.map((field) => (
                <tr key={field.id} className="border-b border-gray-100">
                  <td className="py-2 px-2">{field.name}</td>
                  <td className="py-2 px-2">
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={() => handleToggleFieldRequired(field.id)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">Required</span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <TrashIcon
                      className="w-5 h-5 text-text-color cursor-pointer inline-block"
                      onClick={() => handleDeleteField(field.id)}
                    />
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
