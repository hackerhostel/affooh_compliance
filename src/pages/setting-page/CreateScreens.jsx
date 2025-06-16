import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import useValidation from "../../utils/use-validation.jsx";
import axios from 'axios';
import WYSIWYGInput from "../../components/WYSIWYGInput.jsx";
import { CustomFieldCreateSchema } from '../../utils/validationSchemas.js';
import { useToasts } from 'react-toast-notifications';
import { getSelectOptions } from "../../utils/commonUtils.js";
import DataGrid, { Column, Scrolling, Sorting } from 'devextreme-react/data-grid';
import { selectProjectList, selectSelectedProject } from "../../state/slice/projectSlice.js";
import {
    fetchCustomFields,
    setSelectedCustomFieldId,
    clearSelectedCustomFieldId,
} from "../../state/slice/customFieldSlice";


const CreateNewCustomField = ({ isOpen, onClose }) => {
    const { addToast } = useToasts();
    const [formValues, setFormValues] = useState({
        fieldTypeID: '',
        name: '',
        description: '',
        optionName: ''
    });

    const [optionName, setOptionName] = useState("");
    const [optionsList, setOptionsList] = useState([]);
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [customFieldOptions, setCustomFieldOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors] = useValidation(CustomFieldCreateSchema, formValues);
    const projectList = useSelector(selectProjectList);
    const selectedProject = useSelector(selectSelectedProject);
    const dispatch = useDispatch();


    const handleFormChange = (name, value) => {
        if (name === "fieldTypeID") {
            value = value.toString();
            setOptionsList([]);
        }

        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const resultAction = await dispatch(fetchCustomFields(selectedProject?.id));
                if (fetchCustomFields.fulfilled.match(resultAction)) {
                    console.log("Fetched Custom Fields:", resultAction.payload);
                    const options = resultAction.payload.map(field => ({
                        label: field.name,
                        value: field.id
                    }));
                    setCustomFieldOptions(options);
                } else {
                    console.error("Failed to fetch custom fields:", resultAction.error);
                }
            } catch (error) {
                console.error("Error while fetching custom fields:", error);
            }
        };

        if (isOpen && selectedProject?.id) {
            fetchFields();
        }
    }, [dispatch, isOpen, selectedProject]);


    const handleClose = () => {
        onClose();
        setFormValues({ fieldTypeID: '', name: '', description: '', optionName: '' });
        setOptionName("");
        setOptionsList([]);
        setIsValidationErrorsShown(false);
    };

    const handleAddOption = () => {
        if (optionName.trim()) {
            setOptionsList([...optionsList, { value: optionName, colourCode: '#fff' }]);
            setOptionName("");
        }
    };

    const handleDeleteOption = (index) => {
        const newList = [...optionsList];
        newList.splice(index, 1);
        setOptionsList(newList);
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
                    fieldValues: optionsList
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

    const getProjectOptions = useCallback(() => {
        return projectList.map((project) => ({
            value: project.id,
            label: project.name,
        }));
    }, [projectList]);


    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-2/4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">New Screen</p>
                            <div className="cursor-pointer" onClick={handleClose}>
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                        <form onSubmit={createNewCustomField} className="flex flex-col space-y-6">

                            <div>
                                <p className="text-secondary-grey">Name</p>
                                <FormInput
                                    type="text"
                                    name="name"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>

                            <div>
                                <p className="text-secondary-grey">Projects</p>
                                <FormSelect
                                    name="project"
                                    showLabel={false}
                                    formValues={{ project: selectedProject?.id }}
                                    placeholder="Select a project"
                                    options={getProjectOptions()}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div>
                                <p className="text-secondary-grey">escription</p>
                                <WYSIWYGInput
                                    name="description"
                                    value={formValues.description}
                                    onchange={(name, value) => handleFormChange(name, value)}
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>

                            <div className='flex-col'>
                                <p className="text-secondary-grey">Fields</p>
                                
                                    <FormSelect
                                     style={{ width: "600px" }}
                                        name="customField"
                                        formValues={formValues}
                                        onChange={handleFormChange}
                                        options={customFieldOptions}
                                    />
                  
                            </div>

                            {optionsList.length > 0 && (
                                <div className="mt-4">
                                    <DataGrid
                                        dataSource={optionsList}
                                        keyExpr="value"
                                        allowColumnReordering={true}
                                        showBorders={false}
                                        width="100%"
                                        className="rounded-lg overflow-hidden"
                                        showRowLines={true}
                                        showColumnLines={false}
                                    >
                                        <Scrolling columnRenderingMode="virtual" />
                                        <Sorting mode="none" />

                                        <Column width={50} cellRender={({ rowIndex }) => rowIndex + 1} />
                                        <Column dataField="value" caption="Option" />
                                        <Column
                                            caption="Action"
                                            width={100}
                                            cellRender={({ rowIndex }) => (
                                                <div className="flex items-center">
                                                    <TrashIcon
                                                        className="w-5 h-5 text-text-color cursor-pointer"
                                                        onClick={() => handleDeleteOption(rowIndex)}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </DataGrid>
                                </div>
                            )}



                            <div className="flex justify-end space-x-4 mt-6">
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
