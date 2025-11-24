import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline/index.js";
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";


const CreateNewRisk = ({ isOpen, onClose }) => {
    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        classification: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    const classification = [
        { value: "TODO", label: "TODO" },
        { value: "IN PROGRESS", label: "IN PROGRESS" },
        { value: "DONE", label: "DONE" },
    ];

     const isoControl = [
        { value: "ios1", label: "ISO 1" },
        { value: "ios2", label: "ISO 2" },
        { value: "iso3", label: "ISO 3" },
    ];



    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const handleClose = () => {
        onClose();
        setFormValues({
            name: "",
            description: "",
            classification: "",
        });
        setIsValidationErrorsShown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log("Submitting Training Plan:", formValues);
            // await axios.post("/training-plans", formValues);
            handleClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-999">
                    <div className="bg-white p-6 shadow-lg w-2/4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">Create New Risk</p>
                            <div className={"cursor-pointer"} onClick={handleClose}>
                                <XMarkIcon className={"w-6 h-6 text-gray-500"} />
                            </div>
                        </div>
                        <form
                            className={"flex flex-col justify-between h-5/6 mt-10"}
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-8">
                                <div className="flex-col">
                                    <p className={"text-secondary-grey text-left"}>ISO Control</p>
                                    <FormSelect
                                            name="classification"
                                            options={isoControl}
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                        />
                                </div>

                                <div className="flex-col">
                                    <p className={"text-secondary-grey text-left"}>Current gaps</p>
                                       <FormTextArea
                                        type="text"
                                        name="currentGaps"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                    /> 
                                    
                                </div>

                                <div className={"flex-col"}>
                                    <p className={"text-secondary-grey text-left"}>Interested Parties</p>
                                    <FormTextArea
                                        type="text"
                                        name="interestedParties"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-6 self-end w-full">
                                <button
                                    type="button"
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
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateNewRisk;
