import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../components/FormInput.jsx";
import useValidation from "../../utils/use-validation.jsx";
import axios from 'axios';
import WYSIWYGInput from "../../components/WYSIWYGInput.jsx";
import { CustomFieldCreateSchema } from '../../utils/validationSchemas.js';
import { useToasts } from 'react-toast-notifications';

const CreateNewCustomField = ({ isOpen, onClose }) => {
    const { addToast } = useToasts();
    const [formValues, setFormValues] = useState({
        fieldType: '',  
        name: '',
        description: ''
    });

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors] = useValidation(CustomFieldCreateSchema, formValues);

    const handleFormChange = (name, value) => {
        if (name === "fieldType") {
            value = parseInt(value, 10); 
        }
        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const handleClose = () => {
        onClose();
        setFormValues({ fieldType: '', name: '', description: '' });
        setIsValidationErrorsShown(false);
    };

    const createNewCustomField = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (formErrors && Object.keys(formErrors).length > 0) {
            console.log("Validation errors:", formErrors);
            setIsValidationErrorsShown(true);
        } else {
            setIsValidationErrorsShown(false);
            try {
                const payload = {
                    ...formValues,
                    fieldValues: []  
                };

                await axios.post("/custom-fields", { customField: payload });

                addToast('Custom field created successfully!', { appearance: 'success' });
                handleClose();
            } catch (error) {
                console.error(error);
                addToast('Failed to create the custom field', { appearance: 'error' });
            }
        }

        setIsSubmitting(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-2/4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">New Custom Field</p>
                            <div className="cursor-pointer" onClick={handleClose}>
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                        <form className="flex flex-col justify-between h-5/6 mt-10" onSubmit={createNewCustomField}>
                            <div className="space-y-4">
                                <div className="flex-col">
                                    <p className="text-secondary-grey">Field Type</p>
                                    <FormInput
                                        type="text"
                                        name="fieldType"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>
                                <div className="flex-col">
                                    <p className="text-secondary-grey">Name</p>
                                    <FormInput
                                        type="text"
                                        name="name"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>

                                <div className="flex-col">
                                    <p className="text-secondary-grey">Description</p>
                                    <WYSIWYGInput
                                        name="description"
                                        value={formValues.description}
                                        onchange={(name, value) => handleFormChange(name, value)}
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>
                            </div>
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

export default CreateNewCustomField;
