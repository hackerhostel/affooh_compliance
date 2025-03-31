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

const dummyCustomField = [
  { id: 1, name: "Custom Field 1", description: "Complete project setup", type: "Development" },
  { id: 2, name: "Custom Field 2", description: "Design UI/UX", type: "Design" },
  { id: 3, name: "Custom Field 3", description: "Write test cases", type: "Testing" },
  { id: 4, name: "Custom Field 4", description: "Deploy application", type: "Deployment" },
];

const SettingContentPage = () => {
  const [customFields, setCustomFields] = useState([]);
  const [newRow, setNewRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [showUpdateComponent, setShowUpdateComponent] = useState(false);

  useEffect(() => {
    setCustomFields(dummyCustomField);
  }, []);

  const handleAddNew = () => {
    setNewRow({ id: null, name: "", description: "", type: "" });
  };

  const handleSave = () => {
    if (newRow) {
      const updatedFields = [{ ...newRow, id: customFields.length + 1 }, ...customFields];
      setCustomFields(updatedFields);
      setNewRow(null);
    } else if (editingRow) {
      const updatedFields = customFields.map((field) =>
        field.id === editingRow.id ? editingRow : field
      );
      setCustomFields(updatedFields);
      setEditingRow(null);
      setActionRow(null);
    }
  };

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
    const updatedFields = customFields.filter((field) => field.id !== id);
    setCustomFields(updatedFields);
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
          />
          <Column
            dataField="description"
            caption="Description"
            width="40%"
          />
          <Column
            dataField="type"
            caption="Type"
            width="20%"
          />
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
    </div>
  );
};

export default SettingContentPage;