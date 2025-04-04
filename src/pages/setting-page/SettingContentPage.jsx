import React, { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import FormInput from "../../components/FormInput";
import CustomFieldUpdate from "./CustomFieldUpdate";
import axios from "axios";  

const SettingContentPage = () => {
  const [customFields, setCustomFields] = useState([]);
  const [newRow, setNewRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [showUpdateComponent, setShowUpdateComponent] = useState(false);


  useEffect(() => {
    // Fetch initial custom fields from the API when the component mounts
    axios.get("/custom-fields")
      .then(response => setCustomFields(response.data))
      .catch(error => console.error("Error fetching custom fields:", error));
  }, []);

  const handleAddNew = () => {
    setNewRow({ id: null, name: "", description: "", type: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (newRow) {
      // Prepare the data to be sent to the backend
      const newCustomField = {
        customField: {
          name: newRow.name,
          fieldTypeID: newRow.type,  // Assuming type is a field type ID
          description: newRow.description,
          fieldValues: [],  // Empty array for field values, adjust if needed
        }
      };

      // Send the POST request to create a new custom field
      axios.post("/custom-fields", newCustomField)
        .then(response => {
          const { customFieldID } = response.data.body;
          // Update the state with the new custom field and reset the form
          const updatedFields = [
            { ...newRow, id: customFieldID }, 
            ...customFields
          ];
          setCustomFields(updatedFields);
          setNewRow(null);
        })
        .catch(error => console.error("Error creating custom field:", error));
    } else if (editingRow) {
      // Update existing custom field (you can extend this as needed)
      const updatedFields = customFields.map((field) =>
        field.id === editingRow.id ? editingRow : field
      );
      setCustomFields(updatedFields);
      setEditingRow(null);
      setActionRow(null);
    }
  };

  const fetchFieldTypes = async () => {
    try {
        const response = await axios.get("/custom-fields/field-types");
        console.log("Raw Response:", response);
        
        const fieldTypes = response?.data?.body;
        if (fieldTypes) {
            console.log("Field Types:", fieldTypes);
        } else {
            console.error("Failed to fetch field types");
        }
    } catch (error) {
        console.error("Error fetching field types:", error.response?.status, error.response?.data);
    }
};

useEffect(() => {
    fetchFieldTypes();
}, []);

  

  const handleClose = () => {
    setNewRow(null);
    setEditingRow(null);
    setActionRow(null);
  };

  const handleActionClick = (id) => {
    setActionRow(actionRow === id ? null : id);
  };

  const handleEdit = (field) => {
    setEditingRow({ ...field });
    setShowUpdateComponent(true);
  };

  const handleDelete = (id) => {
    // Call the API to delete a custom field (if needed)
    axios.delete(`/api/custom-fields/${id}`)
      .then(() => {
        const updatedFields = customFields.filter((field) => field.id !== id);
        setCustomFields(updatedFields);
      })
      .catch(error => console.error("Error deleting custom field:", error));
  };

  if (showUpdateComponent) {
    return <CustomFieldUpdate field={editingRow} onClose={() => setShowUpdateComponent(false)} />;
  }

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div>
        <div className="flex items-center justify-between p-4">
          <p className="text-secondary-grey text-lg font-medium">
            {`Custom Fields (${customFields.length})`}
          </p>
          <div
            className="flex items-center space-x-2 text-text-color cursor-pointer"
            onClick={handleAddNew}
          >
            <PlusCircleIcon className="w-5 text-text-color" />
            <span>Add New</span>
          </div>
        </div>
        <DataGrid
          dataSource={newRow ? [newRow, ...customFields] : customFields}
          allowColumnReordering={true}
          showBorders={false}
          width="100%"
          className="rounded-lg overflow-hidden"
          showRowLines={true}
          showColumnLines={false}
        >
          <Scrolling columnRenderingMode="virtual" />
          <Sorting mode="multiple" />
          <Paging enabled={true} pageSize={4} />

          <Column
            dataField="name"
            caption="Name"
            width="20%"
            cellRender={(data) =>
              newRow && data.data.id === null ? (
                <FormInput name="name" value={newRow.name} onChange={handleInputChange} />
              ) : (
                data.data.name
              )
            }
          />
          <Column
            dataField="description"
            caption="Description"
            width="40%"
            cellRender={(data) =>
              newRow && data.data.id === null ? (
                <FormInput name="description" value={newRow.description} onChange={handleInputChange} />
              ) : (
                data.data.description
              )
            }
          />
          <Column
            dataField="type"
            caption="Type"
            width="20%"
            cellRender={(data) =>
              newRow && data.data.id === null ? (
                <FormInput name="type" value={newRow.type} onChange={handleInputChange} />
              ) : (
                data.data.type
              )
            }
          />
          <Column
            caption="Actions"
            width="20%"
            cellRender={(data) =>
              newRow && data.data.id === null ? (
                <div className="flex space-x-2">
                  <CheckBadgeIcon className="w-5 text-green-500 cursor-pointer" onClick={handleSave} />
                  <XMarkIcon className="w-5 text-red-500 cursor-pointer" onClick={handleClose} />
                </div>
              ) : (
                <div className="flex space-x-2">
                  <PencilSquareIcon
                    className="w-5 text-text-color cursor-pointer"
                    onClick={() => handleEdit(data.data)}
                  />
                  <TrashIcon
                    className="w-5 text-text-color cursor-pointer"
                    onClick={() => handleDelete(data.data.id)}
                  />
                </div>
              )
            }
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default SettingContentPage;
