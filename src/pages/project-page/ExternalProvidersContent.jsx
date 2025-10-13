import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import UserSelect from "../../components/UserSelect.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  clickedUser,
  doGetProjectUsers,
  selectProjectUserList,
} from "../../state/slice/projectUsersSlice.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import { selectAppConfig } from "../../state/slice/appSlice.js";
import ExternalProvidersOverview from "./ExternalProvidersOverview.jsx";
import ExternalProvidersHistory from "./ExternalProvidersHistory.jsx";
import { getSelectOptions } from "../../utils/commonUtils.js";

const ExternalProvidersContent = () => {
  const dispatch = useDispatch();

  const selectedUser = useSelector(clickedUser);
  const selectedProject = useSelector(selectSelectedProject);
  const projectUsers = useSelector(selectProjectUserList);
  const appConfig = useSelector(selectAppConfig);

  const [isEditable, setIsEditable] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [formValues, setFormValues] = useState({
    documentID: "",
    version: "",
    effectiveDate: "",
    classification: "",
  });

  const dummyUsers = [
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" },
    { id: 3, firstName: "Mike", lastName: "Johnson" },
  ];

  const toggleEditable = () => setIsEditable(!isEditable);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  return (
    <div className="p-6 bg-dashboard-bgc min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
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
                placeholder="Document ID"
                formValues={formValues}
                onChange={(e) =>
                  setFormValues({ ...formValues, documentID: e.target.value })
                }
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors
                showLabel
              />

              <FormInput
                name="version"
                placeholder="Version"
                formValues={formValues}
                onChange={(e) =>
                  setFormValues({ ...formValues, version: e.target.value })
                }
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors
                showLabel
              />

              <FormInput
                name="effectiveDate"
                placeholder="Effective Date"
                formValues={formValues}
                onChange={(e) =>
                  setFormValues({ ...formValues, effectiveDate: e.target.value })
                }
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors
                showLabel
              />

              <FormSelect
                name="classification"
                formValues={formValues}
                options={getSelectOptions(roles)}
                placeholder="Classification"
                onChange={(e) =>
                  setFormValues({ ...formValues, classification: e.target.value })
                }
                disabled={!isEditable}
                formErrors={formErrors}
                showErrors
                showLabel
              />

              <UserSelect
                name="preparedBy"
                label="Prepared By"
                value={selectedUserId}
                onChange={handleUserChange}
                users={dummyUsers}
                disabled={!isEditable}
              />

              <UserSelect
                name="approvedBy"
                label="Approved By"
                value={selectedUserId}
                onChange={handleUserChange}
                users={dummyUsers}
                disabled={!isEditable}
              />

              <UserSelect
                name="owner"
                label="Owner"
                value={selectedUserId}
                onChange={handleUserChange}
                users={dummyUsers}
                disabled={!isEditable}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Tabs */}
        <div className="flex-1 rounded-lg">
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

          <div className="mt-4">
            {activeTab === "overview" && <ExternalProvidersOverview />}
            {activeTab === "history" && <ExternalProvidersHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalProvidersContent;
