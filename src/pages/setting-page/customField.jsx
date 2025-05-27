import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import CustomFieldUpdate from "./CustomFieldUpdate";
import CreateCustomField from "./CreateCustomField";
import { fetchCustomFields } from "../../state/slice/customFieldSlice";

const CustomFieldPage = () => {
  const [customFields, setCustomFields] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [showUpdateComponent, setShowUpdateComponent] = useState(false);
  const [newCustomField, setNewCustomField] = useState(false);
  const dispatch = useDispatch();
  const closeCreateCustomField = () => setNewCustomField(false);

  const handleEdit = (field) => {
    setEditingRow({ ...field });
    setShowUpdateComponent(true);
  };

  useEffect(() => {
  const getCustomFields = async () => {
    try {
      const result = await dispatch(fetchCustomFields()).unwrap();
      setCustomFields(result);
      console.log("Fetched custom fields:", result);
    } catch (error) {
      console.error("Failed to fetch custom fields:", error);
    }
  };

  getCustomFields();
}, [dispatch]);



  

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

export default CustomFieldPage;
