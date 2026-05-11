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
import { selectUser } from "../../../state/slice/authSlice.js";
import useFetchOrganizationalContext from "../../../hooks/custom-hooks/compliance/useFetchOrganizationalContext.jsx";
import useFetchRevisionHistory from "../../../hooks/custom-hooks/compliance/useFetchRevisionHistory.jsx";
import useFetchApprovals from "../../../hooks/custom-hooks/compliance/useFetchApprovals.jsx";
import { createOrganizationalContext, updateOrganizationalContext } from "../../../utils/complianceApi.js";
import DataGrid, {
  Column,
  ColumnChooser,
  GroupPanel,
  Grouping,
  Paging,
  Scrolling,
  Sorting
} from "devextreme-react/data-grid";

const DOCUMENT_TYPE = "SUPPLIER_MANAGEMENT";

const SupplierHistory = () => {
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const projectUserList = useSelector(selectProjectUserList);
  const currentUser = useSelector(selectUser);
  const projectId = selectedProject?.id;

  const { data: contextData, refetch: refetchContext } = useFetchOrganizationalContext(projectId, DOCUMENT_TYPE);
  const { data: revisionHistory } = useFetchRevisionHistory(projectId, DOCUMENT_TYPE);
  const { data: approvals } = useFetchApprovals(projectId, DOCUMENT_TYPE);

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
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const tasksPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);

  const classificationOptions = [
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
        preparedBy: contextData.preparedBy?.id || currentUser?.id || "",
        approvedBy: contextData.approvedBy?.id || "",
        owner: contextData.owner?.id || "",
      });
    } else if (currentUser) {
      setFormValues((prev) => ({ ...prev, preparedBy: currentUser.id || "" }));
    }
  }, [contextData, currentUser]);

  const toggleEditable = () => setIsEditable((prev) => !prev);
  const handleUserChange = (field, userId) => setFormValues({ ...formValues, [field]: userId });

  const handleSaveMeta = async () => {
    if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
    setIsSavingMeta(true);
    try {
      if (contextData?.id) {
        await updateOrganizationalContext(contextData.id, {
          documentID: formValues.documentID,
          effectiveDate: formValues.effectiveDate || null,
          classification: formValues.classification || undefined,
          owner: formValues.owner || null,
          skipRevisionHistory: true,
        });
      } else {
        await createOrganizationalContext({
          projectID: projectId,
          documentType: DOCUMENT_TYPE,
          documentID: formValues.documentID,
          effectiveDate: formValues.effectiveDate || null,
          classification: formValues.classification || "Public",
          preparedBy: currentUser?.id || null,
          owner: formValues.owner || null,
        });
      }
      addToast("Document info saved", { appearance: "success" });
      setIsEditable(false);
      refetchContext();
    } catch {
      addToast("Failed to save document info", { appearance: "error" });
    } finally {
      setIsSavingMeta(false);
    }
  };

  const revisionRows = useMemo(() => {
    return (revisionHistory || []).map((item) => ({
      name: item.name || `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
      revisionDate: item.revisionDate,
      version: item.version,
      summary: item.summaryOfChanges,
    }));
  }, [revisionHistory, currentUser]);

  const approvalRows = useMemo(() => {
    return (approvals || []).map((item) => ({
      name: item.approver?.name || "Unknown",
      position: item.approver?.position || "",
      approvalDate: item.approvalDate,
    }));
  }, [approvals]);

  const totalRevPages = Math.ceil(revisionRows.length / tasksPerPage) || 1;
  const revStart = (currentPage - 1) * tasksPerPage;
  const currentRevData = revisionRows.slice(revStart, revStart + tasksPerPage);

  const totalApprovalPages = Math.ceil(approvalRows.length / tasksPerPage) || 1;
  const approvalStart = (approvalPage - 1) * tasksPerPage;
  const currentApprovalData = approvalRows.slice(approvalStart, approvalStart + tasksPerPage);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Sidebar */}
      <div className="w-full md:w-72 bg-white rounded-lg p-6 h-fit sticky top-16">
        <div className="flex justify-end gap-2 items-center">
          <PencilIcon onClick={toggleEditable} className="w-4 text-secondary-grey cursor-pointer" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {"S"}{"M"}
          </div>
          <span className="text-lg font-semibold text-center mt-5 mb-1">
            Supplier <br /> Management
          </span>

          <hr className="w-full mt-6 border-t border-gray-200" />

          <div className="w-full space-y-4 mt-6">
            <FormInput name="documentID" label="Document ID" formValues={formValues} placeholder="Document ID"
              onChange={(e) => setFormValues({ ...formValues, documentID: e.target.value })}
              className={`w-full p-2 border rounded-md ${isEditable ? "bg-white text-secondary-grey border-border-color" : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"}`}
              disabled={!isEditable} formErrors={formErrors} showErrors showLabel />

            <FormInput name="version" label="Version" formValues={formValues} placeholder="Version"
              onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
              className="w-full p-2 border rounded-md bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              disabled={true} formErrors={formErrors} showErrors showLabel />

            <FormInput name="effectiveDate" label="Effective Date" type="date" formValues={formValues} placeholder="Effective Date"
              onChange={(e) => setFormValues({ ...formValues, effectiveDate: e.target.value })}
              className={`w-full p-2 border rounded-md ${isEditable ? "bg-white text-secondary-grey border-border-color" : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"}`}
              disabled={!isEditable} formErrors={formErrors} showErrors showLabel />

            <FormSelect name="classification" label="Classification" formValues={formValues} options={classificationOptions} placeholder="Select Classification"
              onChange={(e) => setFormValues({ ...formValues, classification: e.target.value })}
              className={`w-full p-2 border rounded-md ${isEditable ? "bg-white text-secondary-grey border-border-color" : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"}`}
              disabled={!isEditable} formErrors={formErrors} showErrors showLabel />

            <UserSelect name="preparedBy" label="Prepared By" value={formValues.preparedBy}
              onChange={({ target: { value } }) => handleUserChange("preparedBy", value)}
              users={projectUserList || []}
              className="w-full p-2 border rounded-md bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              disabled={true} />

            <UserSelect name="approvedBy" label="Approved By" value={formValues.approvedBy}
              onChange={({ target: { value } }) => handleUserChange("approvedBy", value)}
              users={projectUserList || []}
              className="w-full p-2 border rounded-md bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
              disabled={true} />

            <UserSelect name="owner" label="Owner" value={formValues.owner}
              onChange={({ target: { value } }) => handleUserChange("owner", value)}
              users={projectUserList || []}
              className={`w-full p-2 border rounded-md ${isEditable ? "bg-white text-secondary-grey border-border-color" : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"}`}
              disabled={!isEditable} />

            {isEditable && (
              <button
                onClick={handleSaveMeta}
                disabled={isSavingMeta}
                className="w-full mt-2 text-xs font-medium text-white bg-primary-pink px-3 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
              >
                {isSavingMeta ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right content */}
      <div style={{ flex: 1 }} className="flex-1 rounded-lg p-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl text-text-color font-semibold">Document Revision History</span>
          </div>
          <div className="bg-white">
            <DataGrid dataSource={currentRevData} width="100%" className="rounded-lg overflow-hidden dummy-grid-table mb-10" showRowLines={true} showColumnLines={false}>
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
            <div className="w-full flex gap-5 items-center justify-end">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
                <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
              </button>
              <span className="text-gray-500 text-center">Page {currentPage} of {totalRevPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalRevPages))} disabled={currentPage === totalRevPages} className={`p-2 rounded-full bg-gray-200 ${currentPage === totalRevPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
                <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-14 mb-4">
          <span className="text-xl text-text-color font-semibold">Document Approved</span>
        </div>
        <div className="bg-white">
          <DataGrid dataSource={currentApprovalData} width="100%" className="rounded-lg overflow-hidden dummy-grid-table mb-10" showRowLines={true} showColumnLines={false}>
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
          <div className="w-full flex gap-5 items-center justify-end">
            <button onClick={() => setApprovalPage((p) => Math.max(p - 1, 1))} disabled={approvalPage === 1} className={`p-2 rounded-full bg-gray-200 ${approvalPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
              <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
            </button>
            <span className="text-gray-500 text-center">Page {approvalPage} of {totalApprovalPages}</span>
            <button onClick={() => setApprovalPage((p) => Math.min(p + 1, totalApprovalPages))} disabled={approvalPage === totalApprovalPages} className={`p-2 rounded-full bg-gray-200 ${approvalPage === totalApprovalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
              <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierHistory;
