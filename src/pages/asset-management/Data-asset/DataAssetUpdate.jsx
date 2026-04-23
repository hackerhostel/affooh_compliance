import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextArea from "../../../components/FormTextArea";
import FormMultiSelect from "../../../components/FormMultiSelect";
import {
  doGetDataAssetDetail,
  doGetDataMasterData,
  doUpdateDataAsset,
  doGetDataAssets,
} from "../../../state/slice/assetSlice";
import {
  doGetProjectUsers,
  selectProjectUserList,
  selectIsProjectUsersLoading,
} from "../../../state/slice/projectUsersSlice";
import { useToasts } from "react-toast-notifications";
import { selectSelectedProject } from "../../../state/slice/projectSlice";

const DataAssetUpdate = ({ asset, onBack }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux state
  const assetDetail = useSelector((state) => state.asset.selectedDataAsset);
  const dataAssetMasterData = useSelector(
    (state) => state.asset.dataAssetMasterData || {}
  );
  const projectUsers = useSelector(selectProjectUserList) || [];
  const isDataAssetDetailLoading = useSelector(
    (state) => state.asset.isDataAssetDetailLoading
  );
  const isProjectUsersLoading = useSelector(selectIsProjectUsersLoading);

  const [formValues, setFormValues] = useState({
    dataAssetName: "",
    description: "",
    source: "",
    hasBackup: "",
    backupLocation: "",
    backupFrequency: "",
    containsPersonalInfo: "",
    personalInfoDetails: "",
    dataClassification: "",
    dataOwnerID: "",
    accessRestrictions: "",
    internalRecipients: [],
  });

  // Fetch asset detail and master data when component mounts
  useEffect(() => {
    if (asset?.id) {
      dispatch(doGetDataAssetDetail(asset.id));
      if (asset.projectID || selectedProject?.id) {
        const projectID = asset.projectID || selectedProject.id;
        dispatch(doGetDataMasterData(projectID));
        dispatch(doGetProjectUsers(projectID));
      }
    }
  }, [asset?.id, asset?.projectID, selectedProject?.id, dispatch]);

  // Populate form when asset detail is loaded
  useEffect(() => {
    if (assetDetail && assetDetail.id === asset?.id) {
      setFormValues({
        dataAssetName: assetDetail.dataAssetName || "",
        description: assetDetail.description || "",
        source: assetDetail.source || "",
        hasBackup: assetDetail.hasBackup ? "true" : "false",
        backupLocation: assetDetail.backupLocation || "",
        backupFrequency: assetDetail.backupFrequency || "",
        containsPersonalInfo: assetDetail.containsPersonalInfo
          ? "true"
          : "false",
        personalInfoDetails: assetDetail.personalInfoDetails || "",
        dataClassification: assetDetail.dataClassification || "Internal",
        dataOwnerID: assetDetail.dataOwnerID?.toString() || "",
        accessRestrictions: assetDetail.accessRestrictions || "",
        internalRecipients:
          assetDetail.recipients
            ?.filter((r) => r.recipientType === "Internal")
            .map((r) => r.userID.toString()) || [],
      });
    }
  }, [assetDetail, asset?.id]);

  // Prepare options from master data
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

  const dataClassificationOptions =
    dataAssetMasterData.dataClassifications?.map((classification) => ({
      label: classification.label,
      value: classification.value,
    })) || [];

  const dataOwnerOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const recipientOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        dataAssetName: formValues.dataAssetName.trim(),
        description: formValues.description || null,
        source: formValues.source || null,
        hasBackup: formValues.hasBackup === "true",
        backupLocation: formValues.backupLocation || null,
        backupFrequency: formValues.backupFrequency || null,
        containsPersonalInfo: formValues.containsPersonalInfo === "true",
        personalInfoDetails: formValues.personalInfoDetails || null,
        dataClassification: formValues.dataClassification || null,
        dataOwnerID: formValues.dataOwnerID
          ? Number(formValues.dataOwnerID)
          : null,
        accessRestrictions: formValues.accessRestrictions || null,
        internalRecipients:
          formValues.internalRecipients && formValues.internalRecipients.length > 0
            ? formValues.internalRecipients.map((id) => Number(id))
            : null,
      };

      await dispatch(
        doUpdateDataAsset({ assetID: asset.id, assetData: updateData })
      ).unwrap();
      addToast("Data asset updated successfully!", {
        appearance: "success",
      });

      // Refresh the assets list
      const projectID = asset.projectID || selectedProject?.id;
      if (projectID) {
        dispatch(doGetDataAssets({ projectID, filters: {} }));
      }

      setIsSubmitting(false);
      onBack();
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to update data asset",
        { appearance: "error" }
      );
      setIsSubmitting(false);
    }
  };

  if (isDataAssetDetailLoading) {
    return (
      <div className="w-full text-left p-4">
        <div className="text-center text-gray-500 py-8">
          Loading asset details...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-left p-4">
      {/* Header Section */}
      <div className="mb-4 justify-between flex">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftIcon
              className="w-5 h-5 text-text-color cursor-pointer"
              onClick={onBack}
            />
            <span className="text-black font-semibold mt-4 block">
              Data Asset
            </span>
          </div>
          <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
            {assetDetail && (
              <>
                <span>
                  Create Date:{" "}
                  {new Date(assetDetail.createdAt).toLocaleDateString()}
                </span>
                {assetDetail.createdByEmail && (
                  <span>Created By: {assetDetail.createdByEmail}</span>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <button
            className="btn-primary h-10 rounded-md w-36"
            type="button"
            onClick={handleUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg p-4">
        <form onSubmit={handleUpdate}>
          {/* Data Asset Name & Source */}
          <div className="flex gap-4 mt-6">
            <div className="flex-col w-3/4">
              <label>
                Data Asset Name <span className="text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                name="dataAssetName"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                required
              />
            </div>
            <div className="flex-col w-1/4">
              <label>
                Source <span className="text-red-500">*</span>
              </label>
              <FormSelect
                name="source"
                formValues={formValues}
                options={sourceOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex-col mt-4">
            <label>Description</label>
            <FormTextArea
              name="description"
              formValues={formValues}
              onChange={({ target: { name, value } }) =>
                handleFormChange(name, value)
              }
              rows={3}
            />
          </div>

          {/* Backup Availability, Location & Frequency */}
          <div className="flex gap-4 mt-4">
            <div className="flex-col w-1/4">
              <label>Backup Availability</label>
              <FormSelect
                name="hasBackup"
                formValues={formValues}
                options={backupOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
              />
            </div>
            <div className="flex-col w-2/4">
              <label>Backup Location</label>
              <FormInput
                type="text"
                name="backupLocation"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
              />
            </div>
            <div className="flex-col w-1/4">
              <label>Backup Frequency</label>
              <FormInput
                type="text"
                name="backupFrequency"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                placeholder="e.g., Daily at 2 AM"
                showLabel={false}
              />
            </div>
          </div>

          {/* Contains Personal Information & Details */}
          <div className="flex gap-4 mt-4">
            <div className="flex-col w-1/2">
              <label>Contains Personal Information</label>
              <FormSelect
                name="containsPersonalInfo"
                formValues={formValues}
                options={personalInfoOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
              />
            </div>
            <div className="flex-col w-1/2">
              <label>Personal Info Details</label>
              <FormTextArea
                name="personalInfoDetails"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                rows={2}
                placeholder="Describe what personal information is stored"
                showLabel={false}
              />
            </div>
          </div>

          {/* Data Classification & Data Owner */}
          <div className="flex gap-4 mt-4">
            <div className="flex-col w-1/2">
              <label>Data Classification</label>
              <FormSelect
                name="dataClassification"
                formValues={formValues}
                options={dataClassificationOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
              />
            </div>
            <div className="flex-col w-1/2">
              <label>Data Owner</label>
              <FormSelect
                name="dataOwnerID"
                formValues={formValues}
                options={dataOwnerOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
              />
            </div>
          </div>

          {/* Access Restrictions */}
          <div className="flex-col mt-4">
            <label>Access Restrictions</label>
            <FormTextArea
              name="accessRestrictions"
              formValues={formValues}
              onChange={({ target: { name, value } }) =>
                handleFormChange(name, value)
              }
              rows={2}
              placeholder="Describe any access restrictions"
              showLabel={false}
            />
          </div>

          <div className="flex-col mt-4">
            <FormMultiSelect
              name="internalRecipients"
              label="Internal Recipients"
              options={recipientOptions}
              value={formValues.internalRecipients}
              onChange={handleFormChange}
              isLoading={isProjectUsersLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataAssetUpdate;
