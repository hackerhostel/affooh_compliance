import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { useToasts } from "react-toast-notifications";
import {
  doCreateCloudAsset,
  doGetCloudMasterData,
} from "../../../state/slice/cloudAssetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";

const CreateNewCloudAsset = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const masterData = useSelector((state) => state.cloudAsset.masterData || {});

  // Initial form values
  const [formValues, setFormValues] = useState({
    cloudAssetName: "",
    vendor: "",
    assetType: "",
    backupAvailability: "",
    backupLocation: "",
    classification: "",
    resourceOwnerID: "",
  });

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load master data when component opens
  useEffect(() => {
    if (isOpen && selectedProject?.id) {
      dispatch(doGetCloudMasterData(selectedProject.id));
    }
  }, [isOpen, selectedProject?.id, dispatch]);

  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    setIsValidationErrorsShown(false);
  };

  const handleClose = () => {
    onClose();
    setFormValues({
      cloudAssetName: "",
      vendor: "",
      assetType: "",
      backupAvailability: "",
      backupLocation: "",
      classification: "",
      resourceOwnerID: "",
    });
    setIsValidationErrorsShown(false);
  };

  // Prepare options from master data
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

  const departmentOptions =
    masterData.assetDepartments?.map((dept) => ({
      label: dept.departmentName,
      value: dept.id.toString(),
    })) || [];

  const userOptions =
    masterData.projectUsers?.map((user) => ({
      label: user.name,
      value: user.id.toString(),
    })) || [];

  const createNewAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formValues.cloudAssetName || !formValues.vendor || !formValues.assetType) {
      addToast("Please fill in all required fields (Name, Vendor, Asset Type).", {
        appearance: "error",
      });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    if (formValues.cloudAssetName.trim().length < 3) {
      addToast("Cloud asset name must be at least 3 characters.", {
        appearance: "error",
      });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const assetData = {
        projectID: selectedProject.id,
        cloudAssetName: formValues.cloudAssetName.trim(),
        vendor: formValues.vendor,
        assetType: formValues.assetType,
        backupAvailability: formValues.backupAvailability || undefined,
        backupLocation: formValues.backupLocation || undefined,
        classification: formValues.classification || undefined,
        resourceOwnerID: formValues.resourceOwnerID
          ? Number(formValues.resourceOwnerID)
          : undefined,
      };

      await dispatch(doCreateCloudAsset(assetData)).unwrap();
      addToast("Cloud asset created successfully!", { appearance: "success" });
      setIsSubmitting(false);
      handleClose();
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to create cloud asset",
        { appearance: "error" }
      );
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-50">
      <div className="bg-white p-6 shadow-lg w-1/2 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-2xl">Create New Cloud Asset</p>
          <div className="cursor-pointer" onClick={handleClose}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Form */}
        <form
          className="flex flex-col justify-between h-5/6 mt-10"
          onSubmit={createNewAsset}
        >
          <div className="space-y-4 text-left">
            {/* Cloud Asset Name - Required */}
            <div className="flex-col">
              <p className="text-secondary-grey">
                Cloud Asset Name <span className="text-red-500">*</span>
              </p>
              <FormInput
                type="text"
                name="cloudAssetName"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
              />
            </div>

            {/* Vendor and Asset Type - Required */}
            <div className="flex space-x-5">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">
                  Vendor <span className="text-red-500">*</span>
                </p>
                <FormSelect
                  name="vendor"
                  formValues={formValues}
                  options={vendorOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>

              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">
                  Asset Type <span className="text-red-500">*</span>
                </p>
                <FormSelect
                  name="assetType"
                  formValues={formValues}
                  options={assetTypeOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>
            </div>

            {/* Backup Availability and Backup Location - Optional */}
            <div className="flex space-x-5">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Backup Availability</p>
                <FormSelect
                  name="backupAvailability"
                  formValues={formValues}
                  options={backupAvailabilityOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>

              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Backup Location</p>
                <FormInput
                  type="text"
                  name="backupLocation"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>
            </div>

            {/* Classification and Owned By - Optional */}
            <div className="flex space-x-5">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Classification</p>
                <FormSelect
                  name="classification"
                  formValues={formValues}
                  options={classificationOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>

              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Owned By</p>
                <FormSelect
                  name="resourceOwnerID"
                  formValues={formValues}
                  options={departmentOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6 self-end w-full">
            <button
              onClick={handleClose}
              type="button"
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewCloudAsset;
