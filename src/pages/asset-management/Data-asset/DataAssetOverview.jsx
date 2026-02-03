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
import CreateNewDataAsset from "./CreateNewDataAsset.jsx";
import DataAssetUpdate from "./DataAssetUpdate.jsx";
import {
  doGetDataAssets,
  doDeleteDataAsset,
  doGetDataMasterData,
  doGetDataAssetDetail,
  doGetRecipients,
} from "../../../state/slice/assetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import {
  doGetProjectUsers,
  selectProjectUserList,
} from "../../../state/slice/projectUsersSlice.js";

const DataAssetOverview = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

  const [isOpen, setIsOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [recipientsData, setRecipientsData] = useState({});

  const [formValues, setFormValues] = useState({
    source: "",
    hasBackup: "",
    containsPersonalInfo: "",
    status: "",
  });

  // Redux state
  const dataAssets = useSelector((state) => state.asset.dataAssets || []);
  const dataAssetMasterData = useSelector(
    (state) => state.asset.dataAssetMasterData || {}
  );
  const isDataAssetsLoading = useSelector(
    (state) => state.asset.isDataAssetsLoading
  );
  const isDataAssetsError = useSelector(
    (state) => state.asset.isDataAssetsError
  );
  const projectUsers = useSelector(selectProjectUserList) || [];

  // Fetch data assets, master data, and project users when project changes
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetDataAssets({ projectID: selectedProject.id, filters: {} }));
      dispatch(doGetDataMasterData(selectedProject.id));
      dispatch(doGetProjectUsers(selectedProject.id));
      // Clear recipients cache when project changes
      setRecipientsData({});
      setExpandedRowId(null);
    }
  }, [selectedProject?.id, dispatch]);

  // Filter data assets when filters change
  useEffect(() => {
    if (selectedProject?.id) {
      const filters = {};
      if (formValues.source) filters.source = formValues.source;
      if (formValues.hasBackup !== "")
        filters.hasBackup = formValues.hasBackup === "true";
      if (formValues.containsPersonalInfo !== "")
        filters.containsPersonalInfo =
          formValues.containsPersonalInfo === "true";
      if (formValues.status) filters.status = formValues.status;

      dispatch(doGetDataAssets({ projectID: selectedProject.id, filters }));
    }
  }, [formValues, selectedProject?.id, dispatch]);

  // Prepare filter options from master data
  const sourceOptions =
    dataAssetMasterData.sources?.map((source) => ({
      label: source.label,
      value: source.value,
    })) || [];

  const backupOptions =
    dataAssetMasterData.backupOptions?.map((option) => ({
      label: option.label,
      value: option.value.toString(),
    })) || [];

  const personalInfoOptions =
    dataAssetMasterData.personalInfoOptions?.map((option) => ({
      label: option.label,
      value: option.value.toString(),
    })) || [];

  const statusOptions =
    dataAssetMasterData.statuses?.map((status) => ({
      label: status.label,
      value: status.value,
    })) || [];

  const getColorClass = (classification) => {
    switch (classification) {
      case "Public":
        return "text-green-600 font-semibold";
      case "Confidential":
        return "text-yellow-500 font-semibold";
      case "Restricted":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-500 font-semibold";
    }
  };

  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  const toggleExpandRow = async (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
      // Fetch recipients if not already loaded
      if (!recipientsData[id]) {
        try {
          const recipients = await dispatch(doGetRecipients(id)).unwrap();
          setRecipientsData((prev) => ({
            ...prev,
            [id]: Array.isArray(recipients) ? recipients : [],
          }));
        } catch (error) {
          console.error("Failed to load recipients:", error);
          setRecipientsData((prev) => ({
            ...prev,
            [id]: [],
          }));
        }
      }
    }
  };

  const onAddNew = () => {
    setEditAsset(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditAsset(null);
  };

  const handleStartEdit = async (id) => {
    try {
      await dispatch(doGetDataAssetDetail(id)).unwrap();
      const asset = dataAssets.find((row) => row.id === id);
      if (asset) {
        setEditAsset({ ...asset, id });
        setOpenActionRowId(null);
      }
    } catch (error) {
      addToast("Failed to load asset details", { appearance: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setAssetToDelete(id);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleDeleteConfirm = async () => {
    if (assetToDelete && selectedProject?.id) {
      try {
        await dispatch(doDeleteDataAsset(assetToDelete)).unwrap();
        addToast("Data asset deleted successfully", { appearance: "success" });
        // Clear recipients cache for deleted asset
        setRecipientsData((prev) => {
          const newData = { ...prev };
          delete newData[assetToDelete];
          return newData;
        });
        // Close expanded row if it was open
        if (expandedRowId === assetToDelete) {
          setExpandedRowId(null);
        }
        dispatch(
          doGetDataAssets({ projectID: selectedProject.id, filters: {} })
        );
      } catch (error) {
        addToast(
          error?.error || error?.message || "Failed to delete data asset",
          { appearance: "error" }
        );
      }
    }
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  const renderUserCell = (user) => {
    if (!user)
      return <span className="text-gray-400 italic">No user</span>;

    const firstName = user.firstName || user.name?.split(" ")[0] || "";
    const lastName = user.lastName || user.name?.split(" ")[1] || "";

    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${firstName} ${lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {firstName?.[0]}
            {lastName?.[0]}
          </div>
        )}
        <span>
          {user.name || `${firstName} ${lastName}`}
        </span>
      </div>
    );
  };

  if (editAsset) {
    return (
      <DataAssetUpdate asset={editAsset} onBack={handleClose} />
    );
  }

  if (!selectedProject?.id) {
    return (
      <div className="mt-6 text-center text-gray-500">
        Please select a project to view data assets
      </div>
    );
  }

  return (
    <div className="mt-6">
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

      <div className="flex items-center gap-5 mt-4">
        <span className="text-lg font-semibold">Data Asset</span>
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
        <div className="flex space-x-4">
          <div className="w-40">
            <FormSelect
              name="source"
              placeholder="Source"
              showLabel={false}
              options={sourceOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, source: e.target.value })
              }
            />
          </div>
          <div className="w-40">
            <FormSelect
              name="hasBackup"
              placeholder="Backup Availability"
              showLabel={false}
              options={backupOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, hasBackup: e.target.value })
              }
            />
          </div>
          <div className="w-40">
            <FormSelect
              name="containsPersonalInfo"
              placeholder="Personal Information"
              showLabel={false}
              options={personalInfoOptions}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  containsPersonalInfo: e.target.value,
                })
              }
            />
          </div>
          <div className="w-40">
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-3 shadow-sm">
        {isDataAssetsLoading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : isDataAssetsError ? (
          <div className="text-center text-red-500 py-8">
            Error loading data assets
          </div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="py-4 px-2 w-10">ID</th>
                <th className="py-4 px-4">Full Name</th>
                <th className="py-4 px-4">Source</th>
                <th className="py-4 px-4">Contains Personal Information</th>
                <th className="py-4 px-4">Backup Availability</th>
                <th className="py-4 px-4">Backup Location</th>
                <th className="py-4 px-4">Classification</th>
                <th className="py-4 px-4">Data Owner</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                dataAssets.map((row, index) => (
                  <React.Fragment key={row.id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-2">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:text-primary-pink"
                          onClick={() => toggleExpandRow(row.id)}
                        >
                          {expandedRowId === row.id ? (
                            <ChevronUpIcon className="w-4 h-4 text-primary-pink" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="font-medium">{row.dataAssetName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{row.source}</td>
                      <td className="py-4 px-4">
                        {row.containsPersonalInfo ? "Yes" : "No"}
                      </td>
                      <td className="py-4 px-4">
                        {row.hasBackup ? "Yes" : "No"}
                      </td>
                      <td className="py-4 px-4">
                        {row.backupLocation || "-"}
                      </td>
                      <td
                        className={`py-4 px-4 ${getColorClass(
                          row.dataClassification
                        )}`}
                      >
                        {row.dataClassification}
                      </td>
                      <td className="py-4 px-4">
                        {renderUserCell(row.dataOwner)}
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
                              onClick={() => handleDeleteClick(row.id)}
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
                    {/* Expanded Row with Additional Details */}
                    {expandedRowId === row.id && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan={9} className="py-4 px-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* Description */}
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">
                                Description:
                              </p>
                              <p className="text-gray-600">
                                {row.description || (
                                  <span className="text-gray-400 italic">
                                    No description provided
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Backup Frequency */}
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">
                                Backup Frequency:
                              </p>
                              <p className="text-gray-600">
                                {row.backupFrequency || (
                                  <span className="text-gray-400 italic">
                                    Not specified
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Personal Info Details */}
                            {row.containsPersonalInfo && (
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">
                                  Personal Information Details:
                                </p>
                                <p className="text-gray-600">
                                  {row.personalInfoDetails || (
                                    <span className="text-gray-400 italic">
                                      No details provided
                                    </span>
                                  )}
                                </p>
                              </div>
                            )}

                            {/* Access Restrictions */}
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">
                                Access Restrictions:
                              </p>
                              <p className="text-gray-600">
                                {row.accessRestrictions || (
                                  <span className="text-gray-400 italic">
                                    No restrictions specified
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Internal Recipients */}
                            <div className={row.containsPersonalInfo ? "" : "col-span-2"}>
                              <p className="font-semibold text-gray-700 mb-1">
                                Internal Recipients:
                              </p>
                              {recipientsData[row.id] ? (
                                recipientsData[row.id].length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {recipientsData[row.id]
                                      .filter((r) => r.recipientType === "Internal")
                                      .map((recipient) => {
                                        const user = projectUsers.find(
                                          (u) => u.id === recipient.userID
                                        );
                                        return (
                                          <div
                                            key={recipient.id}
                                            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200"
                                          >
                                            {user ? (
                                              <>
                                                {user.avatar ? (
                                                  <img
                                                    src={user.avatar}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                  />
                                                ) : (
                                                  <div className="w-6 h-6 rounded-full bg-primary-pink flex items-center justify-center text-white text-xs font-semibold">
                                                    {user.firstName?.[0]}
                                                    {user.lastName?.[0]}
                                                  </div>
                                                )}
                                                <span className="text-gray-700">
                                                  {user.firstName} {user.lastName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  ({recipient.accessLevel})
                                                </span>
                                              </>
                                            ) : (
                                              <span className="text-gray-500">
                                                User ID: {recipient.userID}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                ) : (
                                  <p className="text-gray-400 italic">
                                    No internal recipients assigned
                                  </p>
                                )
                              ) : (
                                <p className="text-gray-400 italic">Loading...</p>
                              )}
                            </div>
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

      {/* Create New Popup */}
      {isOpen && !editAsset && (
        <CreateNewDataAsset isOpen={isOpen} onClose={handleClose} />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Data Asset"
        message="Are you sure you want to delete this data asset? This action cannot be undone."
      />
    </div>
  );
};

export default DataAssetOverview;
