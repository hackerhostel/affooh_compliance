import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import { useToasts } from "react-toast-notifications";
import {
  doCreateAsset,
  doGetMasterData,
} from "../../../state/slice/assetSlice.js";
import { doGetProjectUsers } from "../../../state/slice/projectUsersSlice.js";

const CreateNewHardwareAssetFurniture = ({
  isOpen,
  onClose,
  projectID,
}) => {
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

  // Initial form values
  const [formValues, setFormValues] = useState({
    category: "Furniture",
    assetName: "",
    assetCode: "",
    assetType: "",
    ownerID: "",
    serialKey: "",
    classification: "",
    assetDepartmentID: "",
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
    setFormValues({ ...formValues, [name]: value });
    setIsValidationErrorsShown(false);
  };

  const handleClose = () => {
    onClose();
    setFormValues({
      category: "Furniture",
      assetName: "",
      assetCode: "",
      assetType: "",
      ownerID: "",
      serialKey: "",
      classification: "",
      assetDepartmentID: "",
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

  const areaOptions =
    masterData.areas?.map((area) => ({
      label: area.areaName,
      value: area.id.toString(),
    })) || [];

  const ownerOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const createNewAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsValidationErrorsShown(false);

    // Validation
    if (
      !formValues.assetName ||
      !formValues.assetCode ||
      !formValues.assetType ||
      !formValues.classification ||
      !formValues.quantity ||
      !formValues.areaID
    ) {
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
        category: "Furniture",
        assetType: formValues.assetType,
        classification: formValues.classification,
        serialKey: formValues.serialKey || undefined,
        ownerID: formValues.ownerID ? Number(formValues.ownerID) : undefined,
        assetDepartmentID: formValues.assetDepartmentID
          ? Number(formValues.assetDepartmentID)
          : undefined,
        quantity: Number(formValues.quantity),
        areaID: formValues.areaID ? Number(formValues.areaID) : undefined,
        remarks: formValues.remarks || undefined,
      };

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
    <div className="fixed inset-0 overflow-y-auto h-full flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-50">
      <div className="bg-white p-6 shadow-lg w-1/2">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-2xl">New Hardware Asset (Furniture)</p>
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
                disabled={true}
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

export default CreateNewHardwareAssetFurniture;
