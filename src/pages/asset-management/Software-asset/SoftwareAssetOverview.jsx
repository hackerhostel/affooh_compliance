import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import CreateNewSoftwareAsset from "./CreateNewSoftwareAsset.jsx";
import SoftwareAssetUpdate from "./SoftwareAssetUpdate.jsx";
import {
  doGetSoftwareAssets,
  doDeleteSoftwareAsset,
  doGetSoftwareMasterData,
  doGetSoftwareAssetDetail,
} from "../../../state/slice/assetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectUser } from "../../../state/slice/authSlice.js";
import { createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const DOCUMENT_TYPE = "SOFTWARE_ASSET";

const SoftwareAssetOverview = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const currentUser = useSelector(selectUser);

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleSaveConfirm = async ({ version, summary }) => {
    if (!selectedProject?.id) { addToast("No project selected", { appearance: "error" }); return; }
    setIsSaving(true);
    try {
      await createRevisionHistory({
        projectId: selectedProject.id,
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
    if (!selectedProject?.id) { addToast("No project selected", { appearance: "error" }); return; }
    setIsApproving(true);
    try {
      await createApproval({
        projectId: selectedProject.id,
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

  const [isOpen, setIsOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);

  const [formValues, setFormValues] = useState({
    teamID: "",
    hasLicense: "",
    isLatestVersion: "",
    status: "",
    isTempApproved: "",
  });

  // Redux state
  const softwareAssets = useSelector((state) => state.asset.softwareAssets || []);
  const softwareMasterData = useSelector((state) => state.asset.softwareMasterData || {});
  const isSoftwareAssetsLoading = useSelector((state) => state.asset.isSoftwareAssetsLoading);
  const isSoftwareAssetsError = useSelector((state) => state.asset.isSoftwareAssetsError);
  const softwareAssetDetail = useSelector((state) => state.asset.selectedSoftwareAsset);

  // Fetch software assets and master data when project changes
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetSoftwareAssets({ projectID: selectedProject.id, filters: {} }));
      dispatch(doGetSoftwareMasterData(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  // Filter assets when filters change
  useEffect(() => {
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.teamID) filters.teamID = Number(formValues.teamID);
      if (formValues.hasLicense !== "") filters.hasLicense = formValues.hasLicense === "true";
      if (formValues.isLatestVersion !== "") filters.isLatestVersion = formValues.isLatestVersion === "true";
      if (formValues.status) filters.status = formValues.status;
      if (formValues.isTempApproved !== "") filters.isTempApproved = formValues.isTempApproved === "true";

      dispatch(doGetSoftwareAssets({ projectID: selectedProject.id, filters }));
    }
  }, [formValues, selectedProject?.id, dispatch]);

  // Prepare filter options from master data
  const teamOptions =
    softwareMasterData.assetDepartments?.map((dept) => ({
      label: dept.departmentName,
      value: dept.id.toString(),
    })) || [];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Expired", value: "Expired" },
    { label: "Deprecated", value: "Deprecated" },
  ];

  const yesNoOptions = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  const toggleExpandRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleClearFilters = () => {
    setFormValues({
      teamID: "",
      hasLicense: "",
      isLatestVersion: "",
      status: "",
      isTempApproved: "",
    });
  };

  const handleDeleteRow = (id) => {
    const asset = softwareAssets.find((row) => row.id === id);
    if (asset) {
      setAssetToDelete(asset);
      setDeleteDialogOpen(true);
      setOpenActionRowId(null);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      await dispatch(doDeleteSoftwareAsset(assetToDelete.id)).unwrap();
      // Refresh assets after delete
      if (selectedProject?.id) {
        dispatch(doGetSoftwareAssets({ projectID: selectedProject.id, filters: {} }));
      }
      addToast("Software asset deleted successfully!", {
        appearance: "success",
      });
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to delete software asset",
        { appearance: "error" }
      );
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  const onAddNew = () => {
    setEditAsset(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditAsset(null);
    // Refresh assets after close
    if (selectedProject?.id) {
      dispatch(doGetSoftwareAssets({ projectID: selectedProject.id, filters: {} }));
    }
  };

  const handleStartEdit = async (id) => {
    try {
      await dispatch(doGetSoftwareAssetDetail(id)).unwrap();
      const asset = softwareAssetDetail || softwareAssets.find((row) => row.id === id);
      if (asset) {
        setEditAsset(asset);
        setIsOpen(true);
      }
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to fetch software asset detail",
        { appearance: "error" }
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      Expired: "bg-red-100 text-red-800",
      Deprecated: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || statusColors.Inactive
          }`}
      >
        {status}
      </span>
    );
  };

  if (!selectedProject?.id) {
    return (
      <div className="mt-6">
        <div className="text-center text-gray-500 py-8">
          Please select a project to view software assets
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button onClick={() => setShowSavePopup(true)} className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Save
        </button>
        <button onClick={handleApprove} disabled={isApproving} className="bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60">
          {isApproving ? "Approving..." : "Approve"}
        </button>
      </div>

      {isOpen && editAsset ? (
        <SoftwareAssetUpdate asset={editAsset} onBack={handleClose} />
      ) : (
        <>
          {/* ✅ Show Overview Only When Not Editing */}
          {/* Header */}

          <div className="flex items-center gap-5 mt-4">
            <span className="text-lg font-semibold">Software Asset</span>
            <div className="flex items-center gap-1">
              <PlusCircleIcon
                onClick={onAddNew}
                className="w-6 h-6 text-pink-500 cursor-pointer"
              />
              <button className="text-text-color" onClick={onAddNew}>
                Add New
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex items-center mt-4 justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-40">
                <FormSelect
                  name="teamID"
                  placeholder="Team"
                  showLabel={false}
                  options={teamOptions}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, teamID: e.target.value })
                  }
                />
              </div>
              <div className="w-32">
                <FormSelect
                  name="hasLicense"
                  placeholder="License"
                  showLabel={false}
                  options={yesNoOptions}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, hasLicense: e.target.value })
                  }
                />
              </div>
              <div className="w-40">
                <FormSelect
                  name="isLatestVersion"
                  placeholder="Latest Version"
                  showLabel={false}
                  options={yesNoOptions}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, isLatestVersion: e.target.value })
                  }
                />
              </div>
              <div className="w-32">
                <FormSelect
                  name="status"
                  placeholder="Status"
                  showLabel={false}
                  options={statusOptions}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, status: e.target.value })
                  }
                />
              </div>
              <div className="w-40">
                <FormSelect
                  name="isTempApproved"
                  placeholder="Temp Approved"
                  showLabel={false}
                  options={yesNoOptions}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, isTempApproved: e.target.value })
                  }
                />
              </div>
              {(formValues.teamID ||
                formValues.hasLicense !== "" ||
                formValues.isLatestVersion !== "" ||
                formValues.status ||
                formValues.isTempApproved !== "") && (
                  <span
                    onClick={handleClearFilters}
                    className="text-primary-pink hover:text-pink-600 cursor-pointer transition-colors font-medium text-sm whitespace-nowrap"
                  >
                    Clear Filters
                  </span>
                )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded p-3 mt-3 shadow-sm overflow-x-auto">
            {isSoftwareAssetsLoading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : isSoftwareAssetsError ? (
              <div className="text-center text-red-500 py-8">
                Error loading software assets
              </div>
            ) : (
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="text-left text-gray-600 border-b border-gray-200">
                    <th className="py-4 px-2 w-10">#</th>
                    <th className="py-4 px-4 w-80">Software Name</th>
                    <th className="py-4 px-4 w-28">Version</th>
                    <th className="py-4 px-4 w-32">Vendor</th>
                    <th className="py-4 px-4 w-32">Team</th>
                    <th className="py-4 px-4 w-32">Latest Version</th>
                    <th className="py-4 px-4 w-28">License</th>
                    <th className="py-4 px-4 w-28">Status</th>
                    <th className="py-4 px-4 w-32">Temp Approved</th>
                    <th className="py-4 px-4 w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {softwareAssets.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center text-gray-500 py-4">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    softwareAssets.map((row, index) => (
                      <React.Fragment key={row.id}>
                        <tr
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-4 px-2">{index + 1}</td>
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleStartEdit(row.id);
                              }}
                              className="text-blue-600 hover:underline cursor-pointer font-medium"
                            >
                              {row.softwareName}
                            </button>
                          </td>
                          <td className="py-4 px-4">{row.version || "-"}</td>
                          <td className="py-4 px-4">{row.vendor || "-"}</td>
                          <td className="py-4 px-4">{row.teamName || "-"}</td>
                          <td className="py-4 px-4">
                            {row.isLatestVersion ? "Yes" : "No"}
                          </td>
                          <td className="py-4 px-4">
                            {row.hasLicense ? "Yes" : "No"}
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(row.status)}
                          </td>
                          <td className="py-4 px-4">
                            {row.isTempApproved ? (
                              <span className="text-yellow-600 font-semibold">Yes</span>
                            ) : (
                              "No"
                            )}
                          </td>
                          <td className="py-3 px-2">
                            {openActionRowId !== row.id ? (
                              <div
                                className="cursor-pointer inline-flex"
                                onClick={() => toggleActionMenu(row.id)}
                              >
                                <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleStartEdit(row.id)}
                                >
                                  <PencilIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteRow(row.id)}
                                >
                                  <TrashIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setOpenActionRowId(null)}
                                >
                                  <XMarkIcon className="w-5 h-5 text-text-color" />
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* Expanded Row - Hidden Details */}
                        {expandedRowId === row.id && (
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <td colSpan={10} className="py-4 px-4">
                              <div className="grid grid-cols-2 gap-4">
                                {/* License Key */}
                                {row.hasLicense && (
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                                      License Key
                                    </label>
                                    <p className="text-sm text-gray-800">
                                      {row.licenseKey || "-"}
                                    </p>
                                  </div>
                                )}
                                {/* License Expiry Date */}
                                {row.hasLicense && (
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                                      License Expiry Date
                                    </label>
                                    <p className="text-sm text-gray-800">
                                      {row.licenseExpiryDate
                                        ? formatDate(row.licenseExpiryDate)
                                        : "-"}
                                    </p>
                                  </div>
                                )}
                                {/* Temp Approval Due Date */}
                                {row.isTempApproved && (
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                                      Temp Approval Due Date
                                    </label>
                                    <p className="text-sm text-gray-800">
                                      {row.tempApprovalDueDate
                                        ? formatDate(row.tempApprovalDueDate)
                                        : "-"}
                                    </p>
                                  </div>
                                )}
                                {/* Temp Approval Notes */}
                                {row.isTempApproved && (
                                  <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                                      Temp Approval Notes
                                    </label>
                                    <p className="text-sm text-gray-800">
                                      {row.tempApprovalNotes || "-"}
                                    </p>
                                  </div>
                                )}
                                {/* Show message if no additional details */}
                                {!row.hasLicense && !row.isTempApproved && (
                                  <div className="col-span-2 text-center text-gray-500 text-sm py-2">
                                    No additional details available
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={deleteDialogOpen}
            onClose={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
            title="Delete Software Asset"
            message={`Are you sure you want to delete "${assetToDelete?.softwareName}"? This action cannot be undone.`}
          />

          {/* ✅ Add popup for new asset */}
          {isOpen && !editAsset && (
            <CreateNewSoftwareAsset isOpen={isOpen} onClose={handleClose} />
          )}
        </>
      )}
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
};

export default SoftwareAssetOverview;
