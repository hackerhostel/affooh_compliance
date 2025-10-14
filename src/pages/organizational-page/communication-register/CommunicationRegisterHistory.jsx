import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import UserSelect from "../../../components/UserSelect.jsx";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { clickedUser } from "../../../state/slice/projectUsersSlice.js";
import { getSelectOptions } from "../../../utils/commonUtils.js";
import DataGrid, {
  Column,
  ColumnChooser,
  GroupPanel,
  Grouping,
  Paging,
  Scrolling,
  Sorting
} from "devextreme-react/data-grid";

// Dummy Data
const dummyData = [
  {
    name: "Project Alpha",
    revisionDate: "2025-01-15",
    version: "1.0.0",
    summary: "Initial release with core functionalities.",
    responsibility: {
      firstName: "John",
      lastName: "Doe",
      avatar: ""
    }
  },
  {
    name: "Project Beta",
    revisionDate: "2025-02-10",
    version: "1.1.0",
    summary: "Added user authentication and profile features.",
    responsibility: {
      firstName: "John",
      lastName: "Doe",
      avatar: ""
    }
  },
  {
    name: "Project Gamma",
    revisionDate: "2025-03-05",
    version: "1.2.0",
    summary: "Improved dashboard UI and fixed bug in reports.",
    responsibility: {
      firstName: "John",
      lastName: "Doe",
      avatar: ""
    }
  },
  {
    name: "Project Delta",
    revisionDate: "2025-04-12",
    version: "2.0.0",
    summary: "Major update with API integration.",
    responsibility: {
      firstName: "John",
      lastName: "Doe",
      avatar: ""
    }
  },
  {
    name: "Project Omega",
    revisionDate: "2025-05-20",
    version: "2.1.0",
    summary: "Security patches and performance optimization.",
    responsibility: {
      firstName: "John",
      lastName: "Doe",
      avatar: ""
    }
  }
];

const CommunicationRegisterHistory = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const selectedUser = useSelector(clickedUser);

  const [formValues, setFormValues] = useState({
    documentID: "DOC-001",
    version: "1.0",
    effectiveDate: "2025-10-07",
    classification: "",
    preparedBy: "",
    approvedBy: "",
    owner: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const tasksPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy options and users for sidebar
  const roles = ["Internal", "Confidential", "Public"];
  const dummyUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const toggleEditable = () => setIsEditable((prev) => !prev);
  const handleUserChange = (field, userId) => {
    setFormValues({ ...formValues, [field]: userId });
  };

  const totalPages = Math.ceil(dummyData.length / tasksPerPage);
  const indexOfLastItem = currentPage * tasksPerPage;
  const indexOfFirstItem = indexOfLastItem - tasksPerPage;
  const currentPageData = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Sidebar moved here */}
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
              {selectedUser?.firstName?.[0] || "Q"}
              {selectedUser?.lastName?.[0] || "M"}
            </div>
          )}
          <span className="text-lg font-semibold text-center mt-5  mb-1">
            Scope
          </span>

          <hr className="w-full mt-6 border-t border-gray-200" />

          <div className="w-full space-y-4 mt-6">
            <FormInput
              name="documentID"
              label="Document ID"
              formValues={formValues}
              placeholder="Document ID"
              onChange={(e) =>
                setFormValues({ ...formValues, documentID: e.target.value })
              }
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
              formErrors={formErrors}
              showErrors
              showLabel
            />

            <FormInput
              name="version"
              label="Version"
              formValues={formValues}
              placeholder="Version"
              onChange={(e) =>
                setFormValues({ ...formValues, version: e.target.value })
              }
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
              formErrors={formErrors}
              showErrors
              showLabel
            />

            <FormInput
              name="effectiveDate"
              label="Effective Date"
              formValues={formValues}
              placeholder="Effective Date"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  effectiveDate: e.target.value,
                })
              }
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
              formErrors={formErrors}
              showErrors
              showLabel
            />

            <FormSelect
              name="classification"
              label="Classification"
              formValues={formValues}
              options={getSelectOptions(roles)}
              placeholder="Select Classification"
              onChange={(e) =>
                setFormValues({ ...formValues, classification: e.target.value })
              }
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
              formErrors={formErrors}
              showErrors
              showLabel
            />

            <UserSelect
              name="preparedBy"
              label="Prepared By"
              value={formValues.preparedBy}
              onChange={(value) => handleUserChange("preparedBy", value)}
              users={dummyUsers}
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
            />

            <UserSelect
              name="approvedBy"
              label="Approved By"
              value={formValues.approvedBy}
              onChange={(value) => handleUserChange("approvedBy", value)}
              users={dummyUsers}
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
            />

            <UserSelect
              name="owner"
              label="Owner"
              value={formValues.owner}
              onChange={(value) => handleUserChange("owner", value)}
              users={dummyUsers}
              className={`w-full p-2 border rounded-md ${
                isEditable
                  ? "bg-white text-secondary-grey border-border-color"
                  : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              }`}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      {/* Right content */}
      <div style={{ flex: 1 }} className="flex-1 rounded-lg p-6">
      {/* Document Revision History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xl text-text-color font-semibold">
              Document Revision History
            </span>
          </div>
        </div>

        <div className="bg-white">
          <DataGrid
            dataSource={currentPageData}
            width="100%"
            className="rounded-lg overflow-hidden dummy-grid-table mb-10"
            showRowLines={true}
            showColumnLines={false}
          >
            <ColumnChooser enabled={false} mode="select" />
            <GroupPanel visible={false} />
            <Grouping autoExpandAll={false} />
            <Paging enabled={false} />
            <Scrolling columnRenderingMode="virtual" />
            <Sorting mode="multiple" />

            <Column dataField="name" caption="Name" width={150} />
            <Column dataField="revisionDate" caption="Revision Date" width={120} />
            <Column dataField="version" caption="Version" width={120} />
            <Column dataField="summary" caption="Summary of Changes" width={200} />
          </DataGrid>

          {/* Pagination */}
          <div className="w-full flex gap-5 items-center justify-end">
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className={"w-4 h-4 text-secondary-grey"} />
            </button>
            <span className="text-gray-500 text-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className={"w-4 h-4 text-secondary-grey"} />
            </button>
          </div>
        </div>
      </div>

      {/* Document Approved */}
      <div className="flex justify-between items-center mt-14 mb-4">
        <div>
          <span className="text-xl text-text-color font-semibold">
            Document Approved
          </span>
        </div>
      </div>

      <div className="bg-white">
        <DataGrid
          dataSource={currentPageData}
          width="100%"
          className="rounded-lg overflow-hidden dummy-grid-table mb-10"
          showRowLines={true}
          showColumnLines={false}
        >
          <ColumnChooser enabled={false} mode="select" />
          <GroupPanel visible={false} />
          <Grouping autoExpandAll={false} />
          <Paging enabled={false} />
          <Scrolling columnRenderingMode="virtual" />
          <Sorting mode="multiple" />

          <Column
            dataField="responsibility"
            caption="Name"
            cellRender={({ data }) => {
              const user = data?.responsibility;

              if (!user)
                return <span className="text-gray-400 italic">No user</span>;

              return (
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                  )}
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              );
            }}
          />

          <Column dataField="version" caption="Position" width={120} />
          <Column dataField="revisionDate" caption="Date" />
        </DataGrid>

        {/* Pagination */}
        <div className="w-full flex gap-5 items-center justify-end">
          <button
            onClick={handlePreviousPage}
            className={`p-2 rounded-full bg-gray-200 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className={"w-4 h-4 text-secondary-grey"} />
          </button>
          <span className="text-gray-500 text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className={`p-2 rounded-full bg-gray-200 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className={"w-4 h-4 text-secondary-grey"} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CommunicationRegisterHistory;
