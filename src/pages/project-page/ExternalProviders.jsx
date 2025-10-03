import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline/index.js";
import FormInput from "../../components/FormInput.jsx";
import axios from "axios";
import DataGrid, {
  Column,
  ColumnChooser,
  GroupPanel,
  Grouping,
  Paging,
  Scrolling,
  Sorting
} from 'devextreme-react/data-grid';
import { useToasts } from "react-toast-notifications";
import { getSelectOptions } from "../../utils/commonUtils.js";
import FormSelect from "../../components/FormSelect.jsx";
import UserSelect from "../../components/UserSelect.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  clickedUser,
  doGetProjectUsers,
  selectProjectUserList,
} from "../../state/slice/projectUsersSlice.js";
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import {
  doGetOrganizationUsers,
  selectAppConfig,
} from "../../state/slice/appSlice.js";
import useFetchSprint from "../../hooks/custom-hooks/sprint/useFetchSprint.jsx";
import ExternalProvidersHistory from "./ExternalProvidersHistory.jsx";
import ExternalProvidersOverview from "./ExternalProvidersOverview.jsx";



const dummyData = [
  {
    name: "Project Alpha",
    revisionDate: "2025-01-15",
    version: "1.0.0",
    summary: "Initial release with core functionalities.",
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
  },
  {
    name: "Project Beta",
    revisionDate: "2025-02-10",
    version: "1.1.0",
    summary: "Added user authentication and profile features.",
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
  },
  {
    name: "Project Gamma",
    revisionDate: "2025-03-05",
    version: "1.2.0",
    summary: "Improved dashboard UI and fixed bug in reports.",
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
  },
  {
    name: "Project Delta",
    revisionDate: "2025-04-12",
    version: "2.0.0",
    summary: "Major update with API integration.",
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
  },
  {
    name: "Project Omega",
    revisionDate: "2025-05-20",
    version: "2.1.0",
    summary: "Security patches and performance optimization.",
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
  }
];


const ExternalProvidersContentPage = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [roles, setRoles] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const selectedUser = useSelector(clickedUser);
  const selectedProject = useSelector(selectSelectedProject);
  const projectUsers = useSelector(selectProjectUserList);
  const appConfig = useSelector(selectAppConfig);
  const [activeTab, setActiveTab] = useState("overview");

  // Task filtering states
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    tasks: 0,
    bugs: 0,
    stories: 0,
  });



  // Pagination setup
  const tasksPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dummyData.length / tasksPerPage);
  const indexOfLastItem = currentPage * tasksPerPage;
  const indexOfFirstItem = indexOfLastItem - tasksPerPage;
  const currentPageData = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };




  const {
    data: sprintData,
    error,
    loading,
    refetch: refetchSprint,
  } = useFetchSprint(selectedProject?.id, selectedUser?.email);

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };





  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  useEffect(() => {
    if (sprintData?.tasks && sprintData.tasks.length > 0) {
      const assigneeMap = new Map();
      assigneeMap.set("", { value: "", label: "All Assignees" });

      sprintData.tasks.forEach((task) => {
        const assignee = task.assignee;
        if (assignee?.id && assignee?.firstName && assignee?.lastName) {
          const fullName = `${assignee.firstName} ${assignee.lastName}`;
          if (!assigneeMap.has(assignee.id)) {
            assigneeMap.set(assignee.id, {
              value: assignee.id,
              label: fullName,
            });
          }
        }
      });

      setAssigneeOptions(Array.from(assigneeMap.values()));
    } else {
      setAssigneeOptions([{ value: "", label: "All Assignees" }]);
    }
  }, [sprintData]);

  const [formValues, setFormValues] = useState({
    email: selectedUser?.email,
    contactNumber: selectedUser?.contactNumber,
    teamID: selectedUser?.teamID,
    userRole: selectedUser?.userRole,
  });

  useEffect(() => {
    setFormValues({ ...formValues, ...selectedUser });
  }, [selectedUser]);

  useEffect(() => {
    if (selectedProject?.id && selectedUser?.email) {
      refetchSprint();
    }
  }, [selectedProject?.id, selectedUser?.email]);

  useEffect(() => {
    if (sprintData?.tasks && sprintData.tasks.length > 0) {
      const transformedTasks = sprintData.tasks.map((task, index) => ({
        ...transformTask(task),
        key: `${(index + 1).toString().padStart(3, "0")}`,
      }));

      setFilteredTaskList(transformedTasks);

      const all = transformedTasks.length;
      const tasks = transformedTasks.filter(
        (task) => task.type === "Task"
      ).length;
      const bugs = transformedTasks.filter(
        (task) => task.type === "Bug"
      ).length;
      const stories = transformedTasks.filter(
        (task) => task.type === "Story"
      ).length;
      setTaskCounts({ all, tasks, bugs, stories });
      setCurrentPage(1); // Reset to first page when data changes
    } else {
      setFilteredTaskList([]);
      setTaskCounts({ all: 0, tasks: 0, bugs: 0, stories: 0 });
    }
  }, [sprintData]);

  useEffect(() => {
    applyFilters();
  }, [
    assigneeFilter,
    statusFilter,
    priorityFilter,
    startDateFilter,
    endDateFilter,
    sprintData,
    searchTerm,
  ]);

  const applyFilters = () => {
    if (!sprintData?.tasks || sprintData.tasks.length === 0) return;

    let filtered = sprintData.tasks.map((task, index) => ({
      ...transformTask(task),
      key: `${(index + 1).toString().padStart(3, "0")}`,
    }));

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (assigneeFilter !== "") {
      filtered = filtered.filter(
        (task) =>
          assigneeFilter === "" || task.assigneeId === Number(assigneeFilter)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (task) =>
          task.status &&
          task.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter(
        (task) =>
          task.priority &&
          task.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter((task) => {
        if (!task.startDate || task.startDate === "N/A") return false;

        const taskStartDate = new Date(task.startDate);
        if (isNaN(taskStartDate.getTime())) return false;

        return (
          taskStartDate.getDate() === startDateFilter.getDate() &&
          taskStartDate.getMonth() === startDateFilter.getMonth() &&
          taskStartDate.getFullYear() === startDateFilter.getFullYear()
        );
      });
    }

    if (endDateFilter) {
      filtered = filtered.filter((task) => {
        if (!task.endDate || task.endDate === "N/A") return false;

        const taskEndDate = new Date(task.endDate);
        if (isNaN(taskEndDate.getTime())) return false;

        return (
          taskEndDate.getDate() === endDateFilter.getDate() &&
          taskEndDate.getMonth() === endDateFilter.getMonth() &&
          taskEndDate.getFullYear() === endDateFilter.getFullYear()
        );
      });
    }

    filtered = filtered.map((task, index) => ({
      ...task,
      key: `${(index + 1).toString().padStart(3, "0")}`,
    }));

    setFilteredTaskList(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };


  // Calculate pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTaskList.slice(
    indexOfFirstTask,
    indexOfLastTask
  );



  const dummyUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" },
    { id: 3, firstName: "Mike", lastName: "Johnson" },
  ];

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
    console.log("Selected user ID:", e.target.value);
  };

  return (
    <div className="p-6 bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar - Fixed width for user profile */}
        <div className="w-full md:w-72 bg-white rounded-lg p-6 h-fit sticky top-16">
          <div className="flex justify-end">
            <PencilIcon
              onClick={toggleEditable}
              className="w-4 text-secondary-grey cursor-pointer"
            />
          </div>
          <div className="flex flex-col items-center">
            {selectedUser?.avatar ? (
              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                {selectedUser?.firstName?.[0]}
                {selectedUser?.lastName?.[0]}
              </div>
            )}
            <span className="text-xl font-semibold text-center mt-5 text-secondary-grey mb-1">
              Scope of the quality management system
            </span>

            <hr className="w-full mt-6 border-t border-gray-200" />
            <div className="w-full space-y-4 mt-6">
              <FormInput
                name="documentID"
                formValues={formValues}
                placeholder="Document ID"
                onChange={(e) =>
                  setFormValues({ ...formValues, documentID: e.target.value })
                }
                className={`w-full p-2 border rounded-md ${isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                  }`}
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors={true}
                showLabel={true}
              />

              <FormInput
                name="version"
                formValues={formValues}
                placeholder="Version"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    version: e.target.value,
                  })
                }
                className={`w-full p-2 border rounded-md ${isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                  }`}
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors={true}
                showLabel={true}
              />

              <FormInput
                name="effectiveDate"
                formValues={formValues}
                placeholder="Effective Date"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    effectiveDate: e.target.value,
                  })
                }
                className={`w-full p-2 border rounded-md ${isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                  }`}
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors={true}
                showLabel={true}
              />

              <FormSelect
                name="classification"
                formValues={formValues}
                options={getSelectOptions(roles)}
                placeholder="Classification"
                onChange={(e) =>
                  setFormValues({ ...formValues, userRole: e.target.value })
                }
                className={`w-full p-2 border rounded-md ${isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                  }`}
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors={true}
                showLabel={true}
              />

              <div className="mb-6 mt-5">
                <UserSelect
                  name="owner"
                  label="Prepared By"
                  value={selectedUserId}
                  onChange={handleUserChange}
                  users={dummyUsers}
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                />
              </div>

              <div className="mb-6 mt-5">
                <UserSelect
                  name="owner"
                  label="Approved By"
                  value={selectedUserId}
                  onChange={handleUserChange}
                  users={dummyUsers}
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                />
              </div>

              <div className="mb-6 mt-5">
                <UserSelect
                  name="owner"
                  label="Owner"
                  value={selectedUserId}
                  onChange={handleUserChange}
                  users={dummyUsers}
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                />
              </div>


            </div>
          </div>
        </div>

        {/* tables */}

       <div style={{ flex: 1 }} className="rounded-lg">
      {/* Tab Buttons */}
      <div className="flex justify-end">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2 rounded-2xl ${
              activeTab === "overview"
                ? "bg-black text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-2xl ${
              activeTab === "history"
                ? "bg-black text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            History
          </button>
        </div>
      </div>

 
      {activeTab === "overview" && <ExternalProvidersOverview />}
      {activeTab === "history" && <ExternalProvidersHistory/>}
    </div>




      </div>
    </div>
  );
};

export default ExternalProvidersContentPage;
