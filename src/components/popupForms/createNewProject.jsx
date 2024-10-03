import React, { useCallback } from 'react';
import FormInput from "../FormInput.jsx";
import FormSelect from "../FormSelect.jsx";
import { XMarkIcon } from '@heroicons/react/24/outline';

const CreateNewScreenPopup = ({
    screenDetails = {},
    handleFormChange,
    formErrors,
    isValidationErrorsShown,
    handleFormSubmit,
    handleClosePopup
}) => {
    const handleProjectChange = (name, value) => {
        handleFormChange(name, value);
    };

    const getProjectOptions = useCallback(() => {
        return [
            { value: 'webApp', label: 'Web Application' },
            { value: 'mobileApp', label: 'Mobile Application' },
            { value: 'desktopApp', label: 'Desktop Application' },
            { value: 'api', label: 'API' },
        ];
    }, []);

    return (
        <div className="fixed inset-y-0 right-0 w-[697px] h-full p-8 bg-white shadow-lg rounded-l-xl z-50">
            <button 
                onClick={handleClosePopup} 
                className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
            >
                <XMarkIcon className='w-6 h-6'/>
            </button>
            <span className="text-2xl mb-6 block">New Project</span>
            <form onSubmit={handleFormSubmit}>
                <div className="mt-10">
                    <FormInput
                        type="text"
                        name="prefix"
                        formValues={screenDetails}
                        placeholder="Prefix"
                        onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                        formErrors={formErrors}
                        showErrors={isValidationErrorsShown}
                        className="w-full h-10 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div className="mt-8">
                    <FormInput
                        type="text"
                        name="name"
                        formValues={screenDetails}
                        placeholder="Project Name"
                        onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                        formErrors={formErrors}
                        showErrors={isValidationErrorsShown}
                        className="w-full h-10 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div className="mt-8 relative">
                    <FormSelect
                        name="projectType"
                        placeholder="Project Type"
                        formValues={screenDetails}
                        options={getProjectOptions()}
                        onChange={handleProjectChange}
                        className="w-full h-10 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div className="flex justify-between gap-2 mt-72">
                    <button
                        type="button"
                        onClick={handleClosePopup}
                        className="bg-white text-gray-600 py-2 px-16 border border-gray-400 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-create-button text-white py-2 px-52 rounded-lg"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNewScreenPopup;
