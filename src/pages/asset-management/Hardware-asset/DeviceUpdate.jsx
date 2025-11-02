import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import UserTable from './UserTable';

const DeviceUpdate = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState("configuration");

    const [formValues, setFormValues] = useState({
        name: '',
        code: '',
        type: '',
        assetOwner: '',
        classification: '',
        serialKey: '',
    });

    const types = [
        { label: "Furniture", value: "furniture" },
        { label: "Device", value: "device" },
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
                        Hardware Asset / Device
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
                        <label>Code</label>
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
                        <label>Type</label>
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
                        <label>Classification</label>
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
                                    name="operationSystem"
                                    formValues={formValues}
                                    options={operationSystems}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-2/4'>
                                <label>OS Version</label>
                                <FormInput
                                    type="text"
                                    name="osVersion"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                        </div>

                        <div className='flex gap-4 mt-4'>
                            <div className='flex-col w-full'>
                                <label>CPU</label>
                                <FormInput
                                    type="text"
                                    name="cpu"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>Processor</label>
                                <FormInput
                                    type="text"
                                    name="processor"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>RAM</label>
                                <FormInput
                                    type="text"
                                    name="ram"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                        </div>

                        <div className='flex gap-4 mt-4'>
                            <div className='flex-col w-full'>
                                <label>Model</label>
                                <FormInput
                                    type="text"
                                    name="model"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>Manufacturer</label>
                                <FormInput
                                    type="text"
                                    name="manufacture"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                            <div className='flex-col w-full'>
                                <label>MAC Address</label>
                                <FormInput
                                    type="text"
                                    name="macAddress"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && <UserTable />}
            </div>
        </div>
    );
};

export default DeviceUpdate;
