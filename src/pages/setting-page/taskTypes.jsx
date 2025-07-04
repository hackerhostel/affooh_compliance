import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Sorting,
} from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import CustomFieldUpdate from "./CustomFieldUpdate";
import CreateTaskType from "./CreateTaskType";
import {
  fetchAllTaskTypes,
  selectTaskTypes,
  selectTaskTypeLoading,
  selectTaskTypeError,
} from "../../state/slice/taskTypeSlice";
import axios from "axios";

const TaskTypes = () => {
  const dispatch = useDispatch();
  const taskTypes = useSelector(selectTaskTypes);
  const loading = useSelector(selectTaskTypeLoading);
  const error = useSelector(selectTaskTypeError);

  const [editingRow, setEditingRow] = useState(null);
  const [showUpdateComponent, setShowUpdateComponent] = useState(false);
  const [newCustomField, setNewCustomField] = useState(false);

  const closeCreateCustomField = () => setNewCustomField(false);

  const handleEdit = (field) => {
    setEditingRow({ ...field });
    setShowUpdateComponent(true);
  };

  useEffect(() => {
    dispatch(fetchAllTaskTypes());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task type?")) {
      axios
        .delete(`/task-types/${id}`)
        .then(() => {
          dispatch(fetchAllTaskTypes());
        })
        .catch((error) => {
          console.error("Error deleting task type:", error);
          alert("Error deleting task type. Please try again.");
        });
    }
  };

  const formatProjects = (projects) => {
    if (!projects || projects.length === 0) return "No Projects";
    return projects.map((p) => p.name).join(", ");
  };

  const formatScreen = (screen) => {
    if (!screen) return "No Screen";
    return screen.name;
  };

  if (showUpdateComponent) {
    return (
      <CustomFieldUpdate
        field={editingRow}
        onClose={() => setShowUpdateComponent(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-3 bg-dashboard-bgc h-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-text-color">Loading task types...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-dashboard-bgc h-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">
            Error loading task types: {error}
            <button
              onClick={() => dispatch(fetchAllTaskTypes())}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-dashboard-bgc h-full">
      <div>
        <div className="flex items-center justify-between p-4">
          <p className="text-secondary-grey text-lg font-medium">
            {`Task Types (${taskTypes.length})`}
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
          dataSource={taskTypes}
          allowColumnReordering={true}
          showBorders={false}
          width="100%"
          className="rounded-lg overflow-hidden"
          showRowLines={true}
          showColumnLines={false}
          noDataText="No task types found"
        >
          <Scrolling columnRenderingMode="virtual" />
          <Sorting mode="multiple" />
          <Paging enabled={true} pageSize={10} />

          <Column dataField="name" caption="Name" width="20%" />
          <Column dataField="description" caption="Description" width="30%" />
          <Column
            dataField="projects"
            caption="Projects"
            width="25%"
            cellRender={(data) => <div>{formatProjects(data.value)}</div>}
          />
          <Column
            dataField="screen"
            caption="Screen"
            width="15%"
            cellRender={(data) => <div>{formatScreen(data.value)}</div>}
          />
          <Column
            caption="Actions"
            width="10%"
            cellRender={(data) => (
              <div className="flex space-x-2">
                <PencilSquareIcon
                  className="w-5 text-text-color cursor-pointer hover:text-blue-500"
                  onClick={() => handleEdit(data.data)}
                />
                <TrashIcon
                  className="w-5 text-text-color cursor-pointer hover:text-red-500"
                  onClick={() => handleDelete(data.data.id)}
                />
              </div>
            )}
          />
        </DataGrid>
      </div>
      <CreateTaskType
        isOpen={newCustomField}
        onClose={closeCreateCustomField}
      />
    </div>
  );
};

export default TaskTypes;
