import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import { useToasts } from "react-toast-notifications";
import {
  doCreateDataAsset,
  doGetDataMasterData,
  doGetDataAssets,
} from "../../../state/slice/assetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import {
  doGetProjectUsers,
  selectProjectUserList,
} from "../../../state/slice/projectUsersSlice.js";

const CreateNewDataAsset = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);

  // Redux state
  const dataAssetMasterData = useSelector(
    (state) => state.asset.dataAssetMasterData || {}
  );
  const projectUsers = useSelector(selectProjectUserList) || [];
  const isCreateDataAssetLoading = useSelector(
    (state) => state.asset.isCreateDataAssetLoading
  );
  const isDataMasterDataLoading = useSelector(
    (state) => state.asset.isDataMasterDataLoading
  );

  // Initial form values
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

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch master data and project users on mount
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetDataMasterData(selectedProject.id));
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  }, [selectedProject?.id, dispatch]);

  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    setIsValidationErrorsShown(false);
  };

  const handleClose = () => {
    onClose();
    setFormValues({
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
    setIsValidationErrorsShown(false);
  };

  // Prepare options from master data
  const sourceOptions =
    dataAssetMasterData.sources?.map((source) => ({
      label: source.label,
      value: source.value,
    })) || [
      { label: "Internal Created", value: "Internal Created" },
      { label: "External Created", value: "External Created" },
    ];

  const backupOptions =
    dataAssetMasterData.backupOptions?.map((option) => ({
      label: option.label,
      value: option.value.toString(),
    })) || [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ];

  const personalInfoOptions =
    dataAssetMasterData.personalInfoOptions?.map((option) => ({
      label: option.label,
      value: option.value.toString(),
    })) || [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ];

  const dataClassificationOptions =
    dataAssetMasterData.dataClassifications?.map((classification) => ({
      label: classification.label,
      value: classification.value,
    })) || [
      { label: "Public", value: "Public" },
      { label: "Internal", value: "Internal" },
      { label: "Confidential", value: "Confidential" },
      { label: "Restricted", value: "Restricted" },
    ];

  const dataOwnerOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const recipientOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const createNewAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsValidationErrorsShown(false);

    // Validation
    if (!formValues.dataAssetName || !formValues.source) {
      addToast("Please fill in all required fields.", {
        appearance: "error",
      });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    if (formValues.dataAssetName.trim().length < 3) {
      addToast("Data asset name must be at least 3 characters.", {
        appearance: "error",
      });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    if (!selectedProject?.id) {
      addToast("Please select a project.", { appearance: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const assetData = {
        projectID: selectedProject.id,
        dataAssetName: formValues.dataAssetName.trim(),
        description: formValues.description || undefined,
        source: formValues.source,
        hasBackup: formValues.hasBackup === "true",
        backupLocation: formValues.backupLocation || undefined,
        backupFrequency: formValues.backupFrequency || undefined,
        containsPersonalInfo: formValues.containsPersonalInfo === "true",
        personalInfoDetails: formValues.personalInfoDetails || undefined,
        dataClassification: formValues.dataClassification || "Internal",
        dataOwnerID: formValues.dataOwnerID
          ? Number(formValues.dataOwnerID)
          : undefined,
        accessRestrictions: formValues.accessRestrictions || undefined,
        internalRecipients:
          formValues.internalRecipients && formValues.internalRecipients.length > 0
            ? formValues.internalRecipients.map((id) => Number(id))
            : undefined,
      };

      await dispatch(doCreateDataAsset(assetData)).unwrap();
      addToast("Data asset created successfully!", { appearance: "success" });
      
      // Refresh the assets list
      dispatch(
        doGetDataAssets({ projectID: selectedProject.id, filters: {} })
      );
      
      handleClose();
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to create data asset",
        { appearance: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-50">
      <div className="bg-white p-6 shadow-lg w-1/2 max-h-screen overflow-y-auto rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-2xl">Create New Data Asset</p>
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
            {/* Data Asset Name - Required */}
            <div className="flex-col">
              <p className="text-secondary-grey">
                Data Asset Name <span className="text-red-500">*</span>
              </p>
              <FormInput
                type="text"
                name="dataAssetName"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
                required
              />
            </div>

            {/* Description */}
            <div className="flex-col">
              <p className="text-secondary-grey">Description</p>
              <FormTextArea
                name="description"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                rows={3}
              />
            </div>

            {/* Source - Required */}
            <div className="flex-col">
              <p className="text-secondary-grey">
                Source <span className="text-red-500">*</span>
              </p>
              <FormSelect
                name="source"
                formValues={formValues}
                options={sourceOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
                required
              />
            </div>

            {/* Backup Availability & Location */}
            <div className="flex space-x-5">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Backup Availability</p>
                <FormSelect
                  name="hasBackup"
                  formValues={formValues}
                  options={backupOptions}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
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
                />
              </div>
            </div>

            {/* Backup Frequency */}
            <div className="flex-col">
              <p className="text-secondary-grey">Backup Frequency</p>
              <FormInput
                type="text"
                name="backupFrequency"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                placeholder="e.g., Daily at 2 AM"
              />
            </div>

            {/* Contains Personal Information & Details */}
            <div className="flex space-x-5">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">
                  Contains Personal Information
                </p>
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
                <p className="text-secondary-grey">Personal Info Details</p>
                <FormTextArea
                  name="personalInfoDetails"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  rows={2}
                  placeholder="Describe what personal information is stored"
                />
              </div>
            </div>

            {/* Data Classification & Data Owner */}
            <div className="flex space-x-5">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Data Classification</p>
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
                <p className="text-secondary-grey">Data Owner</p>
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
            <div className="flex-col">
              <p className="text-secondary-grey">Access Restrictions</p>
              <FormTextArea
                name="accessRestrictions"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                rows={2}
                placeholder="Describe any access restrictions"
              />
            </div>

            {/* Internal Recipients - Multi-select */}
            <div className="flex-col">
              <p className="text-secondary-grey">Internal Recipients</p>
              <select
                name="internalRecipients"
                multiple
                value={formValues.internalRecipients || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  handleFormChange("internalRecipients", selectedOptions);
                }}
                className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer h-32"
              >
                {recipientOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple recipients. Selected:{" "}
                {formValues.internalRecipients?.length || 0}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6 self-end w-full">
            <button
              onClick={handleClose}
              type="button"
              className="btn-secondary"
              disabled={isSubmitting || isCreateDataAssetLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || isCreateDataAssetLoading}
            >
              {isSubmitting || isCreateDataAssetLoading
                ? "Creating..."
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewDataAsset;
