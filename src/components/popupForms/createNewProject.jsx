import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
        // Provide a list of project types instead of actual projects
        return [
            { value: 'webApp', label: 'Web Application' },
            { value: 'mobileApp', label: 'Mobile Application' },
            { value: 'desktopApp', label: 'Desktop Application' },
            { value: 'api', label: 'API' },
        ];
    }, []);

    return (
        <div style={popupStyles}>
            <button onClick={handleClosePopup} style={closeButtonStyles}>
                <XMarkIcon className='w-6 h-6'/>
            </button>
            <span className='text-2xl mb-6 block'>New Project</span>
            <form onSubmit={handleFormSubmit}>
                <div className='mt-14'>
                    <FormInput
                        type="text"
                        name="prefix"
                        formValues={screenDetails}
                        placeholder="Prefix"
                        onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                        formErrors={formErrors}
                        showErrors={isValidationErrorsShown}
                        style={inputStyle}
                    />
                </div>

                <div className='mt-6'>
                    <FormInput
                        type="text"
                        name="name"
                        formValues={screenDetails}
                        placeholder="Project Name"
                        onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                        formErrors={formErrors}
                        showErrors={isValidationErrorsShown}
                        style={inputStyle}
                    />
                </div>

                <div className='mt-6 relative'>
                    <FormSelect
                        name="projectType"
                        placeholder="Project Type"
                        formValues={screenDetails}
                        options={getProjectOptions()}
                        onChange={handleProjectChange}
                        style={{ ...inputStyle, paddingRight: '40px' }}  // Adjust padding for icon
                    />
                </div>

                <div className='flex justify-between mt-64'>
                    <button
                        type="button"
                        onClick={handleClosePopup}
                        style={cancelButtonStyle}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={createButtonStyle}
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

// Updated styles to match the design and position the popup on the right
const popupStyles = {
    position: 'fixed',
    top: '0',
    right: '0',  // Aligns the popup to the right
    width: '697px',  // Adjust the width as per your layout
    height: '100%',  // Makes the popup full height
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.1)',  // Slight shadow to indicate depth
    borderRadius: '0 8px 8px 0',
    zIndex: 1000
};

const closeButtonStyles = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(116, 122, 136, 1)'
};

const inputStyle = {
    width: '100%',
    height: '40px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(230, 230, 230, 1)',
};

const cancelButtonStyle = {
    backgroundColor: '#fff',
    color: 'rgba(116, 122, 136, 1)',
    padding: '12px 50px',
    borderRadius: '6px',
    border: '1px solid rgba(116, 122, 136, 1)',
    cursor: 'pointer'
};

const createButtonStyle = {
    backgroundColor: '#EB5A84',
    color: '#fff',
    padding: '12px 220px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer'
};

export default CreateNewScreenPopup;
