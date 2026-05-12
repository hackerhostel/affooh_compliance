import React, { useState, useEffect } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { reviewAuditApi } from "../../../utils/reviewAuditApi.js";
import { useToasts } from "react-toast-notifications";
import NonConformanceDetail from "./NonConformanceDetail.jsx";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectUser } from "../../../state/slice/authSlice.js";
import { createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const complianceOptions = [
  { label: "Compliant", value: "Compliant" },
  { label: "Partial Compliance", value: "Partial Compliance" },
  { label: "Non-Compliance", value: "Non-Compliance" },
];

const severityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const statusOptions = [
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

const DOCUMENT_TYPE = "NON_CONFORMANCE";

const NonConformanceOverview = () => {
  const { addToast } = useToasts();
  const orgId = useSelector((state) => state.auth?.user?.organization?.id);
  const selectedProject = useSelector(selectSelectedProject);
  const currentUser = useSelector(selectUser);
  const projectId = selectedProject?.id;
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [filterValues, setFilterValues] = useState({
    control: "",
    assignee: "",
    compliance: "",
    severity: "",
    status: "",
  });

  const handleSaveConfirm = async ({ version, summary }) => {
    if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
    setIsSaving(true);
    try {
      await createRevisionHistory({
        projectId,
        documentType: DOCUMENT_TYPE,
        version,
        summaryOfChanges: summary,
        revisionDate: new Date().toISOString().split("T")[0],
        name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
        status: "draft",
      });
      addToast("Document saved as draft", { appearance: "success" });
      setShowSavePopup(false);
    } catch {
      addToast("Failed to save document", { appearance: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
    setIsApproving(true);
    try {
      await createApproval({
        projectId,
        documentType: DOCUMENT_TYPE,
        approvalDate: new Date().toISOString().split("T")[0],
        status: "approved",
        approver: {
          id: currentUser?.id,
          name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
          position: currentUser?.position || null,
        },
      });
      addToast("Document approved successfully", { appearance: "success" });
    } catch {
      addToast("Failed to approve document", { appearance: "error" });
    } finally {
      setIsApproving(false);
    }
  };

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

  const fetchNonConformances = async () => {
    setLoading(true);
    try {
      const res = await reviewAuditApi.getNonConformances(orgId, page, limit);
      const data = res.data?.body?.data || [];
      const pagination = res.data?.body?.pagination;
      setRows(data);
      if (pagination) {
        setTotalPages(pagination.totalPages);
        setTotalRecords(pagination.total);
      }
    } catch (e) {
      addToast("Failed to fetch Non Conformances", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      fetchNonConformances();
    }
  }, [orgId, page]);

  if (selectedEvaluationId) {
    return <NonConformanceDetail evaluationId={selectedEvaluationId} onBack={() => setSelectedEvaluationId(null)} />;
  }

  return (
    <div>
      <div className='flex justify-end items-center mt-4 space-x-2'>
        <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
        <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
      </div>
      <div className="items-center justify-between flex px-4">
        <div>
          <span className="text-xl font-semibold">Non Conformance</span>
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="bg-white p-4 mt-5 flex rounded-lg">
        <div className="flex gap-4 p-4">
          <div className="border-2 border-secondary-bcg rounded-lg px-24 py-8">
            <div className="flex flex-col items-center gap-1 text-text-color">
              <span className="text-3xl font-medium">{totalRecords}</span>
              <span className="text-lg font-medium">NCRs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 mt-4">
          <div className="w-28">
            <FormSelect
              name="compliance"
              placeholder="Compliance"
              showLabel={false}
              options={complianceOptions}
              value={filterValues.compliance}
              onChange={(e) =>
                setFilterValues({ ...filterValues, compliance: e.target.value })
              }
            />
          </div>

          <div className="w-28">
            <FormSelect
              name="severity"
              placeholder="Severity"
              showLabel={false}
              options={severityOptions}
              value={filterValues.severity}
              onChange={(e) =>
                setFilterValues({ ...filterValues, severity: e.target.value })
              }
            />
          </div>

          <div className="w-28">
            <FormSelect
              name="status"
              placeholder="Status"
              showLabel={false}
              options={statusOptions}
              value={filterValues.status}
              onChange={(e) =>
                setFilterValues({ ...filterValues, status: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 mt-5 bg-white rounded-md">
        <div className="overflow-auto min-h-[500px]">
          <table className="w-full border-collapse bg-white">
            <thead className="text-left bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-6">ID</th>
                <th className="px-4 py-3">Non Conformance</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Compliance</th>
                <th className="px-4 py-3">Clause</th>
                <th className="px-4 py-3 text-center">Severity</th>
                <th className="px-4 py-3 text-center">Due Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Owner</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>}
              {!loading && rows.map((row) => (
                <tr key={row.evaluationId} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEvaluationId(row.evaluationId)}>
                  <td className="px-4 py-3">NCR-{row.evaluationId}</td>
                  <td className="px-4 py-3 w-[200px]">{row.descriptionOfNC || "N/A"}</td>
                  <td className="px-4 py-3">{row.source || "Audit"}</td>
                  <td className="px-4 py-3">{row.complianceStatus}</td>
                  <td className="px-4 py-3">{row.clauseReference}</td>
                  <td className="px-4 py-3 text-center">{row.severity}</td>
                  <td className="px-4 py-3 text-center">{row.dueDate ? new Date(row.dueDate).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-3 text-center">{row.implementationStatus}</td>
                  <td className="px-4 py-3 ">
                    {row.ownerFirstName ? (
                      <div className="flex items-center justify-left space-x-2">
                        {row.ownerAvatar ? (
                          <img
                            src={row.ownerAvatar}
                            alt={`${row.ownerFirstName} ${row.ownerLastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                            {row.ownerFirstName?.[0]}
                            {row.ownerLastName?.[0]}
                          </div>
                        )}
                        <span>
                          {row.ownerFirstName} {row.ownerLastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No user</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center py-4 border-t">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default NonConformanceOverview;
