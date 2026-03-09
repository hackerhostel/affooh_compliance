import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import CreateNewCloudAsset from "./CreateNewCloudAsset.jsx";
import CloudAssetUpdate from "./CloudAssetUpdate.jsx";
import CloudAssetDetail from "./CloudAssetDetail.jsx";
import {
  doGetCloudAssets,
  doDeleteCloudAsset,
  doGetCloudMasterData,
  doGetCloudAssetDetail,
} from "../../../state/slice/cloudAssetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";

const CloudAssetOverview = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

  const [isOpen, setIsOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [detailAssetId, setDetailAssetId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const [formValues, setFormValues] = useState({
    vendor: "",
    assetType: "",
    classification: "",
  });

  // Redux state
  const assets = useSelector((state) => state.cloudAsset.cloudAssets || []);
  const masterData = useSelector((state) => state.cloudAsset.masterData || {});
  const isAssetsLoading = useSelector((state) => state.cloudAsset.isAssetsLoading);
  const isAssetsError = useSelector((state) => state.cloudAsset.isAssetsError);

  // Fetch assets and master data when project changes
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetCloudAssets({ projectID: selectedProject.id, filters: {} }));
      dispatch(doGetCloudMasterData(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  // Filter assets when filters change
  useEffect(() => {
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.vendor) filters.vendor = formValues.vendor;
      if (formValues.assetType) filters.assetType = formValues.assetType;
      if (formValues.classification) filters.classification = formValues.classification;

      dispatch(doGetCloudAssets({ projectID: selectedProject.id, filters }));
    }
  }, [formValues, selectedProject?.id, dispatch]);

  // Hardcoded filter options
  const vendorOptions = [
    { label: "AWS", value: "AWS" },
    { label: "Azure", value: "Azure" },
  ];

  const assetTypeOptions = [
    { label: "Software", value: "Software" },
    { label: "Database", value: "Database" },
    { label: "AI", value: "AI" },
  ];

  const classificationOptions = [
    { label: "confidential", value: "confidential" },
    { label: "internal", value: "internal" },
    { label: "public", value: "public" },
  ];

  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  const handleDeleteRow = (id) => {
    setAssetToDelete(id);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const confirmDelete = async () => {
    if (assetToDelete) {
      try {
        await dispatch(doDeleteCloudAsset(assetToDelete)).unwrap();
        addToast("Cloud asset deleted successfully", { appearance: "success" });
        // Refresh assets list
        if (selectedProject?.id) {
          const filters = {};
          if (formValues.vendor) filters.vendor = formValues.vendor;
          if (formValues.assetType) filters.assetType = formValues.assetType;
          if (formValues.classification) filters.classification = formValues.classification;
          dispatch(doGetCloudAssets({ projectID: selectedProject.id, filters }));
        }
      } catch (error) {
        addToast(
          error?.error || error?.message || "Failed to delete cloud asset",
          { appearance: "error" }
        );
      }
    }
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  const handleStartEdit = async (id) => {
    try {
      await dispatch(doGetCloudAssetDetail(id)).unwrap();
      const asset = assets.find((a) => a.id === id);
      if (asset) {
        setEditAsset(asset);
        setOpenActionRowId(null);
      }
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to load asset details",
        { appearance: "error" }
      );
    }
  };

  const handleAssetNameClick = async (id) => {
    try {
      await dispatch(doGetCloudAssetDetail(id)).unwrap();
      setDetailAssetId(id);
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to load asset details",
        { appearance: "error" }
      );
    }
  };

  const handleBackFromDetail = () => {
    setDetailAssetId(null);
    // Refresh assets list
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.vendor) filters.vendor = formValues.vendor;
      if (formValues.assetType) filters.assetType = formValues.assetType;
      if (formValues.classification) filters.classification = formValues.classification;
      dispatch(doGetCloudAssets({ projectID: selectedProject.id, filters }));
    }
  };

  const onAddNew = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Refresh assets list after creating
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.vendor) filters.vendor = formValues.vendor;
      if (formValues.assetType) filters.assetType = formValues.assetType;
      if (formValues.classification) filters.classification = formValues.classification;
      dispatch(doGetCloudAssets({ projectID: selectedProject.id, filters }));
    }
  };

  const handleBackFromEdit = () => {
    setEditAsset(null);
    // Refresh assets list
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.vendor) filters.vendor = formValues.vendor;
      if (formValues.assetType) filters.assetType = formValues.assetType;
      if (formValues.classification) filters.classification = formValues.classification;
      dispatch(doGetCloudAssets({ projectID: selectedProject.id, filters }));
    }
  };

  // Classification color handler
  const getColorClass = (classification) => {
    switch (classification) {
      case "public":
        return "text-green-600 font-semibold";
      case "confidential":
        return "text-yellow-500 font-semibold";
      case "internal":
        return "text-blue-600 font-semibold";
      default:
        return "text-gray-500 font-semibold";
    }
  };

  // Render owner cell (department name)
  const renderOwnerCell = (owner) => {
    if (!owner) return <span className="text-gray-400 italic">No owner</span>;

    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
          {owner.name?.[0] || "?"}
        </div>
        <span>{owner.name}</span>
      </div>
    );
  };

  if (detailAssetId) {
    return (
      <CloudAssetDetail
        assetId={detailAssetId}
        onBack={handleBackFromDetail}
      />
    );
  }

  if (editAsset) {
    return (
      <CloudAssetUpdate
        asset={editAsset}
        onBack={handleBackFromEdit}
      />
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5 mt-4">
        <span className="text-lg font-semibold">Cloud Asset</span>
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
              name="vendor"
              placeholder="Vendor"
              showLabel={false}
              options={vendorOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, vendor: e.target.value })
              }
            />
          </div>
          <div className="w-40">
            <FormSelect
              name="assetType"
              placeholder="Asset Type"
              showLabel={false}
              options={assetTypeOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, assetType: e.target.value })
              }
            />
          </div>
          <div className="w-40">
            <FormSelect
              name="classification"
              placeholder="Classification"
              showLabel={false}
              options={classificationOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, classification: e.target.value })
              }
            />
          </div>
          {(formValues.vendor ||
            formValues.assetType ||
            formValues.classification) && (
              <span
                onClick={() => {
                  setFormValues({
                    vendor: "",
                    assetType: "",
                    classification: "",
                  });
                }}
                className="text-primary-pink hover:text-pink-600 cursor-pointer transition-colors font-medium text-sm"
              >
                Clear Filters
              </span>
            )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-3 shadow-sm">
        {isAssetsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : isAssetsError ? (
          <div className="text-center py-8 text-red-500">
            Error loading cloud assets
          </div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="py-4 px-2 w-10">ID</th>
                <th className="py-4 px-4">Asset Name</th>
                <th className="py-4 px-4">Vendor</th>
                <th className="py-4 px-4">Asset Type</th>
                <th className="py-4 px-4">Backup Availability</th>
                <th className="py-4 px-4">Backup Location</th>
                <th className="py-4 px-4">Classification</th>
                <th className="py-4 px-4">Owner</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                assets.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-2">{index + 1}</td>
                    <td className="py-4 px-4">{row.cloudAssetName}</td>
                    <td className="py-4 px-4">{row.vendor}</td>
                    <td className="py-4 px-4">{row.assetType}</td>
                    <td className="py-4 px-4">
                      {row.backupAvailability || "—"}
                    </td>
                    <td className="py-4 px-4">
                      {row.backupLocation || "—"}
                    </td>
                    <td
                      className={`py-4 px-4 ${getColorClass(row.classification)}`}
                    >
                      {row.classification || "—"}
                    </td>
                    <td className="py-4 px-4">
                      {renderOwnerCell(row.resourceOwner)}
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <CreateNewCloudAsset isOpen={isOpen} onClose={handleClose} />
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setAssetToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Cloud Asset"
        message="Are you sure you want to delete this cloud asset? This action cannot be undone."
      />
    </div>
  );
};

export default CloudAssetOverview;
