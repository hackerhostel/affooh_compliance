import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import UserSelect from "../../../components/UserSelect.jsx";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";
import { getSelectOptions } from "../../../utils/commonUtils.js";
import useFetchOrganizationalContext from "../../../hooks/custom-hooks/compliance/useFetchOrganizationalContext.jsx";
import useFetchRevisionHistory from "../../../hooks/custom-hooks/compliance/useFetchRevisionHistory.jsx";
import useFetchApprovals from "../../../hooks/custom-hooks/compliance/useFetchApprovals.jsx";
import DataGrid, {
  Column,
  ColumnChooser,
  GroupPanel,
  Grouping,
  Paging,
  Scrolling,
  Sorting
} from "devextreme-react/data-grid";

export default function DocumentHistory() {
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const projectUserList = useSelector(selectProjectUserList);
  const projectId = selectedProject?.id;

  const { data: contextData } = useFetchOrganizationalContext(projectId, 'SWOT');
  const { data: revisionHistory } = useFetchRevisionHistory(projectId, 'SWOT');
  const { data: approvals } = useFetchApprovals(projectId, 'SWOT');

  const [formValues, setFormValues] = useState({
    documentID: "",
    version: "",
    effectiveDate: "",
    classification: "",
    preparedBy: "",
    approvedBy: "",
    owner: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const tasksPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const roles = [
    { value: "Public", label: "Public" },
    { value: "Confidential", label: "Confidential" },
    { value: "Restricted", label: "Restricted" }
  ];

  useEffect(() => {
    if (contextData?.id) {
      setFormValues({
        documentID: contextData.documentID || "",
        version: contextData.version || "",
        effectiveDate: contextData.effectiveDate || "",
        classification: contextData.classification || "",
        preparedBy: contextData.preparedBy?.id || "",
        approvedBy: contextData.approvedBy?.id || "",
        owner: contextData.owner?.id || "",
      });
    }
  }, [contextData]);

  const toggleEditable = () => setIsEditable((prev) => !prev);
  const handleUserChange = (field, userId) => {
    setFormValues({ ...formValues, [field]: userId });
  };

  const revisionRows = useMemo(() => {
    return (revisionHistory || []).map((item) => ({
      name: contextData?.documentType || "SWOT",
      revisionDate: item.revisionDate,
      version: item.version,
      summary: item.summaryOfChanges,
    }));
  }, [revisionHistory, contextData]);

  const approvalRows = useMemo(() => {
    return (approvals || []).map((item) => ({
      name: item.approver?.name || "Unknown",
      position: item.approver?.position || "",
      approvalDate: item.approvalDate,
    }));
  }, [approvals]);

  const totalPages = Math.ceil(revisionRows.length / tasksPerPage) || 1;
  const indexOfLastItem = currentPage * tasksPerPage;
  const indexOfFirstItem = indexOfLastItem - tasksPerPage;
  const currentPageData = revisionRows.slice(indexOfFirstItem, indexOfLastItem);

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
          {false ? (
            <img
              src={""}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
              {"S"}
              {"W"}
            </div>
          )}
          <span className="text-lg font-semibold text-center mt-5  mb-1">
            Organizational <br></br> Context
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
              options={roles}
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
              onChange={({ target: { value } }) => handleUserChange("preparedBy", value)}
              users={projectUserList || []}
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
              onChange={({ target: { value } }) => handleUserChange("approvedBy", value)}
              users={projectUserList || []}
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
              onChange={({ target: { value } }) => handleUserChange("owner", value)}
              users={projectUserList || []}
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
            <Column dataField="summary" caption="Summary of Changes" width={220} />
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
          dataSource={approvalRows}
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

          <Column dataField="name" caption="Name" width={200} />
          <Column dataField="position" caption="Position" width={180} />
          <Column dataField="approvalDate" caption="Date" width={140} />
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
