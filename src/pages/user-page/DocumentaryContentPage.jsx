import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import UserSelect from "../../components/UserSelect.jsx";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { clickedUser } from "../../state/slice/projectUsersSlice.js";
import { getSelectOptions } from "../../utils/commonUtils.js";
import DocumentaryOverview from "./DocumentaryOverview.jsx";
import DocumentaryHistory from "./DocumentaryHistory.jsx";

const DocumentaryContentPage = () => {
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
  const [activeTab, setActiveTab] = useState("overview");

  // Dummy options and users
  const roles = ["Internal", "Confidential", "Public"];
  const dummyUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  // Handlers
  const toggleEditable = () => setIsEditable((prev) => !prev);

  const handleUserChange = (field, userId) => {
    setFormValues({ ...formValues, [field]: userId });
  };

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
                {selectedUser?.firstName?.[0] || "Q"}
                {selectedUser?.lastName?.[0] || "M"}
              </div>
            )}
            <span className="text-lg font-semibold text-center mt-5 text-secondary-grey mb-1">
              Scope of the Quality Management System
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

        {/* Right Section - Tabs */}
        <div style={{ flex: 1 }} className="rounded-lg">
          <div className="flex justify-end mb-6">
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

          {activeTab === "overview" && <DocumentaryOverview />}
          {activeTab === "history" && <DocumentaryHistory />}
        </div>
      </div>
    </div>
  );
};

export default DocumentaryContentPage;
