import React, { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import {
    EllipsisVerticalIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import axios from 'axios'; // Assuming axios is used for API calls

const OptionsTable = ({ options, handleDelete }) => {
    return (
        <div>
            <DataGrid
                dataSource={options}
                allowColumnReordering={true}
                showBorders={false}
                width="100%"
                className="rounded-lg overflow-hidden"
                showRowLines={true}
                showColumnLines={false}
            >
                <Scrolling columnRenderingMode="virtual" />
                <Sorting mode="multiple" />
                <Paging enabled={true} pageSize={4} />

                <Column
                    dataField="name"
                    caption="Option Name"
                    width="80%"
                />
                <Column
                    caption="Actions"
                    width="20%"
                    cellRender={(data) => (
                        <div className="flex space-x-2">
                            <button
                                className="text-text-color cursor-pointer"
                                onClick={() => handleDelete(data.data.id)}
                            >
                                <TrashIcon className="w-5" />
                            </button>
                        </div>
                    )}
                />
            </DataGrid>
        </div>
    );
};

const CustomFieldUpdate = ({ customFieldId }) => {
    const [formValues, setFormValues] = useState({ name: '', description: '' });
    const [options, setOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [fieldTypes, setFieldTypes] = useState([]);

    useEffect(() => {
        // Fetch current custom field data
        const fetchCustomFieldData = async () => {
            try {
                const { data } = await axios.get(`/custom-fields/${customFieldId}`);
                setFormValues({ name: data.body.name, description: data.body.description });
                setOptions(data.body.options || []);
            } catch (error) {
                console.error("Error fetching custom field data:", error);
            }
        };

        // Fetch available field types
        const fetchFieldTypes = async () => {
            try {
                const { data } = await axios.get('/custom-fields/field-types');
                setFieldTypes(data.body);
            } catch (error) {
                console.error("Error fetching field types:", error);
            }
        };

        fetchCustomFieldData();
        fetchFieldTypes();
    }, [customFieldId]);

    const handleFormChange = (name, value, validate) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
        if (validate) {
            // Validate form logic
        }
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await axios.delete(`/custom-fields/${customFieldId}/field-values/${optionId}`);
            setOptions(options.filter(option => option.id !== optionId));
        } catch (error) {
            console.error("Error deleting custom field option:", error);
        }
    };

    const handleUpdateCustomField = async () => {
        try {
            await axios.put(`/custom-fields/${customFieldId}`, {
                customField: formValues,
            });
            alert("Custom field updated successfully!");
        } catch (error) {
            console.error("Error updating custom field:", error);
        }
    };

    return (
        <div className='p-3 bg-dashboard-bgc h-full'>
            <div className='flex p-3 justify-between'>
                <div className='flex flex-col space-y-5'>
                    <div className='flex items-center space-x-3'>
                        <div>
                            <span className='text-lg font-semibold'>Custom Field</span>
                        </div>
                        <div>
                            <span className='bg-primary-pink text-white rounded-full px-6 py-1 inline-block'>Text box</span>
                        </div>
                    </div>
                    <div className='flex space-x-5 text-text-color'>
                        <span>Created date: <span>05/03/2025</span></span>
                        <span>Created By: Nilanga</span>
                    </div>
                </div>
                <div>
                    <button
                        className='bg-primary-pink px-8 py-2 rounded-md text-white'
                        onClick={handleUpdateCustomField}
                    >
                        Update
                    </button>
                </div>
            </div>

            <div className='mt-5 bg-white rounded-md'>
                <div className='p-4'>
                    <FormInput
                        type='text'
                        name='name'
                        formValues={formValues}
                        placeholder='Name'
                        onChange={({ target: { name, value } }) =>
                            handleFormChange(name, value, true)
                        }
                        formErrors={formErrors}
                        showErrors={isValidationErrorsShown}
                    />

                    <FormTextArea
                        name='description'
                        placeholder='Description'
                        showShadow={false}
                        formValues={formValues}
                        onChange={({ target: { name, value } }) =>
                            handleFormChange(name, value, true)
                        }
                        rows={6}
                        formErrors={formErrors}
                        showErrors={isValidationErrorsShown}
                    />
                </div>

                <OptionsTable
                    options={options}
                    handleDelete={handleDeleteOption}
                />
            </div>
        </div>
    );
};

export default CustomFieldUpdate;
