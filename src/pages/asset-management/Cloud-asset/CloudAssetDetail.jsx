import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { useToasts } from "react-toast-notifications";
import {
  doGetCloudAssetDetail,
  doGetCloudMasterData,
  doUpdateCloudAsset,
} from "../../../state/slice/cloudAssetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";

const CloudAssetDetail = ({ assetId, onBack }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const id = assetId;

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    cloudAssetName: "",
    vendor: "",
    assetType: "",
    backupAvailability: "",
    backupLocation: "",
    classification: "",
    resourceOwnerID: "",
  });

  const masterData = useSelector((state) => state.cloudAsset.masterData || {});
  const assetDetail = useSelector((state) => state.cloudAsset.selectedCloudAsset);
  const isDetailLoading = useSelector(
    (state) => state.cloudAsset.isCloudAssetDetailLoading
  );
  const isDetailError = useSelector(
    (state) => state.cloudAsset.isCloudAssetDetailError
  );

  // Load master data and asset detail
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetCloudMasterData(selectedProject.id));
    }
    if (id) {
      dispatch(doGetCloudAssetDetail(id));
    }
  }, [selectedProject?.id, id, dispatch]);

  // Populate form when asset detail loads
  useEffect(() => {
    if (assetDetail) {
      setFormValues({
        cloudAssetName: assetDetail.cloudAssetName || "",
        vendor: assetDetail.vendor || "",
        assetType: assetDetail.assetType || "",
        backupAvailability: assetDetail.backupAvailability || "",
        backupLocation: assetDetail.backupLocation || "",
        classification: assetDetail.classification || "",
        resourceOwnerID: assetDetail.resourceOwnerID?.toString() || "",
      });
    }
  }, [assetDetail]);

  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        cloudAssetName: formValues.cloudAssetName.trim(),
        vendor: formValues.vendor || undefined,
        assetType: formValues.assetType || undefined,
        backupAvailability: formValues.backupAvailability || undefined,
        backupLocation: formValues.backupLocation || undefined,
        classification: formValues.classification || undefined,
        resourceOwnerID: formValues.resourceOwnerID
          ? Number(formValues.resourceOwnerID)
          : undefined,
      };

      await dispatch(
        doUpdateCloudAsset({ assetID: id, assetData: updateData })
      ).unwrap();
      addToast("Cloud asset updated successfully!", { appearance: "success" });
      setIsSubmitting(false);
      setIsEditing(false);
      // Refresh asset detail
      dispatch(doGetCloudAssetDetail(id));
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to update cloud asset",
        { appearance: "error" }
      );
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Hardcoded dropdown options
  const vendorOptions = [
    { label: "AWS", value: "AWS" },
    { label: "Azure", value: "Azure" },
  ];

  const assetTypeOptions = [
    { label: "Software", value: "Software" },
    { label: "Database", value: "Database" },
    { label: "AI", value: "AI" },
  ];

  const backupAvailabilityOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const classificationOptions = [
    { label: "confidential", value: "confidential" },
    { label: "internal", value: "internal" },
    { label: "public", value: "public" },
  ];

  const departmentOptions = [
    { label: "IT Department", value: "1" },
    { label: "Financial Department", value: "2" },
    { label: "HR Department", value: "3" },
  ];

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

  if (isDetailLoading) {
    return (
      <div className="w-full text-left p-4">
        <div className="text-center py-8 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isDetailError || !assetDetail) {
    return (
      <div className="w-full text-left p-4">
        <div className="text-center py-8 text-red-500">
          Failed to load cloud asset details
        </div>
        <button onClick={handleBack} className="btn-secondary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-left p-4">
      {/* Header Section */}
      <div className="mb-4 justify-between flex">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="cursor-pointer">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-black font-semibold mt-4 block">
                Cloud Asset Details
              </span>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 cursor-pointer"
                >
                  <PencilIcon className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
              <span>ID: {assetDetail.id}</span>
              {assetDetail.createdAt && (
                <span>
                  Created: {new Date(assetDetail.createdAt).toLocaleDateString()}
                </span>
              )}
              {assetDetail.createdBy && (
                <span>Created By: {assetDetail.createdBy}</span>
              )}
              {assetDetail.updatedAt && (
                <span>
                  Updated: {new Date(assetDetail.updatedAt).toLocaleDateString()}
                </span>
              )}
              {assetDetail.updatedBy && (
                <span>Updated By: {assetDetail.updatedBy}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-4">
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div className="flex gap-4 mt-6">
              <div className="flex-col w-full">
                <label>Cloud Asset Name</label>
                <FormInput
                  type="text"
                  name="cloudAssetName"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-col w-1/3">
                <label>Vendor</label>
                <FormSelect
                  name="vendor"
                  formValues={formValues}
                  options={vendorOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                />
              </div>

              <div className="flex-col w-1/3">
                <label>Asset Type</label>
                <FormSelect
                  name="assetType"
                  formValues={formValues}
                  options={assetTypeOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                />
              </div>

              <div className="flex-col w-1/3">
                <label>Classification</label>
                <FormSelect
                  name="classification"
                  formValues={formValues}
                  options={classificationOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-col w-1/2">
                <label>Backup Availability</label>
                <FormSelect
                  name="backupAvailability"
                  formValues={formValues}
                  options={backupAvailabilityOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                />
              </div>

              <div className="flex-col w-1/2">
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
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-col w-full">
                <label>Resource Owner</label>
                <FormSelect
                  name="resourceOwnerID"
                  formValues={formValues}
                  options={departmentOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  // Reset form values
                  if (assetDetail) {
                    setFormValues({
                      cloudAssetName: assetDetail.cloudAssetName || "",
                      vendor: assetDetail.vendor || "",
                      assetType: assetDetail.assetType || "",
                      backupAvailability: assetDetail.backupAvailability || "",
                      backupLocation: assetDetail.backupLocation || "",
                      classification: assetDetail.classification || "",
                      resourceOwnerID: assetDetail.resourceOwnerID?.toString() || "",
                    });
                  }
                }}
                type="button"
                className="btn-secondary h-10 rounded-md w-24"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary h-10 rounded-md w-24"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Update"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex gap-4 mt-6">
              <div className="flex-col w-full">
                <label className="text-gray-600">Cloud Asset Name</label>
                <div className="mt-1 text-black font-medium">
                  {assetDetail.cloudAssetName || "-"}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-col w-1/3">
                <label className="text-gray-600">Vendor</label>
                <div className="mt-1 text-black font-medium">
                  {assetDetail.vendor || "-"}
                </div>
              </div>

              <div className="flex-col w-1/3">
                <label className="text-gray-600">Asset Type</label>
                <div className="mt-1 text-black font-medium">
                  {assetDetail.assetType || "-"}
                </div>
              </div>

              <div className="flex-col w-1/3">
                <label className="text-gray-600">Classification</label>
                <div className={`mt-1 ${getColorClass(assetDetail.classification)}`}>
                  {assetDetail.classification || "-"}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-col w-1/2">
                <label className="text-gray-600">Backup Availability</label>
                <div className="mt-1 text-black font-medium">
                  {assetDetail.backupAvailability || "-"}
                </div>
              </div>

              <div className="flex-col w-1/2">
                <label className="text-gray-600">Backup Location</label>
                <div className="mt-1 text-black font-medium">
                  {assetDetail.backupLocation || "-"}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-col w-full">
                <label className="text-gray-600">Resource Owner</label>
                <div className="mt-1">
                  {assetDetail.resourceOwner ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                        {assetDetail.resourceOwner.name?.[0] || "?"}
                      </div>
                      <span className="text-black font-medium">
                        {assetDetail.resourceOwner.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No owner</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudAssetDetail;
