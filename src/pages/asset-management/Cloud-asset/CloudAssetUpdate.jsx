import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';


const CloudAssetUpdate = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState("configuration");

    const [formValues, setFormValues] = useState({
        name: '',
        code: '',
        type: '',
        assetOwner: '',
        classification: '',
        serialKey: '',
        qty: '',
        area: '',
        remarks: '',
        vendor: '',
        downloadSource: '',
        patch: '',
        license: '',
        approvedBy: '',
        approvedDate: '',
        approvalStatus: false,
        dueDate: '',
    });

    const types = [
        { label: "Furniture", value: "furniture" },
        { label: "Device", value: "device" },
    ];

    const patch = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
    ];

    const license = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
    ];

    const area = [
        { label: "area1", value: "area1" },
        { label: "area2", value: "area2" },
    ];

    const assetOwners = [
        { label: "John Doe", value: "john_doe" },
        { label: "Sarah Johnson", value: "sarah_johnson" },
        { label: "Michael Smith", value: "michael_smith" },
    ];

    const classifications = [
        { label: "Confidential", value: "confidential" },
        { label: "Internal Use", value: "internal_use" },
        { label: "Public", value: "public" },
    ];

    const operationSystems = [
        { label: "Windows", value: "windows" },
        { label: "Mac", value: "mac" },
        { label: "Linux", value: "linux" },
    ];

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <div className="w-full text-left p-4">
            {/* Header Section */}
            <div className="mb-4 justify-between flex">
                <div>
                    <span className="text-black font-semibold mt-4 block">
                        Cloud Asset
                    </span>
                    <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                        <span>Create Date: 2024/10/04</span>
                        <span>Created By: Nilanga Pathirana</span>
                    </div>
                </div>
                <div>
                    <button className="btn-primary h-10 rounded-md w-36" type="button">
                        Update
                    </button>
                </div>
            </div>

            {/* Basic Info Section */}
            <div className='bg-white rounded-lg p-4'>
                <div className='flex gap-4 mt-6'>
                    <div className='flex-col w-3/4'>
                        <label>Name</label>
                        <FormInput
                            type="text"
                            name="name"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                    <div className='flex-col w-1/4'>
                        <label>Version</label>
                        <FormInput
                            type="text"
                            name="code"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4 '>
                    <div className='flex-col w-full'>
                        <label>Asset type</label>
                        <FormSelect
                            name="type"
                            formValues={formValues}
                            options={types}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-full'>
                        <label>Asset Owner</label>
                        <FormSelect
                            name="assetOwner"
                            formValues={formValues}
                            options={assetOwners}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-full'>
                        <label>Classifications</label>
                        <FormSelect
                            name="classification"
                            formValues={formValues}
                            options={classifications}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4 '>
                    <div className='flex-col w-1/3'>
                        <label>Backup Availability</label>
                        <FormSelect
                            name="backupAvailability"
                            formValues={formValues}
                            options={types}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-1/3'>
                        <label>Backup Location ...</label>
                        <FormInput
                            type="text"
                            name="backupLocation"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-1/3'>
                        <label>Used for Personal data processing?</label>
                        <FormSelect
                            name="personalInformation"
                            formValues={formValues}
                            options={types}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='mt-4 flex gap-5'>
                    <div className='flex-col w-full '>
                        <label>Vendor</label>
                        <FormSelect
                            name="vendor"
                            formValues={formValues}
                            options={patch}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>    
                </div>

            </div>
        </div>
    );
};

export default CloudAssetUpdate;
