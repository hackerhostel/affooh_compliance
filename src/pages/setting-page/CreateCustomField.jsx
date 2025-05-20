import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx"
import useValidation from "../../utils/use-validation.jsx";
import axios from 'axios';
import WYSIWYGInput from "../../components/WYSIWYGInput.jsx";
import { CustomFieldCreateSchema } from '../../utils/validationSchemas.js';
import { useToasts } from 'react-toast-notifications';
import { getSelectOptions } from "../../utils/commonUtils.js";

const CreateNewCustomField = ({ isOpen, onClose }) => {
    const { addToast } = useToasts();
    const [formValues, setFormValues] = useState({
        fieldTypeID: '',
        name: '',
        description: '',
        optionName: ""
    });

    const [optionName, setOptionName] = useState("");
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors] = useValidation(CustomFieldCreateSchema, formValues);
    const [fieldTypes, setFieldTypes] = useState([]);

    const handleFormChange = (name, value) => {
        if (name === "fieldTypeID") {
            value = value.toString(); 
        }

        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const handleClose = () => {
        onClose();
        setFormValues({ fieldTypeID: '', name: '', description: '' });
        setOptionName("");
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
                    fieldValues: optionName
                        ? [{ value: optionName, colourCode: '#fff' }]
                        : []
                };
                console.log("Submitting payload:", payload);
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

    const fieldType = async () => {
        const response = await axios.get("/custom-fields/field-types");
        console.log("types", response.data)
        setFieldTypes(response.data);
    };

    useEffect(() => {
        fieldType();
    }, []);

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
                                    <FormSelect
                                        name="fieldTypeID"
                                        placeholder="Field Type"
                                        formValues={formValues}
                                        options={getSelectOptions(fieldTypes.body)}
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

                                <div className="flex-col">
                                    <p className="text-secondary-grey">Option Name</p>
                                    <FormInput
                                        type="text"
                                        name="optionName"
                                        value={optionName}
                                        onChange={({ target: { value } }) => setOptionName(value)}
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
