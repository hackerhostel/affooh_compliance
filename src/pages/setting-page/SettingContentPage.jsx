import React, { useEffect, useState } from "react";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import CustomFieldUpdate from "./CustomFieldUpdate";
import CreateCustomField from "./CreateCustomField";
import axios from "axios";

const SettingContentPage = () => {
  const [customFields, setCustomFields] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [showUpdateComponent, setShowUpdateComponent] = useState(false);
  const [newCustomField, setNewCustomField] = useState(false);

  const fetchCustomFields = () => {
    axios.get("/custom-fields")
      .then(response => setCustomFields(response.data))
      .catch(error => console.error("Error fetching custom fields:", error));
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

useEffect(() => {
  const fetchFieldTypes = async () => {
    try {
      const response = await axios.get("/custom-fields/field-types");

      // Assuming response.data contains the actual field types array
      console.log("Fetched field types:", response.data);

      // You can also save it to state if needed:
      // setFieldTypes(response.data);
    } catch (error) {
      console.error("Error fetching field types:", error);
    }
  };

  fetchFieldTypes();
}, []);


  const closeCreateCustomField = () => setNewCustomField(false);

  const handleEdit = (field) => {
    setEditingRow({ ...field });
    setShowUpdateComponent(true);
  };

  const handleDelete = (id) => {
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
            onClick={() => setNewCustomField(true)}

          >
            <PlusCircleIcon className="w-5 text-text-color" />
            <span>Add New</span>
          </div>
        </div>

        <DataGrid
          dataSource={customFields}
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

          <Column dataField="name" caption="Name" width="20%" />
          <Column dataField="description" caption="Description" width="40%" />
          <Column dataField="type" caption="Type" width="20%" />
          <Column
            caption="Actions"
            width="20%"
            cellRender={(data) => (
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
            )}
          />
        </DataGrid>
      </div>
      <CreateCustomField isOpen ={newCustomField} onClose={closeCreateCustomField}/>
    </div>
  );
};

export default SettingContentPage;
