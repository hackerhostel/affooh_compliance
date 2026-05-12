import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import { selectUser } from "../../../state/slice/authSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { fetchUserAccess, createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const ASSET_TYPE_LABELS = {
  HW: "Hardware",
  SW: "Software",
  Data: "Data",
  Cloud: "Cloud",
};

const ACCESS_LEVEL_COLORS = {
  Root: "bg-red-100 text-red-700",
  Admin: "bg-orange-100 text-orange-700",
  Member: "bg-blue-100 text-blue-700",
  "N/A": "bg-gray-100 text-gray-500",
};

const DOCUMENT_TYPE = "USER_ACCESS_MATRIX";

const UserAccessMatrixOverview = () => {
  const { addToast } = useToasts();
  const currentUser = useSelector(selectUser);
  const selectedProject = useSelector(selectSelectedProject);
  const projectId = selectedProject?.id;
  const [accessRows, setAccessRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("All");
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

  const TYPES = ["All", "HW", "SW", "Data", "Cloud"];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserAccess();
      setAccessRows(Array.isArray(data) ? data : []);
    } catch {
      setAccessRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows =
    activeType === "All"
      ? accessRows
      : accessRows.filter((r) => r.assetType === activeType);

  return (
    <div>
      <div className='flex justify-end items-center mt-4 space-x-2'>
        <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
        <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
      </div>
      <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">User Access Matrix</span>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2 mt-4 mb-2">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-1.5 rounded-2xl text-sm font-medium transition-colors ${
              activeType === type
                ? "bg-black text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {ASSET_TYPE_LABELS[type] || type}
          </button>
        ))}
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
                <th className="py-4 px-4">Asset Name</th>
                <th className="py-4 px-4">Asset Type</th>
                <th className="py-4 px-4">Access Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    No user access records found
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-center">{index + 1}</td>
                    <td className="py-4 px-4">
                      {row.employee ||
                        (row.user
                          ? `${row.user.firstName} ${row.user.lastName}`
                          : "-")}
                    </td>
                    <td className="py-4 px-4">{row.assetName || "-"}</td>
                    <td className="py-4 px-4">
                      {ASSET_TYPE_LABELS[row.assetType] || row.assetType || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          ACCESS_LEVEL_COLORS[row.accessLevel] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.accessLevel || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      </div>
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default UserAccessMatrixOverview;
