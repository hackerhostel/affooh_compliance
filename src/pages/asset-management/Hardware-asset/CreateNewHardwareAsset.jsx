import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import { useToasts } from "react-toast-notifications";
import { doCreateAsset, doGetMasterData } from "../../../state/slice/assetSlice.js";
import { doGetProjectUsers } from "../../../state/slice/projectUsersSlice.js";

const CreateNewHardwareAsset = ({ isOpen, onClose, projectID }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  // Redux state
  const masterData = useSelector((state) => state.asset.masterData || {});
  const projectUsers = useSelector(
    (state) => state.projectUsers.projectUserList || []
  );
  const isCreateAssetLoading = useSelector(
    (state) => state.asset.isCreateAssetLoading
  );
  const isMasterDataLoading = useSelector(
    (state) => state.asset.isMasterDataLoading
  );

  // Initial form values
  const [formValues, setFormValues] = useState({
    category: "Device",
    assetName: "",
    assetCode: "",
    assetType: "",
    ownerID: "",
    serialKey: "",
    classification: "",
    assetDepartmentID: "",
    deviceConfig: {
      operatingSystem: "",
      osVersion: "",
      osLicense: false,
      cpu: "",
      processor: "",
      ram: "",
      model: "",
      manufacturer: "",
      macAddress: "",
    },
    quantity: 1,
    areaID: "",
    remarks: "",
  });

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch master data and project users on mount
  useEffect(() => {
    if (projectID) {
      dispatch(doGetMasterData(projectID));
      dispatch(doGetProjectUsers(projectID));
    }
  }, [projectID, dispatch]);

  const handleFormChange = (name, value) => {
    if (name.startsWith("deviceConfig.")) {
      const configField = name.split(".")[1];
      setFormValues({
        ...formValues,
        deviceConfig: {
          ...formValues.deviceConfig,
          [configField]: value,
        },
      });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
    setIsValidationErrorsShown(false);
  };

  const handleClose = () => {
    onClose();
    setFormValues({
      category: "Device",
      assetName: "",
      assetCode: "",
      assetType: "",
      ownerID: "",
      serialKey: "",
      classification: "",
      assetDepartmentID: "",
      deviceConfig: {
        operatingSystem: "",
        osVersion: "",
        osLicense: false,
        cpu: "",
        processor: "",
        ram: "",
        model: "",
        manufacturer: "",
        macAddress: "",
      },
      quantity: 1,
      areaID: "",
      remarks: "",
    });
    setIsValidationErrorsShown(false);
  };

  // Prepare options from master data
  const categoryOptions =
    masterData.categories?.map((cat) => ({
      label: cat.label,
      value: cat.value,
    })) || [
      { label: "Device", value: "Device" },
      { label: "Furniture", value: "Furniture" },
    ];

  const typeOptions =
    masterData.types?.map((type) => ({
      label: type.label,
      value: type.value,
    })) || [
      { label: "Personal", value: "Personal" },
      { label: "Company", value: "Company" },
    ];

  const classificationOptions =
    masterData.classifications?.map((cls) => ({
      label: cls.label,
      value: cls.value,
    })) || [
      { label: "Public", value: "Public" },
      { label: "Confidential", value: "Confidential" },
      { label: "Restricted", value: "Restricted" },
    ];

  const departmentOptions =
    masterData.assetDepartments?.map((dept) => ({
      label: dept.departmentName,
      value: dept.id.toString(),
    })) || [];

  const ownerOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const operatingSystemOptions =
    masterData.operatingSystems?.map((os) => ({
      label: os.label,
      value: os.value,
    })) || [
      { label: "Windows", value: "Windows" },
      { label: "Mac", value: "Mac" },
      { label: "Linux", value: "Linux" },
    ];

  const osLicenseOptions =
    masterData.osLicenseOptions?.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })) || [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ];

  const areaOptions =
    masterData.areas?.map((area) => ({
      label: area.areaName,
      value: area.id.toString(),
    })) || [];

  const createNewAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsValidationErrorsShown(false);

    // Validation
    const commonFields =
      !formValues.assetName ||
      !formValues.assetCode ||
      !formValues.assetType ||
      !formValues.classification;

    const furnitureFields =
      formValues.category === "Furniture" &&
      (!formValues.quantity || !formValues.areaID);

    if (commonFields || furnitureFields) {
      addToast("Please fill in all required fields.", {
        appearance: "error",
      });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const assetData = {
        projectID: Number(projectID),
        assetName: formValues.assetName,
        assetCode: formValues.assetCode,
        category: formValues.category,
        assetType: formValues.assetType,
        classification: formValues.classification,
        serialKey: formValues.serialKey || null,
        ownerID: formValues.ownerID ? Number(formValues.ownerID) : null,
        assetDepartmentID: formValues.assetDepartmentID
          ? Number(formValues.assetDepartmentID)
          : null,
      };

      if (formValues.category === "Device") {
        assetData.deviceConfig = {
          operatingSystem: formValues.deviceConfig.operatingSystem || null,
          osVersion: formValues.deviceConfig.osVersion || null,
          osLicense: formValues.deviceConfig.osLicense || false,
          cpu: formValues.deviceConfig.cpu || null,
          processor: formValues.deviceConfig.processor || null,
          ram: formValues.deviceConfig.ram || null,
          model: formValues.deviceConfig.model || null,
          manufacturer: formValues.deviceConfig.manufacturer || null,
          macAddress: formValues.deviceConfig.macAddress || null,
        };
      } else if (formValues.category === "Furniture") {
        assetData.quantity = Number(formValues.quantity);
        assetData.areaID = formValues.areaID
          ? Number(formValues.areaID)
          : null;
        assetData.remarks = formValues.remarks || null;
      }

      await dispatch(doCreateAsset(assetData)).unwrap();
      addToast("Hardware asset created successfully!", {
        appearance: "success",
      });
      setIsSubmitting(false);
      handleClose();
    } catch (error) {
      addToast(
        error?.error || error?.message || "Failed to create asset",
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
          <p className="font-bold text-2xl">New Hardware Asset</p>
          <div className="cursor-pointer" onClick={handleClose}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Form */}
        <form
          className="flex flex-col justify-between mt-10"
          onSubmit={createNewAsset}
        >
          <div className="space-y-4 text-left">
            {/* Category */}
            <div className="flex-col">
              <p className="text-secondary-grey">Category *</p>
              <FormSelect
                name="category"
                formValues={formValues}
                options={categoryOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
              />
            </div>

            {/* Name + Code */}
            <div className="flex space-x-4">
              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Name *</p>
                <FormInput
                  type="text"
                  name="assetName"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>

              <div className="flex-col w-1/2">
                <p className="text-secondary-grey">Code *</p>
                <FormInput
                  type="text"
                  name="assetCode"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  showErrors={isValidationErrorsShown}
                />
              </div>
            </div>

            {/* Type */}
            <div className="flex-col">
              <p className="text-secondary-grey">Type *</p>
              <FormSelect
                name="assetType"
                formValues={formValues}
                options={typeOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
              />
            </div>

            {/* Asset Owner */}
            <div className="flex-col">
              <p className="text-secondary-grey">Asset Owner</p>
              <FormSelect
                name="ownerID"
                formValues={formValues}
                options={ownerOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
              />
            </div>

            {/* Serial Key */}
            <div className="flex-col">
              <p className="text-secondary-grey">Serial Key</p>
              <FormInput
                type="text"
                name="serialKey"
                formValues={formValues}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
              />
            </div>

            {/* Classification */}
            <div className="flex-col">
              <p className="text-secondary-grey">Classification *</p>
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

            {/* Asset Department */}
            <div className="flex-col">
              <p className="text-secondary-grey">Asset Department</p>
              <FormSelect
                name="assetDepartmentID"
                formValues={formValues}
                options={departmentOptions}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                showErrors={isValidationErrorsShown}
              />
            </div>

            {/* Conditional Configuration Section */}
            {formValues.category === "Device" && (
              <div className="border-t pt-4 mt-4">
                <p className="text-lg font-semibold mb-4">Device Configuration</p>

                {/* Operating System */}
                <div className="flex-col mb-4">
                  <p className="text-secondary-grey">Operating System</p>
                  <FormSelect
                    name="deviceConfig.operatingSystem"
                    formValues={formValues}
                    options={operatingSystemOptions}
                    onChange={({ target: { value } }) =>
                      handleFormChange("deviceConfig.operatingSystem", value)
                    }
                  />
                </div>

                {/* OS Version */}
                <div className="flex-col mb-4">
                  <p className="text-secondary-grey">OS Version</p>
                  <FormInput
                    type="text"
                    name="deviceConfig.osVersion"
                    formValues={formValues}
                    onChange={({ target: { value } }) =>
                      handleFormChange("deviceConfig.osVersion", value)
                    }
                  />
                </div>

                {/* OS License */}
                <div className="flex-col mb-4">
                  <p className="text-secondary-grey">OS License</p>
                  <FormSelect
                    name="deviceConfig.osLicense"
                    formValues={formValues}
                    options={osLicenseOptions}
                    onChange={({ target: { value } }) =>
                      handleFormChange("deviceConfig.osLicense", value === "true")
                    }
                  />
                </div>

                {/* CPU + Processor */}
                <div className="flex space-x-4 mb-4">
                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">CPU</p>
                    <FormInput
                      type="text"
                      name="deviceConfig.cpu"
                      formValues={formValues}
                      onChange={({ target: { value } }) =>
                        handleFormChange("deviceConfig.cpu", value)
                      }
                    />
                  </div>
                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">Processor</p>
                    <FormInput
                      type="text"
                      name="deviceConfig.processor"
                      formValues={formValues}
                      onChange={({ target: { value } }) =>
                        handleFormChange("deviceConfig.processor", value)
                      }
                    />
                  </div>
                </div>

                {/* RAM */}
                <div className="flex-col mb-4">
                  <p className="text-secondary-grey">RAM</p>
                  <FormInput
                    type="text"
                    name="deviceConfig.ram"
                    formValues={formValues}
                    onChange={({ target: { value } }) =>
                      handleFormChange("deviceConfig.ram", value)
                    }
                  />
                </div>

                {/* Model + Manufacturer */}
                <div className="flex space-x-4 mb-4">
                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">Model</p>
                    <FormInput
                      type="text"
                      name="deviceConfig.model"
                      formValues={formValues}
                      onChange={({ target: { value } }) =>
                        handleFormChange("deviceConfig.model", value)
                      }
                    />
                  </div>
                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">Manufacturer</p>
                    <FormInput
                      type="text"
                      name="deviceConfig.manufacturer"
                      formValues={formValues}
                      onChange={({ target: { value } }) =>
                        handleFormChange("deviceConfig.manufacturer", value)
                      }
                    />
                  </div>
                </div>

                {/* MAC Address */}
                <div className="flex-col mb-4">
                  <p className="text-secondary-grey">MAC Address</p>
                  <FormInput
                    type="text"
                    name="deviceConfig.macAddress"
                    formValues={formValues}
                    onChange={({ target: { value } }) =>
                      handleFormChange("deviceConfig.macAddress", value)
                    }
                  />
                </div>
              </div>
            )}

            {formValues.category === "Furniture" && (
              <div className="border-t pt-4 mt-4 space-y-4">
                <p className="text-lg font-semibold mb-4">Furniture Details</p>

                {/* QTY + Area */}
                <div className="flex space-x-5">
                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">QTY *</p>
                    <FormInput
                      type="number"
                      name="quantity"
                      formValues={formValues}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      showErrors={isValidationErrorsShown}
                      min="1"
                    />
                  </div>

                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">Area *</p>
                    <FormSelect
                      name="areaID"
                      formValues={formValues}
                      options={areaOptions}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      showErrors={isValidationErrorsShown}
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div className="flex-col">
                  <p className="text-secondary-grey">Remarks</p>
                  <FormTextArea
                    name="remarks"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6 self-end w-full">
            <button
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting || isCreateAssetLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || isCreateAssetLoading}
            >
              {isSubmitting || isCreateAssetLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewHardwareAsset;
