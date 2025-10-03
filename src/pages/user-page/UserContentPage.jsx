import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline/index.js";
import FormInput from "../../components/FormInput.jsx";
import { useToasts } from "react-toast-notifications";
import { getSelectOptions } from "../../utils/commonUtils.js";
import FormSelect from "../../components/FormSelect.jsx";
import UserSelect from "../../components/UserSelect.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  clickedUser,
} from "../../state/slice/projectUsersSlice.js";
import DocumentaryHistory from "./DocumentaryHistory.jsx";
import DocumentaryOverview from "./DocumentaryOverview.jsx";


const DocumentaryContentPage = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const selectedUser = useSelector(clickedUser);
  const [activeTab, setActiveTab] = useState("overview");





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
                className={`px-6 py-2 rounded-2xl ${activeTab === "overview"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-2xl ${activeTab === "history"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
              >
                History
              </button>
            </div>
          </div>


          {activeTab === "overview" && <DocumentaryOverview />}
          {activeTab === "history" && <DocumentaryHistory />}
        </div>
      </div>
    </div>
  );
};

export default DocumentaryContentPage;
