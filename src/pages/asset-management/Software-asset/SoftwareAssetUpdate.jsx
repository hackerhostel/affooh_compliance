import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import FormTextArea from '../../../components/FormTextArea';
import ToggleButton from '../../../components/ToggleButton';
import { useToasts } from 'react-toast-notifications';
import {
  doGetSoftwareAssetDetail,
  doUpdateSoftwareAsset,
  doGetSoftwareMasterData,
  doGetSoftwareAssets,
} from '../../../state/slice/assetSlice.js';
import { selectSelectedProject } from '../../../state/slice/projectSlice.js';

const SoftwareAssetUpdate = ({ asset, onBack }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const softwareMasterData = useSelector((state) => state.asset.softwareMasterData || {});
    const softwareAssetDetail = useSelector((state) => state.asset.selectedSoftwareAsset);
    const isSoftwareAssetDetailLoading = useSelector((state) => state.asset.isSoftwareAssetDetailLoading);
    const isUpdateSoftwareAssetLoading = useSelector((state) => state.asset.isUpdateSoftwareAssetLoading);
    const isUpdateSoftwareAssetError = useSelector((state) => state.asset.isUpdateSoftwareAssetError);

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

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

    // Fetch asset detail and master data when component mounts
    useEffect(() => {
        if (asset?.id) {
            dispatch(doGetSoftwareAssetDetail(asset.id));
        }
        if (selectedProject?.id) {
            dispatch(doGetSoftwareMasterData(selectedProject.id));
        }
    }, [asset?.id, selectedProject?.id, dispatch]);

    // Populate form when asset detail is loaded
    useEffect(() => {
        const assetData = softwareAssetDetail || asset;
        if (assetData) {
            // Helper function to convert various boolean formats to proper boolean
            const toBoolean = (value) => {
                if (value === true || value === 1 || value === '1' || value === 'true') return true;
                if (value === false || value === 0 || value === '0' || value === 'false') return false;
                return Boolean(value);
            };

            setFormValues({
                softwareName: assetData.softwareName || '',
                version: assetData.version || '',
                description: assetData.description || '',
                vendor: assetData.vendor || '',
                hasLicense: toBoolean(assetData.hasLicense),
                licenseKey: assetData.licenseKey || '',
                licenseExpiryDate: assetData.licenseExpiryDate ? assetData.licenseExpiryDate.split('T')[0] : '',
                isLatestVersion: toBoolean(assetData.isLatestVersion),
                teamID: assetData.teamID ? assetData.teamID.toString() : '',
                isTempApproved: toBoolean(assetData.isTempApproved),
                tempApprovalDueDate: assetData.tempApprovalDueDate ? assetData.tempApprovalDueDate.split('T')[0] : '',
                tempApprovalNotes: assetData.tempApprovalNotes || '',
                status: assetData.status || 'Active'
            });
        }
    }, [softwareAssetDetail, asset]);

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    // Prepare options from master data
    const teamOptions =
        softwareMasterData.teams?.map((team) => ({
            label: team.name,
            value: team.id.toString(),
        })) || [];

    const statusOptions = [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Expired", value: "Expired" },
        { label: "Deprecated", value: "Deprecated" },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsValidationErrorsShown(false);

        if (!asset?.id) {
            addToast("Asset ID is missing.", { appearance: "error" });
            return;
        }

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

        // Helper function to ensure proper boolean conversion
        const toStrictBoolean = (value) => {
            if (value === true || value === 1 || value === '1' || value === 'true') return true;
            return false; // Explicitly return false for all other cases
        };

        // Prepare data for API - Always send boolean values explicitly (even if false)
        const assetData = {
            softwareName: formValues.softwareName.trim(),
            version: formValues.version || undefined,
            description: formValues.description || undefined,
            vendor: formValues.vendor || undefined,
            hasLicense: toStrictBoolean(formValues.hasLicense), // Always defined, true or false
            licenseKey: formValues.licenseKey || undefined,
            licenseExpiryDate: formValues.licenseExpiryDate || undefined,
            isLatestVersion: toStrictBoolean(formValues.isLatestVersion), // Always defined, true or false
            teamID: formValues.teamID ? Number(formValues.teamID) : undefined,
            isTempApproved: toStrictBoolean(formValues.isTempApproved), // Always defined, true or false
            tempApprovalDueDate: formValues.tempApprovalDueDate || undefined,
            tempApprovalNotes: formValues.tempApprovalNotes || undefined,
            status: formValues.status || 'Active',
        };

        try {
            await dispatch(doUpdateSoftwareAsset({ assetID: asset.id, assetData })).unwrap();
            // Refresh asset detail and list after successful update
            if (selectedProject?.id) {
                dispatch(doGetSoftwareAssets({ projectID: selectedProject.id, filters: {} }));
                dispatch(doGetSoftwareAssetDetail(asset.id));
            }
            addToast("Software asset updated successfully!", { appearance: "success" });
            if (onBack) {
                onBack();
            }
        } catch (error) {
            addToast(
                error?.error || error?.message || "Failed to update software asset",
                { appearance: "error" }
            );
        }
    };

    const assetData = softwareAssetDetail || asset;

    if (isSoftwareAssetDetailLoading && !asset) {
        return (
            <div className="w-full text-left p-4">
                <div className="text-center text-gray-500 py-8">Loading asset details...</div>
            </div>
        );
    }

    if (!assetData) {
        return (
            <div className="w-full text-left p-4">
                <div className="text-center text-red-500 py-8">Asset not found</div>
            </div>
        );
    }

    return (
        <div className="w-full text-left p-4">
            {/* Header Section */}
            <div className="mb-4 justify-between flex">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            onClick={onBack}
                            className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-black font-semibold text-xl">
                            Software Asset - {assetData.softwareName}
                        </span>
                    </div>
                    <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                        <span>Created: {formatDate(assetData.createdAt)}</span>
                        {assetData.updatedAt && (
                            <span>Updated: {formatDate(assetData.updatedAt)}</span>
                        )}
                    </div>
                </div>
                <div>
                    <button
                        className="btn-primary h-10 rounded-md w-36"
                        type="button"
                        onClick={handleUpdate}
                        disabled={isUpdateSoftwareAssetLoading}
                    >
                        {isUpdateSoftwareAssetLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>

            {/* Basic Info Section */}
            <div className='bg-white rounded-lg p-4'>
                <div className='flex gap-4 mt-6'>
                    <div className='flex-col w-3/4'>
                        <label>Software Name *</label>
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
                    <div className='flex-col w-1/4'>
                        <label>Version</label>
                        <FormInput
                            type="text"
                            name="version"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                {/* Description */}
                <div className='flex-col mt-4'>
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

                <div className='flex gap-4 mt-4'>
                    <div className='flex-col w-1/2'>
                        <label>Vendor</label>
                        <FormInput
                            type="text"
                            name="vendor"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                    <div className='flex-col w-1/2'>
                        <label>Team</label>
                        <FormSelect
                            name="teamID"
                            formValues={formValues}
                            options={teamOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4'>
                    <div className='flex-col w-1/2'>
                        <label>Status</label>
                        <FormSelect
                            name="status"
                            formValues={formValues}
                            options={statusOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4'>
                    <div className='flex-col w-1/2'>
                        <label className="mb-2">Has License *</label>
                        <ToggleButton
                            name="hasLicense"
                            isOn={formValues.hasLicense}
                            onToggle={(value) => handleFormChange("hasLicense", value)}
                        />
                    </div>
                    <div className='flex-col w-1/2'>
                        <label className="mb-2">Latest Version *</label>
                        <ToggleButton
                            name="isLatestVersion"
                            isOn={formValues.isLatestVersion}
                            onToggle={(value) => handleFormChange("isLatestVersion", value)}
                        />
                    </div>
                </div>

                {/* License Key (shown if hasLicense is true) */}
                {formValues.hasLicense && (
                    <div className='flex gap-4 mt-4'>
                        <div className='flex-col w-1/2'>
                            <label>License Key</label>
                            <FormInput
                                type="text"
                                name="licenseKey"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>
                        <div className='flex-col w-1/2'>
                            <label>License Expiry Date</label>
                            <FormInput
                                type="date"
                                name="licenseExpiryDate"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Temp Approved Section */}
                <div className='flex gap-4 mt-4'>
                    <div className='flex-col'>
                        <label className="mb-2">Temp Approved</label>
                        <ToggleButton
                            name="isTempApproved"
                            isOn={formValues.isTempApproved}
                            onToggle={(value) => handleFormChange("isTempApproved", value)}
                        />
                    </div>
                </div>

                {/* Temp Approval Due Date (required if isTempApproved is true) */}
                {formValues.isTempApproved && (
                    <div className='flex gap-4 mt-4'>
                        <div className='flex-col w-1/2'>
                            <label>Temp Approval Due Date *</label>
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
                    </div>
                )}

                {/* Temp Approval Notes (shown if isTempApproved is true) */}
                {formValues.isTempApproved && (
                    <div className='flex-col mt-4'>
                        <label>Temp Approval Notes</label>
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
        </div>
    );
};

export default SoftwareAssetUpdate;
