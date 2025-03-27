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
import { useHistory } from "react-router-dom";
import FormInput from "../../components/FormInput";

const dummyCustomField = [
  { id: 1, name: "Custom Filed 1", description: "Complete project setup", type: "Development" },
  { id: 2, name: "Custom Filed 2", description: "Design UI/UX", type: "Design" },
  { id: 3, name: "Custom Filed 3", description: "Write test cases", type: "Testing" },
  { id: 4, name: "Custom Filed 4", description: "Deploy application", type: "Deployment" },
];

const SettingContentPage = () => {
  const history = useHistory();
  const [filteredCustomField, setFilteredCustomField] = useState([]);
  const [newRow, setNewRow] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    setFilteredCustomField(dummyCustomField);
  }, []);

  const handleAddNew = () => {
    setNewRow({ id: null, name: "", description: "", type: "" });
  };

  const handleSave = () => {
    if (newRow) {
      setFilteredCustomField([{ ...newRow, id: filteredCustomField.length + 1 }, ...filteredCustomField]);
      setNewRow(null);
    }
    if (editingRow) {
      setFilteredCustomField(
        filteredCustomField.map((goal) => (goal.id === editingRow.id ? editingRow : goal))
      );
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

  const handleEdit = (goal) => {
    setEditingRow({ ...goal });
  };

  const handleDelete = (id) => {
    setFilteredCustomField(filteredCustomField.filter((goal) => goal.id !== id));
  };

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div>
        <div className="flex items-center justify-between p-4">
          <p className="text-secondary-grey text-lg font-medium">
            {`CustomField (${filteredCustomField.length})`}
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
          dataSource={newRow ? [newRow, ...filteredCustomField] : filteredCustomField}
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
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className="border p-1 w-full"
                  value={editingRow.name}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, name: e.target.value })
                  }
                />
              ) : (
                <span>{data.value}</span>
              )
            }
          />
          <Column
            dataField="description"
            caption="Description"
            width="40%"
            cellRender={(data) =>
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className="border p-1 w-full"
                  value={editingRow.description}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, description: e.target.value })
                  }
                />
              ) : (
                <span>{data.value}</span>
              )
            }
          />
          <Column
            dataField="type"
            caption="Type"
            width="20%"
            cellRender={(data) =>
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className="border p-1 w-full"
                  value={editingRow.type}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, type: e.target.value })
                  }
                />
              ) : (
                <span>{data.value}</span>
              )
            }
          />
          <Column
            caption="Actions"
            width="20%"
            cellRender={(data) =>
              actionRow === data.data.id ? (
                <div className="flex space-x-2">
                  <PencilSquareIcon
                    className="w-5 text-text-color cursor-pointer"
                    onClick={() => handleEdit(data.data)}
                  />
                  <CheckBadgeIcon
                    className="w-5 text-text-color cursor-pointer"
                    onClick={handleSave}
                  />
                  <XMarkIcon
                    className="w-5 text-text-color cursor-pointer"
                    onClick={handleClose}
                  />
                  <TrashIcon
                    className="w-5 text-text-color cursor-pointer"
                    onClick={() => handleDelete(data.data.id)}
                  />
                </div>
              ) : (
                <EllipsisVerticalIcon
                  className="w-5 cursor-pointer"
                  onClick={() => handleActionClick(data.data.id)}
                />
              )
            }
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default SettingContentPage;
