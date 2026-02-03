import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { useToasts } from "react-toast-notifications";
import {
  doUpdateCloudAsset,
  doGetCloudMasterData,
  doGetCloudAssetDetail,
} from "../../../state/slice/cloudAssetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";

const CloudAssetUpdate = ({ asset, onBack }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

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

  // Load master data and asset detail
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetCloudMasterData(selectedProject.id));
    }
    if (asset?.id) {
      dispatch(doGetCloudAssetDetail(asset.id));
    }
  }, [selectedProject?.id, asset?.id, dispatch]);

  // Get asset from Redux state after detail loads
  const assetDetail = useSelector((state) => state.cloudAsset.selectedCloudAsset);

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
    } else if (asset) {
      // Fallback to prop asset if detail not loaded yet
      setFormValues({
        cloudAssetName: asset.cloudAssetName || "",
        vendor: asset.vendor || "",
        assetType: asset.assetType || "",
        backupAvailability: asset.backupAvailability || "",
        backupLocation: asset.backupLocation || "",
        classification: asset.classification || "",
        resourceOwnerID: asset.resourceOwnerID?.toString() || "",
      });
    }
  }, [assetDetail, asset]);

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
        doUpdateCloudAsset({ assetID: asset.id, assetData: updateData })
      ).unwrap();
      addToast("Cloud asset updated successfully!", { appearance: "success" });
      setIsSubmitting(false);
      onBack();
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to update cloud asset",
        { appearance: "error" }
      );
      setIsSubmitting(false);
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

  return (
    <div className="w-full text-left p-4">
      {/* Header Section */}
      <div className="mb-4 justify-between flex">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="cursor-pointer">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <span className="text-black font-semibold mt-4 block">
              Update Cloud Asset
            </span>
            {assetDetail && (
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-4">
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
              onClick={onBack}
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
      </div>
    </div>
  );
};

export default CloudAssetUpdate;
