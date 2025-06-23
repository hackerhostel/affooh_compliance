import React, { useEffect, useState } from "react";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import CustomFieldUpdate from "./CustomFieldUpdate";
import CreateNewScreen from "./CreateScreens";
import { useDispatch, useSelector } from "react-redux";
import { fetchScreensByProject, selectScreens, selectScreenLoading, selectScreenError } from "../../state/slice/screenSlice";
import { selectSelectedProject } from "../../state/slice/projectSlice";

const Screens = () => {
  const dispatch = useDispatch();
  const screens = useSelector(selectScreens);
  const loading = useSelector(selectScreenLoading);
  const error = useSelector(selectScreenError);
  const selectedProject = useSelector(selectSelectedProject);

  const [editingRow, setEditingRow] = useState(null);
  const [showUpdateComponent, setShowUpdateComponent] = useState(false);
  const [newCustomField, setNewCustomField] = useState(false);

  useEffect(() => {
    if (selectedProject && selectedProject.id) {
      dispatch(fetchScreensByProject(selectedProject.id));
    }
  }, [dispatch, selectedProject]);

  const closeCreateCustomField = () => setNewCustomField(false);

  const handleEdit = (field) => {
    setEditingRow({ ...field });
    setShowUpdateComponent(true);
  };

  const handleDelete = (id) => {
    // TODO: Implement delete screen logic using Redux/Thunk if needed
  };

  if (showUpdateComponent) {
    return <CustomFieldUpdate field={editingRow} onClose={() => setShowUpdateComponent(false)} />;
  }

  if (loading) {
    return <div>Loading screens...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div>
        <div className="flex items-center justify-between p-4">
          <p className="text-secondary-grey text-lg font-medium">
            {`Screens (${screens.length})`}
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
          dataSource={screens}
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
      <CreateNewScreen isOpen={newCustomField} onClose={closeCreateCustomField} />
    </div>
  );
};

export default Screens;
