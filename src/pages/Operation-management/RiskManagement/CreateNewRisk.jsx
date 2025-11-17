import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline/index.js";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";

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
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-2/4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">Create New Lead</p>
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
                                    <p className={"text-secondary-grey text-left"}>Lead Name</p>
                                    <FormInput
                                        type="text"
                                        name="name"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                    />
                                </div>

                                <div className="flex-col">
                                    <p className={"text-secondary-grey text-left"}>Owner</p>
                                    <FormInput
                                        type="text"
                                        name="owner"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                    />
                                </div>

                                <div className={"flex-col"}>
                                    <p className={"text-secondary-grey text-left"}>Company</p>
                                    <FormInput
                                        type="text"
                                        name="company"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) =>
                                            handleFormChange(name, value)
                                        }
                                    />
                                </div>

                                <div className="flex gap-5">
                                    <div className="flex-col w-1/3">
                                        <p className={"text-secondary-grey text-left"}>Type</p>
                                        <FormSelect
                                            name="classification"
                                            options={classification}
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                        />
                                    </div>

                                    <div className="flex-col w-1/3">
                                        <p className={"text-secondary-grey text-left"}>Secure</p>
                                        <FormSelect
                                            name="classification"
                                            options={classification}
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                        />
                                    </div>

                                    <div className="flex-col w-1/3">
                                        <p className={"text-secondary-grey text-left"}>Stage</p>
                                        <FormSelect
                                            name="classification"
                                            options={classification}
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) =>
                                                handleFormChange(name, value)
                                            }
                                        />
                                    </div>
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
