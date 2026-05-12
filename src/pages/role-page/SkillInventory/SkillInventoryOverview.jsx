import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import { selectUser } from "../../../state/slice/authSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { fetchSkillInventory, deleteSkillInventoryEntry, createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const DOCUMENT_TYPE = "SKILL_INVENTORY";

const PROFICIENCY_COLORS = {
  Advance: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Beginner: "bg-gray-100 text-gray-600",
};

const SkillInventoryOverview = () => {
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const selectedProject = useSelector(selectSelectedProject);
  const projectId = selectedProject?.id;
  const [skillRows, setSkillRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
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
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
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
          id: user?.id,
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          position: user?.position || null,
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
      const data = await fetchSkillInventory(user?.organization?.id);
      setSkillRows(Array.isArray(data) ? data : []);
    } catch {
      // No data yet or endpoint not available
      setSkillRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.organization?.id) {
      loadData();
    }
  }, [user?.organization?.id]);


  const handleDeleteClick = (id) => {
    setSkillToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!skillToDelete) return;
    try {
      await deleteSkillInventoryEntry(skillToDelete);
      setSkillRows((prev) => prev.filter((row) => row.id !== skillToDelete));
      addToast("Skill entry deleted", { appearance: "success" });
    } catch {
      addToast("Failed to delete skill entry", { appearance: "error" });
    } finally {
      setDeleteModalOpen(false);
      setSkillToDelete(null);
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
        <span className="text-lg font-semibold">Skill Inventory</span>
      </div>

      <div className="bg-white rounded p-3 mt-2">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-6 px-4 w-10 text-center">#</th>
                <th className="py-6 px-4">Employee</th>
                <th className="py-6 px-4">Job Title</th>
                <th className="py-6 px-4">Skill</th>
                <th className="py-6 px-4">Certification</th>
                <th className="py-6 px-4">Years of Experience</th>
                <th className="py-6 px-4">Proficiency Level</th>
                <th className="py-6 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {skillRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-8">
                    No skill inventory records found
                  </td>
                </tr>
              ) : (
                skillRows.map((row, index) => (
                  <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 text-center">{index + 1}</td>
                    <td className="py-4 px-4">
                      {row.employee ||
                        (row.user
                          ? `${row.user.firstName} ${row.user.lastName}`
                          : "-")}
                    </td>
                    <td className="py-4 px-4">{row.jobTitle || "-"}</td>
                    <td className="py-4 px-4 font-medium">{row.skill}</td>
                    <td className="py-4 px-4">{row.certification || "-"}</td>
                    <td className="py-4 px-4">
                      {row.yearsOfExperience
                        ? `${row.yearsOfExperience} yr${row.yearsOfExperience != 1 ? "s" : ""}`
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          PROFICIENCY_COLORS[row.proficiencyLevel] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.proficiencyLevel || "-"}
                      </span>
                    </td>
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
        title="Delete Skill Entry?"
        message="Are you sure you want to delete this skill entry? This action cannot be undone."
      />
      </div>
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default SkillInventoryOverview;
