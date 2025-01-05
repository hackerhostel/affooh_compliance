import React, { useEffect, useRef, useState } from 'react';
import FormInput from "../../FormInput.jsx";
import useValidation from "../../../utils/use-validation.jsx";
import { TaskCreateSchema } from "../../../state/domains/authModels.js";
import FormSelect from "../../FormSelect.jsx";
import TaskScreenDetails from "./TaskScreenDetails.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAppConfig } from "../../../state/slice/appSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";
import { useToasts } from "react-toast-notifications";
import { XMarkIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline/index.js";
import { getUserSelectOptions } from "../../../utils/commonUtils.js";
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";
import WYSIWYGInput from "../../WYSIWYGInput.jsx";

function getRequiredAdditionalFieldList(fieldsArray) {
    const requiredFields = [];

    fieldsArray.forEach(field => {
        if (Array.isArray(field.fields)) {
            field.fields.forEach(subField => {
                if (subField.required === 1) {
                    requiredFields.push(subField.id)
                }
            });
        }
    });

    return requiredFields;
}

const TaskCreateComponent = ({ sprintId, onClose, isOpen, epics, refetchSprint }) => {
    const appConfig = useSelector(selectAppConfig);
    const selectedProject = useSelector(selectSelectedProject);
    const users = useSelector(selectProjectUserList);
    const { addToast } = useToasts();

    const [selectedPriority, setSelectedPriority] = useState("Low");
    const [loading, setLoading] = useState(false);
    const [createTaskForm, setCreateTaskForm] = useState({ name: '', taskTypeID: '' });
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const formRef = useRef(null);
    const [formErrors] = useValidation(TaskCreateSchema, createTaskForm);

    const [isTaskTypeLoading, setIsTaskTypeLoading] = useState(false);
    const [isTaskTypeApiError, setIsTaskTypeApiError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEpicScreen, setIsEpicScreen] = useState(false);

    const [screenDetails, setScreenDetails] = useState(null);
    const [additionalFormValues, setAdditionalFormValues] = useState({});
    const [requiredAdditionalFieldList, setRequiredAdditionalFieldList] = useState([]);

    useEffect(() => {
        console.log("data", appConfig)
    }, [appConfig])

    const handleFormChange = (name, value) => {
        if (name === 'taskTypeID') {
            const selectedTaskType = appConfig.taskTypes.find(tt => tt.id === parseInt(value))
            if (selectedTaskType?.screenID) {
                fetchScreenForTask(selectedTaskType.screenID)
                setIsEpicScreen(selectedTaskType.value === 'Epic')
            }
        }

        const newForm = { ...createTaskForm, [name]: value };
        setCreateTaskForm(newForm);
    };

    const handleAdditionalFieldChange = (fieldData) => {
        setAdditionalFormValues(prevValues => ({
            ...prevValues, [fieldData.taskFieldID]: fieldData
        }));
    };

    const handleTaskCreateClose = () => {
        setCreateTaskForm({ name: '', taskTypeID: '' })
        onClose()
    }

    const fetchScreenForTask = async (screenId) => {
        console.log('fetchScreenForTask called with screenId:', screenId);
        setIsTaskTypeLoading(true)
        try {
            const response = await axios.get(`screens/${screenId}?projectID=${selectedProject.id}`)
            if (response.data.screen) {
                const screenData = response.data.screen

                setScreenDetails(screenData)
                console.log('Fetched screen details:', screenData);
                setRequiredAdditionalFieldList(getRequiredAdditionalFieldList(screenData.tabs))
            }
            setIsTaskTypeApiError(false)
        } catch (e) {
            console.error('Error fetching screen details:', e);
            setIsTaskTypeApiError(true)
        } finally {
            setIsTaskTypeLoading(false)
            setAdditionalFormValues({})
        }
    }

    const handleCreateTask = async (event) => {
        event.preventDefault();
        let additionalFieldFormErrors = false;

        requiredAdditionalFieldList.forEach(r => {
            if (!additionalFormValues[r]) {
                additionalFieldFormErrors = true;
            }
        });

        if (formErrors || additionalFieldFormErrors) {
            setIsValidationErrorsShown(true);
            return;
        }

        if (loading) {
            return;
        }

        setLoading(true);
        setIsValidationErrorsShown(false);

        const payload = {
            ...createTaskForm,
            projectID: selectedProject?.id,
            sprintID: sprintId,
            attributes: Object.entries(additionalFormValues).map(([key, value]) => value),
        };

        if (createTaskForm?.taskOwner) {
            const ownerValues = screenDetails?.tabs[0]?.fields.find(
                at => at?.fieldType?.name === "USER_PICKER"
            );
            let taskOwnerFound = false;

            if (ownerValues?.fieldType?.id) {
                payload.attributes = payload.attributes.map(attribute => {
                    if (attribute.fieldTypeName === "USER_PICKER") {
                        taskOwnerFound = true;
                        return {
                            fieldTypeName: "USER_PICKER",
                            fieldValue: [payload?.taskOwner],
                            taskFieldID: ownerValues?.id
                        };
                    }
                    return attribute;
                });

                if (!taskOwnerFound) {
                    payload.attributes.push({
                        fieldTypeName: "USER_PICKER",
                        fieldValue: [payload?.taskOwner],
                        taskFieldID: ownerValues?.id
                    });
                }
            }

            delete payload?.taskOwner;
        }

        try {
            const response = await axios.post("tasks", { task: payload });
            addToast(`New task ID: ${response.data.id} added`, { appearance: 'success', autoDismiss: true });
            handleTaskCreateClose();
            refetchSprint();
        } catch (e) {
            addToast(e.message || 'An error occurred while creating the task.', {
                appearance: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const getTaskAdditionalDetailsComponent = () => {
        if (isTaskTypeLoading) {
            return <div className="my-5"><SkeletonLoader /></div>
        }

        if (isTaskTypeApiError) {
            return <div className="my-5"><ErrorAlert message="Cannot get task additional details at the moment" /></div>
        }

        if (!screenDetails) {
            return <></>
        }

        return <TaskScreenDetails
            taskFormData={additionalFormValues}
            handleFormChange={handleAdditionalFieldChange}
            isValidationErrorsShown={isValidationErrorsShown}
            screenDetails={screenDetails}
        />
    }

    const priorities = [
        { label: "Low", value: "low", bgColor: "bg-gray-100", textColor: "text-gray-600" },
        { label: "Medium", value: "medium", bgColor: "bg-gray-100", textColor: "text-gray-600" },
        { label: "High", value: "high", bgColor: "bg-red-100", textColor: "text-red-600" },
    ];

    const handlePriorityClick = (priorityValue) => {
        setSelectedPriority(priorityValue); // Update the selected priority
        if (onChange) {
            onChange(priorityValue); // Trigger the onChange callback
        }
    };

    return (<>
        {isOpen && (
            <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-10">
                <div style={{ width: '715px' }} className="bg-white pl-10 pt-6 pr-6 pb-10 shadow-lg h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-xl text-popup-screen-header">Create New Task</p>
                        <div className={"cursor-pointer"} onClick={handleTaskCreateClose}>
                            <XMarkIcon className={"w-6 h-6 text-gray-500"} />
                        </div>
                    </div>
                    <form className="space-y-4 mt-10" ref={formRef} onSubmit={handleCreateTask}>
                        <div className="mb-6">
                            <FormSelect
                                showLabel
                                placeholder="Task Type"
                                name="taskTypeID"
                                formValues={createTaskForm}
                                options={appConfig.taskTypes.map(tt => {
                                    return {
                                        label: tt.value, value: tt.id
                                    }
                                })}
                                onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                formErrors={formErrors}
                                showErrors={isValidationErrorsShown}
                            />

                            <FormSelect
                                showLabel
                                placeholder="Task Type"
                                name="taskTypeID"
                                formValues={createTaskForm}
                                options={appConfig.taskTypes.map(tt => {
                                    return {
                                        label: tt.value, value: tt.id
                                    }
                                })}
                                onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                formErrors={formErrors}
                                showErrors={isValidationErrorsShown}
                            />
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <div className="border border-gray-300 rounded-md p-2">
                                <div className="flex space-x-2 mb-2">
                                    <button type="button" className="p-1 rounded hover:bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <WYSIWYGInput value={createTaskForm.description} name={"description"}
                                        onchange={handleFormChange} />
                                </div>
                            </div>
                        </div>

                        {!isEpicScreen && (
                            <div className="mb-6">
                                <FormSelect
                                    showLabel
                                    placeholder="Epic"
                                    name="epicID"
                                    formValues={createTaskForm}
                                    options={epics}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                />
                            </div>
                        )}

                        <div className="flex space-x-4 mb-6">
                            <div className="w-2/4">
                                <FormSelect
                                    showLabel
                                    placeholder="Assignee"
                                    name="assigneeID"
                                    formValues={createTaskForm}
                                    options={getUserSelectOptions(users)}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                />
                            </div>
                            <div className="w-2/4">
                                <FormSelect
                                    showLabel
                                    placeholder="Task Owner"
                                    name="taskOwner"
                                    formValues={createTaskForm}
                                    options={getUserSelectOptions(users)}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                />
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                            <div className="w-6 h-6">
                                <ArrowUpOnSquareIcon className='text-text-color' />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Drag & Drop attachment <br /> OR 
                            </p>

                            <button className='bg-primary-pink px-4 py-2 rounded-md text-white mt-5'>
                                Brows Files
                            </button>
                        </div>


                        <div className='flex justify-between space-x-5'>
                            <div className='w-48'>
                                <FormSelect
                                    showLabel
                                    placeholder="Status"
                                    name="status"
                                    formValues={createTaskForm}
                                    options={appConfig.sprintStatuses.map(tt => {
                                        return {
                                            label: tt.value, value: tt.id
                                        }
                                    })}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                />
                            </div>

                            <div className=''>
                                <label className=" text-text-color font-medium">Priority</label>
                                <div className="mt-1 flex border border-gray-300 text-text-color rounded-lg overflow-hidden h-11">
                                    {priorities.map(({ label, value, bgColor, textColor }) => (
                                        <button
                                            key={value}
                                            onClick={() => handlePriorityClick(value)}
                                            className={`flex-1 px-4 py-2 text-center text-text-color ${selectedPriority === value ? `font-bold ${bgColor} ${textColor}` : "font-medium bg-white text-gray-600"
                                                } border-r last:border-r-0 hover:${bgColor}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='w-48'>
                                <FormInput
                                    showLabel
                                    placeholder="estimation"
                                    type="text"
                                    name="estimation"
                                    formValues="createTaskForm"
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>
                        </div>

                        <div className='flex justify-between'>
                            <div className='w-48'>
                                <FormInput
                                    showLabel
                                    placeholder="Start Date"
                                    type="date"
                                    name="startDate"
                                    formValues="createTaskForm"
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>

                            <div className='w-48'>
                                <FormInput
                                    showLabel
                                    placeholder="End date"
                                    type="date"
                                    name="endDate"
                                    formValues="createTaskForm"
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>

                            <div className='w-48'>
                                <FormInput
                                    showLabel
                                    placeholder="Release"
                                    type="text"
                                    name="release"
                                    formValues="createTaskForm"
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>
                        </div>



                        {getTaskAdditionalDetailsComponent()}

                        <div className="flex space-x-4 mt-10 self-end w-full">
                            <button
                                onClick={handleTaskCreateClose}
                                className="btn-secondary"
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
            </div>)}
    </>);
};

export default TaskCreateComponent;