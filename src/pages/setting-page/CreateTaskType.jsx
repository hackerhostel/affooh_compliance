import React, { useState, useEffect, useCallback } from 'react';
import {useSelector, useDispatch} from "react-redux";
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx"
import useValidation from "../../utils/use-validation.jsx";
import axios from 'axios';
import WYSIWYGInput from "../../components/WYSIWYGInput.jsx";
import { CustomFieldCreateSchema } from '../../utils/validationSchemas.js';
import { useToasts } from 'react-toast-notifications';
import { getSelectOptions } from "../../utils/commonUtils.js";
import {selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";
import {fetchScreensByProject, selectScreens} from "../../state/slice/screenSlice.js";

const CreateNewTaskType = ({ isOpen, onClose }) => {
    const { addToast } = useToasts();
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        projectIDs: "",
        screenID: ""
    });

    const [optionName, setOptionName] = useState("");
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors] = useValidation(CustomFieldCreateSchema, formValues);
    const [fieldTypes, setFieldTypes] = useState([]);
    const dispatch = useDispatch();
    const projectList = useSelector(selectProjectList);
    const selectedProject = useSelector(selectSelectedProject);
    const screens = useSelector(selectScreens);

    useEffect(() => {
        if (selectedProject && selectedProject.id) {
            dispatch(fetchScreensByProject(selectedProject.id));
        }
    }, [dispatch, selectedProject]);

    const handleFormChange = (name, value) => {
        if (name === "fieldTypeID") {
            value = value.toString(); 
        }

        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const getProjectOptions = useCallback(() => {
        return projectList.map((project) => ({
          value: project.id,
          label: project.name,
        }));
      }, [projectList]);

    const getScreenOptions = useCallback(() => {
        if (!selectedProject || !selectedProject.id) return [];
        return (screens || [])
            .filter(screen =>
                Array.isArray(screen.projects) &&
                screen.projects.some(project => project.id === selectedProject.id)
            )
            .map(screen => ({
                value: screen.id,
                label: screen.name,
            }));
    }, [screens, selectedProject]);

    const handleClose = () => {
        onClose();
        setFormValues({ name: '', description: '', projectIDs: "", screenID: "" });
        setOptionName("");
        setIsValidationErrorsShown(false);
    };

    const createNewTaskType = async (event) => {
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
                };
                console.log("Submitting payload:", payload);
                await axios.post("/task-types", { taskTypes: payload });
                

                addToast('Task type created successfully!', { appearance: 'success' });
                handleClose();
            } catch (error) {
                console.error(error);
                addToast('Failed to create the Task type', { appearance: 'error' });
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
                            <p className="font-bold text-2xl">New Task Type</p>
                            <div className="cursor-pointer" onClick={handleClose}>
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                        <form className="flex flex-col justify-between h-5/6 mt-10" onSubmit={createNewTaskType}>
                            <div className="space-y-4">
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
                                     <p className="text-secondary-grey">Projects</p>
                                   <FormSelect
                                            name="projectIDs"
                                            showLabel={false}
                                            formValues={formValues}
                                            placeholder="Projects"
                                            options={getProjectOptions()}
                                            onChange={handleFormChange}
                                          />
                                </div>

                                <div className="flex-col">
                                     <p className="text-secondary-grey">Screens</p>
                                   <FormSelect
                                            name="screenID"
                                            showLabel={false}
                                            formValues={formValues}
                                            placeholder="Screens"
                                            options={getScreenOptions()}
                                            onChange={handleFormChange}
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

export default CreateNewTaskType;
