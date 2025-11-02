import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { useToasts } from 'react-toast-notifications';

const CreateNewSoftwareAsset = ({ isOpen, onClose }) => {
    const { addToast } = useToasts();

    // Initial form values
    const [formValues, setFormValues] = useState({
        name: '',
        version: '',
        vendor: '',
        downloadSource: '',
        latestVersion: '',
        license: ''
    });

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const handleClose = () => {
        onClose();
        setFormValues({
            name: '',
            version: '',
            vendor: '',
            downloadSource: '',
            latestVersion: '',
            license: ''
        });
        setIsValidationErrorsShown(false);
    };

    // Dummy select options
    const latestVersionOptions = [
        { label: "Up to date", value: "up_to_date" },
        { label: "Update available", value: "update_available" },
        { label: "Outdated", value: "outdated" },
    ];

    const licenseOptions = [
        { label: "Free", value: "free" },
        { label: "Open Source", value: "open_source" },
        { label: "Commercial", value: "commercial" },
        { label: "Subscription", value: "subscription" },
    ];

    const createNewAsset = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Example validation
        if (!formValues.name || !formValues.version) {
            addToast("Please fill in all required fields.", { appearance: "error" });
            setIsValidationErrorsShown(true);
            setIsSubmitting(false);
            return;
        }

        // Simulate success
        addToast("New software asset created successfully!", { appearance: "success" });
        setIsSubmitting(false);
        handleClose();
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

                                <div className='flex space-x-5 '>
                                    {/* Name */}
                                    <div className="flex-col w-3/4">
                                        <p className="text-secondary-grey">Name</p>
                                        <FormInput
                                            type="text"
                                            name="name"
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

                                {/* Download Source */}
                                <div className="flex-col">
                                    <p className="text-secondary-grey">Download Source</p>
                                    <FormInput
                                        type="text"
                                        name="downloadSource"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>

                                <div className='flex space-x-5'>
                                     {/* Latest Version / Patch */}
                                <div className="flex-col w-1/2">
                                    <p className="text-secondary-grey">Latest Version / Patch</p>
                                    <FormSelect
                                        name="latestVersion"
                                        formValues={formValues}
                                        options={latestVersionOptions}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>

                                {/* License */}
                                <div className="flex-col  w-1/2">
                                    <p className="text-secondary-grey">License</p>
                                    <FormSelect
                                        name="license"
                                        formValues={formValues}
                                        options={licenseOptions}
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
                                    Create
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
