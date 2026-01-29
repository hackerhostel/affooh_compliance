import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PencilIcon,
  ComputerDesktopIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import CreateNewHardwareAsset from "./CreateNewHardwareAsset.jsx";
import CreateNewHardwareAssetFurniture from "./CreateNewHardwareAssetFurniture.jsx";
import DeviceUpdate from "./DeviceUpdate.jsx";
import FurnitureUpdate from "./FurnitureUpdate.jsx";
import {
  doGetAssets,
  doDeleteAsset,
  doGetMasterData,
  doGetAssetDetail,
} from "../../../state/slice/assetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import {
  doGetProjectUsers,
  selectProjectUserList,
} from "../../../state/slice/projectUsersSlice.js";

const HardwareAssetOverview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

  const [isOpen, setIsOpen] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [deviceConfigPopupOpen, setDeviceConfigPopupOpen] = useState(false);
  const [selectedAssetForConfig, setSelectedAssetForConfig] = useState(null);

  const [formValues, setFormValues] = useState({
    category: "",
    type: "",
    classification: "",
    ownerID: "",
    assigneeID: "",
    assetDepartmentID: "",
  });

  // Redux state
  const assets = useSelector((state) => state.asset.assets || []);
  const masterData = useSelector((state) => state.asset.masterData || {});
  const isAssetsLoading = useSelector((state) => state.asset.isAssetsLoading);
  const isAssetsError = useSelector((state) => state.asset.isAssetsError);
  const projectUsers = useSelector(selectProjectUserList) || [];
  const assetDetail = useSelector((state) => state.asset.selectedAsset);
  const isAssetDetailLoading = useSelector((state) => state.asset.isAssetDetailLoading);

  // Fetch assets, master data, and project users when project changes
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetAssets({ projectID: selectedProject.id, filters: {} }));
      dispatch(doGetMasterData(selectedProject.id));
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  // Filter assets when filters change
  useEffect(() => {
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.category) filters.category = formValues.category;
      if (formValues.type) filters.type = formValues.type;
      if (formValues.classification)
        filters.classification = formValues.classification;
      if (formValues.ownerID) filters.ownerID = Number(formValues.ownerID);
      if (formValues.assigneeID)
        filters.assigneeID = Number(formValues.assigneeID);
      if (formValues.assetDepartmentID)
        filters.assetDepartmentID = Number(formValues.assetDepartmentID);

      dispatch(doGetAssets({ projectID: selectedProject.id, filters }));
    }
  }, [formValues, selectedProject?.id, dispatch]);

  // Prepare filter options from master data
  const categoryOptions =
    masterData.categories?.map((cat) => ({
      label: cat.label,
      value: cat.value,
    })) || [];

  const typeOptions =
    masterData.types?.map((type) => ({
      label: type.label,
      value: type.value,
    })) || [];

  const classificationOptions =
    masterData.classifications?.map((cls) => ({
      label: cls.label,
      value: cls.value,
    })) || [];

  const departmentOptions =
    masterData.assetDepartments?.map((dept) => ({
      label: dept.departmentName,
      value: dept.id.toString(),
    })) || [];


  // Get owners and assignees from project users
  const ownerOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const assigneeOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  // Show avatar or initials
  const renderUserCell = (user) => {
    if (!user) return <span className="text-gray-400 italic">No user</span>;
    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>
    );
  };

  // handle "Add New" button
  const onAddNew = () => {
    setShowCategorySelection(true);
  };

  // handle category selection
  const handleCategorySelect = (category) => {
    setSelectedType(category.toLowerCase());
    setIsOpen(true);
    setEditAsset(null);
    setShowCategorySelection(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedType("");
    setEditAsset(null);
    // Refresh assets after close
    if (selectedProject?.id) {
      dispatch(doGetAssets({ projectID: selectedProject.id, filters: {} }));
    }
  };

  // open action menu
  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  // handle delete row - open confirmation dialog
  const handleDeleteRow = (id) => {
    const asset = assets.find((row) => row.id === id);
    if (asset) {
      setAssetToDelete(asset);
      setDeleteDialogOpen(true);
      setOpenActionRowId(null);
    }
  };

  // handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      await dispatch(doDeleteAsset(assetToDelete.id)).unwrap();
      // Refresh assets after delete
      if (selectedProject?.id) {
        dispatch(doGetAssets({ projectID: selectedProject.id, filters: {} }));
      }
      addToast("Hardware asset deleted successfully!", {
        appearance: "success",
      });
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to delete asset",
        { appearance: "error" }
      );
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  // handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  // handle start edit - navigate to detail view
  const handleStartEdit = (id) => {
    const asset = assets.find((row) => row.id === id);
    if (asset) {
      setEditAsset(asset);
      setSelectedType(asset.category.toLowerCase()); // Device or Furniture
      setIsOpen(true);
    }
  };

  // handle asset name click - show configuration popup
  const handleAssetNameClick = async (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const asset = assets.find((row) => row.id === id);
    if (asset) {
      setSelectedAssetForConfig(asset);
      setDeviceConfigPopupOpen(true);
      // Fetch asset detail to get configuration data
      dispatch(doGetAssetDetail(id));
    }
  };

  // handle device config popup close
  const handleDeviceConfigPopupClose = () => {
    setDeviceConfigPopupOpen(false);
    setSelectedAssetForConfig(null);
  };

  if (!selectedProject?.id) {
    return (
      <div className="relative mt-6">
        <div className="text-center text-gray-500 py-8">
          Please select a project to view assets
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-6">
      {/* Category Selection Modal */}
      {showCategorySelection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-pink to-pink-600 px-6 py-4 relative">
              <button
                onClick={() => setShowCategorySelection(false)}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h4 className="text-xl font-bold text-white">Select Asset Category</h4>
                <p className="text-pink-100 text-sm mt-1">
                  Choose the type of asset you want to create
                </p>
              </div>
            </div>

            {/* Category Options */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Device Option */}
                <button
                  onClick={() => handleCategorySelect("Device")}
                  className="group relative flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-pink hover:bg-pink-50 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                    <ComputerDesktopIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-800 group-hover:text-primary-pink transition-colors">
                    Device
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Computers, Printers, etc.
                  </span>
                </button>

                {/* Furniture Option */}
                <button
                  onClick={() => handleCategorySelect("Furniture")}
                  className="group relative flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-pink hover:bg-pink-50 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                    <CubeIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-800 group-hover:text-primary-pink transition-colors">
                    Furniture
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Desks, Chairs, etc.
                  </span>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setShowCategorySelection(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Hide Overview when editing or adding */}
      {!isOpen && (
        <>
          {/* Top Buttons */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
              Archived
            </button>
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
              Approved
            </button>
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
              Save
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center gap-5 mt-4">
            <span className="text-lg font-semibold">Hardware Asset</span>
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
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <div className="w-32">
                <FormSelect
                  name="category"
                  options={categoryOptions}
                  placeholder="Category"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, category: e.target.value })
                  }
                />
              </div>
              <div className="w-32">
                <FormSelect
                  name="type"
                  options={typeOptions}
                  placeholder="Type"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, type: e.target.value })
                  }
                />
              </div>
              <div className="w-36">
                <FormSelect
                  name="classification"
                  options={classificationOptions}
                  placeholder="Classification"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      classification: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-32">
                <FormSelect
                  name="ownerID"
                  options={ownerOptions}
                  placeholder="Owner"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, ownerID: e.target.value })
                  }
                />
              </div>
              <div className="w-32">
                <FormSelect
                  name="assigneeID"
                  options={assigneeOptions}
                  placeholder="Assignee"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, assigneeID: e.target.value })
                  }
                />
              </div>
              <div className="w-36">
                <FormSelect
                  name="assetDepartmentID"
                  options={departmentOptions}
                  placeholder="Department"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      assetDepartmentID: e.target.value,
                    })
                  }
                />
              </div>
              <button
                onClick={() => {
                  setFormValues({
                    category: "",
                    type: "",
                    classification: "",
                    ownerID: "",
                    assigneeID: "",
                    assetDepartmentID: "",
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded p-3 mt-3 shadow-sm">
            {isAssetsLoading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : isAssetsError ? (
              <div className="text-center text-red-500 py-8">
                Error loading assets. Please try again.
              </div>
            ) : (
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="text-left text-secondary-grey border-b border-gray-200">
                    <th className="py-4 px-2 w-10">#</th>
                    <th className="py-4 px-4">Asset Name</th>
                    <th className="py-4 px-4">Code</th>
                    <th className="py-4 px-4">Serial Key</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Classification</th>
                    <th className="py-4 px-4">Department</th>
                    <th className="py-4 px-4">Owner</th>
                    <th className="py-4 px-4">Assignee</th>
                    <th className="py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center text-gray-500 py-4"
                      >
                        No records found
                      </td>
                    </tr>
                  ) : (
                    assets.map((row, index) => (
                      <tr key={row.id} className="border-b border-gray-200">
                        <td className="py-5 px-2">{index + 1}</td>
                        <td className="py-4 px-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAssetNameClick(row.id, e);
                            }}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            {row.assetName}
                          </button>
                        </td>
                        <td className="py-4 px-2">{row.assetCode}</td>
                        <td className="py-4 px-2">{row.serialKey || "-"}</td>
                        <td className="py-4 px-2 capitalize">
                          {row.assetType}
                        </td>
                        <td className="py-4 px-2">{row.category}</td>
                        <td className="py-4 px-2">{row.classification}</td>
                        <td className="py-4 px-2">
                          {row.assetDepartment?.name || "-"}
                        </td>
                        <td className="py-4 px-2">
                          {row.owner
                            ? renderUserCell(row.owner)
                            : renderUserCell(null)}
                        </td>
                        <td className="py-4 px-2">
                          {row.currentAssignee
                            ? renderUserCell(row.currentAssignee)
                            : renderUserCell(null)}
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
        </>
      )}

      {/* ✅ Popups / Update Forms */}
      {isOpen && !editAsset && selectedType === "device" && (
        <CreateNewHardwareAsset
          onClose={handleClose}
          isOpen={isOpen}
          projectID={selectedProject?.id}
        />
      )}

      {isOpen && !editAsset && selectedType === "furniture" && (
        <CreateNewHardwareAssetFurniture
          onClose={handleClose}
          isOpen={isOpen}
          projectID={selectedProject?.id}
        />
      )}

      {isOpen && editAsset && selectedType === "device" && (
        <DeviceUpdate onBack={handleClose} asset={editAsset} />
      )}

      {isOpen && editAsset && selectedType === "furniture" && (
        <FurnitureUpdate onBack={handleClose} asset={editAsset} />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Hardware Asset"
        message={
          assetToDelete
            ? `Are you sure you want to delete "${assetToDelete.assetName}"? This action cannot be undone.`
            : "Are you sure you want to delete this asset?"
        }
      />

      {/* Device Configuration Popup */}
      {deviceConfigPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-pink to-pink-600 px-6 py-4 relative">
              <button
                onClick={handleDeviceConfigPopupClose}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div>
                <h4 className="text-xl font-bold text-white">
                  {selectedAssetForConfig?.category?.toLowerCase() === "device" 
                    ? "Device Configuration" 
                    : selectedAssetForConfig?.category?.toLowerCase() === "furniture"
                    ? "Furniture Details"
                    : "Asset Details"}
                </h4>
                {selectedAssetForConfig && (
                  <p className="text-pink-100 text-sm mt-1">
                    {selectedAssetForConfig.assetCode} - {selectedAssetForConfig.assetName}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isAssetDetailLoading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading {selectedAssetForConfig?.category?.toLowerCase() === "device" ? "device configuration" : "asset details"}...
                </div>
              ) : assetDetail ? (
                selectedAssetForConfig?.category?.toLowerCase() === "device" && assetDetail.deviceConfig ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Operating System
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.operatingSystem || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          OS Version
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.osVersion || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          OS License
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.osLicense ? "Yes" : "No"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPU
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.cpu || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Processor
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.processor || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RAM
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.ram || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.model || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Manufacturer
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.manufacturer || "-"}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          MAC Address
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.deviceConfig.macAddress || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedAssetForConfig?.category?.toLowerCase() === "furniture" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.quantity || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Area
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {assetDetail.area?.name || assetDetail.areaName || "-"}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                          {assetDetail.remarks || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No configuration data found for this asset.
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No asset details found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleDeviceConfigPopupClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareAssetOverview;
