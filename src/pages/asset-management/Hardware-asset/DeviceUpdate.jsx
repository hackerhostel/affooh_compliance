import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import UserTable from './UserTable';
import { doGetAssetDetail, doGetMasterData, doUpdateAsset } from '../../../state/slice/assetSlice';
import { doGetProjectUsers, selectProjectUserList } from '../../../state/slice/projectUsersSlice';
import { useToasts } from 'react-toast-notifications';

const DeviceUpdate = ({ onBack, asset }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [activeTab, setActiveTab] = useState("configuration");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redux state
    const assetDetail = useSelector((state) => state.asset.selectedAsset);
    const masterData = useSelector((state) => state.asset.masterData || {});
    const projectUsers = useSelector(selectProjectUserList) || [];
    const isAssetDetailLoading = useSelector((state) => state.asset.isAssetDetailLoading);

    const [formValues, setFormValues] = useState({
        assetName: '',
        assetCode: '',
        assetType: '',
        ownerID: '',
        classification: '',
        serialKey: '',
        assetDepartmentID: '',
        deviceConfig: {
            operatingSystem: '',
            osVersion: '',
            osLicense: false,
            cpu: '',
            processor: '',
            ram: '',
            model: '',
            manufacturer: '',
            macAddress: '',
        },
    });

    // Fetch asset detail and master data when component mounts
    useEffect(() => {
        if (asset?.id) {
            dispatch(doGetAssetDetail(asset.id));
            if (asset.projectID) {
                dispatch(doGetMasterData(asset.projectID));
                dispatch(doGetProjectUsers(asset.projectID));
            }
        }
    }, [asset?.id, asset?.projectID, dispatch]);

    // Populate form when asset detail is loaded
    useEffect(() => {
        if (assetDetail && assetDetail.id === asset?.id) {
            setFormValues({
                assetName: assetDetail.assetName || '',
                assetCode: assetDetail.assetCode || '',
                assetType: assetDetail.assetType || '',
                ownerID: assetDetail.ownerID?.toString() || '',
                classification: assetDetail.classification || '',
                serialKey: assetDetail.serialKey || '',
                assetDepartmentID: assetDetail.assetDepartmentID?.toString() || '',
                deviceConfig: {
                    operatingSystem: assetDetail.deviceConfig?.operatingSystem || '',
                    osVersion: assetDetail.deviceConfig?.osVersion || '',
                    osLicense: assetDetail.deviceConfig?.osLicense || false,
                    cpu: assetDetail.deviceConfig?.cpu || '',
                    processor: assetDetail.deviceConfig?.processor || '',
                    ram: assetDetail.deviceConfig?.ram || '',
                    model: assetDetail.deviceConfig?.model || '',
                    manufacturer: assetDetail.deviceConfig?.manufacturer || '',
                    macAddress: assetDetail.deviceConfig?.macAddress || '',
                },
            });
        }
    }, [assetDetail, asset?.id]);

    // Prepare options from master data
    const typeOptions =
        masterData.types?.map((type) => ({
            label: type.label,
            value: type.value,
        })) || [];

    const ownerOptions = projectUsers.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id.toString(),
    }));

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

    const operatingSystemOptions =
        masterData.operatingSystems?.map((os) => ({
            label: os.label,
            value: os.value,
        })) || [];

    const osLicenseOptions =
        masterData.osLicenseOptions?.map((opt) => ({
            label: opt.label,
            value: opt.value.toString(),
        })) || [];

    const handleFormChange = (name, value) => {
        if (name.startsWith("deviceConfig.")) {
            const configField = name.split(".")[1];
            setFormValues({
                ...formValues,
                deviceConfig: {
                    ...formValues.deviceConfig,
                    [configField]: value === "true" ? true : value === "false" ? false : value,
                },
            });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updateData = {
                assetName: formValues.assetName,
                serialKey: formValues.serialKey || undefined,
                assetType: formValues.assetType,
                classification: formValues.classification,
                ownerID: formValues.ownerID ? Number(formValues.ownerID) : undefined,
                assetDepartmentID: formValues.assetDepartmentID
                    ? Number(formValues.assetDepartmentID)
                    : undefined,
                deviceConfig: {
                    operatingSystem: formValues.deviceConfig.operatingSystem || undefined,
                    osVersion: formValues.deviceConfig.osVersion || undefined,
                    osLicense: formValues.deviceConfig.osLicense || false,
                    cpu: formValues.deviceConfig.cpu || undefined,
                    processor: formValues.deviceConfig.processor || undefined,
                    ram: formValues.deviceConfig.ram || undefined,
                    model: formValues.deviceConfig.model || undefined,
                    manufacturer: formValues.deviceConfig.manufacturer || undefined,
                    macAddress: formValues.deviceConfig.macAddress || undefined,
                },
            };

            await dispatch(doUpdateAsset({ assetID: asset.id, assetData: updateData })).unwrap();
            addToast("Hardware asset updated successfully!", {
                appearance: "success",
            });
            setIsSubmitting(false);
            onBack();
        } catch (error) {
            addToast(
                error?.error || error?.message || "Failed to update asset",
                { appearance: "error" }
            );
            setIsSubmitting(false);
        }
    };

    if (isAssetDetailLoading) {
        return (
            <div className="w-full text-left p-4">
                <div className="text-center text-gray-500 py-8">Loading asset details...</div>
            </div>
        );
    }

    return (
        <div className="w-full text-left p-4">
            {/* Header Section */}
            <div className="mb-4 justify-between flex">
                <div>
                    <span className="text-black font-semibold mt-4 block">
                        Hardware Asset / Device
                    </span>
                    <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                        {assetDetail && (
                            <>
                                <span>Create Date: {new Date(assetDetail.createdAt).toLocaleDateString()}</span>
                                {assetDetail.owner && (
                                    <span>Created By: {assetDetail.owner.firstName} {assetDetail.owner.lastName}</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <button 
                        className="btn-primary h-10 rounded-md w-36" 
                        type="submit"
                        form="device-update-form"
                        disabled={isSubmitting || isAssetDetailLoading}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>

            {/* Basic Info Section */}
            <form id="device-update-form" onSubmit={handleUpdate}>
            <div className='bg-white rounded-lg p-4'>
                <div className='flex gap-4 mt-6'>
                    <div className='flex-col w-3/4'>
                        <label>Name</label>
                        <FormInput
                            type="text"
                            name="assetName"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                    <div className='flex-col w-1/4'>
                        <label>Code</label>
                        <FormInput
                            type="text"
                            name="assetCode"
                            formValues={formValues}
                            value={formValues.assetCode}
                            disabled={true}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4 '>
                    <div className='flex-col w-full'>
                        <label>Type</label>
                        <FormSelect
                            name="assetType"
                            formValues={formValues}
                            options={typeOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-full'>
                        <label>Asset Owner</label>
                        <FormSelect
                            name="ownerID"
                            formValues={formValues}
                            options={ownerOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-full'>
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

                <div className='flex gap-4 mt-4'>
                    <div className='flex-col w-full'>
                        <label>Asset Department</label>
                        <FormSelect
                            name="assetDepartmentID"
                            formValues={formValues}
                            options={departmentOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='mt-4'>
                    <label>Serial Key</label>
                    <FormInput
                        type="text"
                        name="serialKey"
                        formValues={formValues}
                        onChange={({ target: { name, value } }) =>
                            handleFormChange(name, value)
                        }
                    />
                </div>
            </div>

            {/* Tabs Section */}
            <div className='mt-6'>
                <div className="flex justify-end mb-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab("configuration")}
                            className={`px-6 py-2 rounded-2xl ${activeTab === "configuration"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            Configuration
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-6 py-2 rounded-2xl ${activeTab === "users"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            Users
                        </button>
                    </div>
                </div>

                {/* Conditional Render */}
                {activeTab === "configuration" && (
                    <div className='bg-white rounded-lg p-4'>
                        <div className='flex gap-4 mt-6'>
                            <div className='flex-col w-3/4'>
                                <label>Operating System</label>
                                <FormSelect
                                    name="deviceConfig.operatingSystem"
                                    formValues={formValues}
                                    options={operatingSystemOptions}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.operatingSystem", value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-2/4'>
                                <label>OS Version</label>
                                <FormInput
                                    type="text"
                                    name="deviceConfig.osVersion"
                                    formValues={formValues}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.osVersion", value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-2/4'>
                                <label>OS License</label>
                                <FormSelect
                                    name="deviceConfig.osLicense"
                                    formValues={formValues}
                                    options={osLicenseOptions}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.osLicense", value === "true")
                                    }
                                />
                            </div>
                        </div>

                        <div className='flex gap-4 mt-4'>
                            <div className='flex-col w-full'>
                                <label>CPU</label>
                                <FormInput
                                    type="text"
                                    name="deviceConfig.cpu"
                                    formValues={formValues}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.cpu", value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>Processor</label>
                                <FormInput
                                    type="text"
                                    name="deviceConfig.processor"
                                    formValues={formValues}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.processor", value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>RAM</label>
                                <FormInput
                                    type="text"
                                    name="deviceConfig.ram"
                                    formValues={formValues}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.ram", value)
                                    }
                                />
                            </div>
                        </div>

                        <div className='flex gap-4 mt-4'>
                            <div className='flex-col w-full'>
                                <label>Model</label>
                                <FormInput
                                    type="text"
                                    name="deviceConfig.model"
                                    formValues={formValues}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.model", value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>Manufacturer</label>
                                <FormInput
                                    type="text"
                                    name="deviceConfig.manufacturer"
                                    formValues={formValues}
                                    onChange={({ target: { value } }) =>
                                        handleFormChange("deviceConfig.manufacturer", value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>MAC Address</label>
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
                    </div>
                )}

                {activeTab === "users" && <UserTable />}
            </div>
            </form>
        </div>
    );
};

export default DeviceUpdate;
