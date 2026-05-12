import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import { selectUser } from "../../../state/slice/authSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { fetchCompetencyMatrix, createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const COMPETENCY_FIELDS = [
  { key: "communication", label: "Communication" },
  { key: "technicalSkills", label: "Technical Skills" },
  { key: "leadership", label: "Leadership" },
  { key: "problemSolving", label: "Problem Solving" },
  { key: "domainKnowledge", label: "Domain Knowledge" },
];

const LEVEL_COLORS = {
  Excellent: "bg-green-100 text-green-700",
  Good: "bg-blue-100 text-blue-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  "Need To Improve": "bg-orange-100 text-orange-700",
  Poor: "bg-red-100 text-red-700",
};

const LevelBadge = ({ value }) => {
  if (!value) return <span className="text-gray-400 text-xs">-</span>;
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        LEVEL_COLORS[value] || "bg-gray-100 text-gray-600"
      }`}
    >
      {value}
    </span>
  );
};

const DOCUMENT_TYPE = "COMPETENCY_MATRIX";

const CompetencyMatrixOverview = () => {
  const { addToast } = useToasts();
  const currentUser = useSelector(selectUser);
  const selectedProject = useSelector(selectSelectedProject);
  const projectId = selectedProject?.id;
  const [competencyRows, setCompetencyRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

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

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCompetencyMatrix();
      setCompetencyRows(Array.isArray(data) ? data : []);
    } catch {
      setCompetencyRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteClick = (id) => {
    setEntryToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      setCompetencyRows((prev) => prev.filter((row) => row.id !== entryToDelete));
      addToast("Entry removed from view", { appearance: "success" });
      setDeleteModalOpen(false);
      setEntryToDelete(null);
    }
  };

  return (
    <div>
      <div className='flex justify-end items-center mt-4 space-x-2'>
        <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
        <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
      </div>
      <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Competency Matrix</span>
      </div>

      <div className="bg-white rounded p-3 mt-2 overflow-x-auto">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-4 px-4 w-10 text-center">#</th>
                <th className="py-4 px-4">Employee</th>
                {COMPETENCY_FIELDS.map((f) => (
                  <th key={f.key} className="py-4 px-4 whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {competencyRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COMPETENCY_FIELDS.length + 3}
                    className="text-center text-gray-500 py-8"
                  >
                    No competency matrix records found
                  </td>
                </tr>
              ) : (
                competencyRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-center">{index + 1}</td>
                    <td className="py-4 px-4">
                      {row.employee ||
                        (row.user
                          ? `${row.user.firstName} ${row.user.lastName}`
                          : "-")}
                    </td>
                    {COMPETENCY_FIELDS.map((f) => (
                      <td key={f.key} className="py-4 px-4">
                        <LevelBadge value={row[f.key]} />
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <TrashIcon
                          onClick={() => handleDeleteClick(row.id)}
                          className="w-5 h-5 text-text-color cursor-pointer hover:text-red-500"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        </div>
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Entry?"
        message="Are you sure you want to remove this competency matrix entry?"
      />
      </div>
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default CompetencyMatrixOverview;
