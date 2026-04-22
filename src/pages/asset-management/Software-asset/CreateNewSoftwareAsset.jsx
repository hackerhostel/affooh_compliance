import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import ToggleButton from "../../../components/ToggleButton.jsx";
import { useToasts } from 'react-toast-notifications';
import {
    doCreateSoftwareAsset,
    doGetSoftwareMasterData,
} from "../../../state/slice/assetSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";

const CreateNewSoftwareAsset = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const softwareMasterData = useSelector((state) => state.asset.softwareMasterData || {});
    const isCreateSoftwareAssetLoading = useSelector((state) => state.asset.isCreateSoftwareAssetLoading);
    const isCreateSoftwareAssetError = useSelector((state) => state.asset.isCreateSoftwareAssetError);

    // Initial form values
    const [formValues, setFormValues] = useState({
        softwareName: '',
        version: '',
        description: '',
        vendor: '',
        hasLicense: false,
        licenseKey: '',
        licenseExpiryDate: '',
        isLatestVersion: true,
        teamID: '',
        isTempApproved: false,
        tempApprovalDueDate: '',
        tempApprovalNotes: '',
        status: 'Active'
    });

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    // Fetch master data when component opens
    useEffect(() => {
        if (isOpen && selectedProject?.id) {
            dispatch(doGetSoftwareMasterData(selectedProject.id));
        }
    }, [isOpen, selectedProject?.id, dispatch]);

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const handleClose = () => {
        onClose();
        setFormValues({
            softwareName: '',
            version: '',
            description: '',
            vendor: '',
            hasLicense: false,
            licenseKey: '',
            licenseExpiryDate: '',
            isLatestVersion: true,
            teamID: '',
            isTempApproved: false,
            tempApprovalDueDate: '',
            tempApprovalNotes: '',
            status: 'Active'
        });
        setIsValidationErrorsShown(false);
    };

    // Prepare options from master data
    const teamOptions =
        softwareMasterData.assetDepartments?.map((dept) => ({
            label: dept.departmentName,
            value: dept.id.toString(),
        })) || [];

    const statusOptions = [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Expired", value: "Expired" },
        { label: "Deprecated", value: "Deprecated" },
    ];

    const createNewAsset = async (e) => {
        e.preventDefault();
        setIsValidationErrorsShown(false);

        // Validation
        if (!formValues.softwareName || formValues.softwareName.trim().length < 3) {
            addToast("Software name is required and must be at least 3 characters.", { appearance: "error" });
            setIsValidationErrorsShown(true);
            return;
        }

        if (formValues.isTempApproved && !formValues.tempApprovalDueDate) {
            addToast("Due date is required when temp approval is enabled.", { appearance: "error" });
            setIsValidationErrorsShown(true);
            return;
        }

        if (!selectedProject?.id) {
            addToast("Please select a project.", { appearance: "error" });
            return;
        }

        // Prepare data for API
        const assetData = {
            projectID: selectedProject.id,
            softwareName: formValues.softwareName.trim(),
            version: formValues.version || null,
            description: formValues.description || null,
            vendor: formValues.vendor || null,
            hasLicense: Boolean(formValues.hasLicense),
            licenseKey: formValues.licenseKey || null,
            licenseExpiryDate: formValues.licenseExpiryDate || null,
            isLatestVersion: Boolean(formValues.isLatestVersion),
            teamID: formValues.teamID ? Number(formValues.teamID) : null,
            isTempApproved: Boolean(formValues.isTempApproved),
            tempApprovalDueDate: formValues.tempApprovalDueDate || null,
            tempApprovalNotes: formValues.tempApprovalNotes || null,
            status: formValues.status || 'Active',
        };

        try {
            await dispatch(doCreateSoftwareAsset(assetData)).unwrap();
            addToast("Software asset created successfully!", { appearance: "success" });
            handleClose();
        } catch (error) {
            addToast(
                error?.error || error?.message || "Failed to create software asset",
                { appearance: "error" }
            );
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-1/2 max-h-screen overflow-y-auto rounded-lg">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">Create New Software Asset</p>
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
                                <div className='flex space-x-5'>
                                    {/* Software Name */}
                                    <div className="flex-col w-3/4">
                                        <p className="text-secondary-grey">Software Name *</p>
                                        <FormInput
                                            type="text"
                                            name="softwareName"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>

                                    {/* Version */}
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Version</p>
                                        <FormInput
                                            type="text"
                                            name="version"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
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

                                {/* Vendor */}
                                <div className="flex-col">
                                    <p className="text-secondary-grey">Vendor</p>
                                    <FormInput
                                        type="text"
                                        name="vendor"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>

                                <div className='flex space-x-5'>
                                    {/* Team */}
                                    <div className="flex-col w-1/2">
                                        <p className="text-secondary-grey">Team</p>
                                        <FormSelect
                                            name="teamID"
                                            formValues={formValues}
                                            options={teamOptions}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="flex-col w-1/2">
                                        <p className="text-secondary-grey">Status</p>
                                        <FormSelect
                                            name="status"
                                            formValues={formValues}
                                            options={statusOptions}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                </div>

                                <div className='flex space-x-5'>
                                    {/* Has License Toggle */}
                                    <div className="flex-col w-1/2">
                                        <p className="text-secondary-grey mb-2">Has License *</p>
                                        <ToggleButton
                                            name="hasLicense"
                                            isOn={formValues.hasLicense}
                                            onToggle={(value) => handleFormChange("hasLicense", value)}
                                        />
                                    </div>

                                    {/* Is Latest Version Toggle */}
                                    <div className="flex-col w-1/2">
                                        <p className="text-secondary-grey mb-2">Latest Version *</p>
                                        <ToggleButton
                                            name="isLatestVersion"
                                            isOn={formValues.isLatestVersion}
                                            onToggle={(value) => handleFormChange("isLatestVersion", value)}
                                        />
                                    </div>
                                </div>

                                {/* License Key (shown if hasLicense is true) */}
                                {formValues.hasLicense && (
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">License Key</p>
                                        <FormInput
                                            type="text"
                                            name="licenseKey"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                )}

                                {/* License Expiry Date (shown if hasLicense is true) */}
                                {formValues.hasLicense && (
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">License Expiry Date</p>
                                        <FormInput
                                            type="date"
                                            name="licenseExpiryDate"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                )}

                                {/* Temp Approved Toggle */}
                                <div className="flex-col">
                                    <p className="text-secondary-grey mb-2">Temp Approved</p>
                                    <ToggleButton
                                        name="isTempApproved"
                                        isOn={formValues.isTempApproved}
                                        onToggle={(value) => handleFormChange("isTempApproved", value)}
                                    />
                                </div>

                                {/* Temp Approval Due Date (required if isTempApproved is true) */}
                                {formValues.isTempApproved && (
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Temp Approval Due Date *</p>
                                        <FormInput
                                            type="date"
                                            name="tempApprovalDueDate"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            showErrors={isValidationErrorsShown}
                                        />
                                    </div>
                                )}

                                {/* Temp Approval Notes (shown if isTempApproved is true) */}
                                {formValues.isTempApproved && (
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Temp Approval Notes</p>
                                        <FormTextArea
                                            name="tempApprovalNotes"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                            rows={3}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-4 mt-6 self-end w-full">
                                <button
                                    onClick={handleClose}
                                    className="btn-secondary"
                                    disabled={isCreateSoftwareAssetLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isCreateSoftwareAssetLoading}
                                >
                                    {isCreateSoftwareAssetLoading ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateNewSoftwareAsset;
