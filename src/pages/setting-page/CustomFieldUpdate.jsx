import React, { useState } from 'react';
import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "../../components/sprint-table/custom-style.css";
import {
    PlusCircleIcon,
    EllipsisVerticalIcon,
    TrashIcon,
    PencilSquareIcon,
    CheckBadgeIcon,
    XMarkIcon,
  } from "@heroicons/react/24/outline";

const OptionsTable = () => {
    const [options, setOptions] = useState([
        { id: 1, name: "Option 1" },
        { id: 2, name: "Option 2" },
        { id: 3, name: "Option 3" },
    ]);

    const handleDelete = (id) => {
        setOptions(options.filter(option => option.id !== id));
    };

    return (
        <div className="p-3 bg-dashboard-bgc h-full">
            <div>
                <div className="flex items-center justify-between p-4">
                    <p className="text-secondary-grey text-lg font-medium">
                        {`Options (${options.length})`}
                    </p>
                </div>
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
                                    <EllipsisVerticalIcon className='w-5'/>
                                </button>
                            </div>
                        )}
                    />
                </DataGrid>
            </div>
        </div>
    );
};

const CustomFieldUpdate = () => {
    const [formValues, setFormValues] = useState({ name: '', description: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

    const handleFormChange = (name, value, validate) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
        if (validate) {
            
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
                    <button className='bg-primary-pink px-8 py-2 rounded-md text-white'>Update</button>
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

                <OptionsTable />
            </div>
        </div>
    );
};

export default CustomFieldUpdate;