import React, { useState } from 'react';
import FormTextArea from '../../../components/FormTextArea.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import FormInput from '../../../components/FormInput.jsx';
import TaskTable from '../RiskManagement/TaskTable.jsx'
const UpdateRiskManagement = ({ row, onBack }) => {

    const [formValues, setFormValues] = useState({
        routeCaseAnalysis: '',
        containmentAction: '',
        correctiveAction: ''

    });

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    const isoControl = [
        { value: "ios1", label: "ISO 1" },
        { value: "ios2", label: "ISO 2" },
        { value: "iso3", label: "ISO 3" },
    ];

    const owner = [
        { value: "user1", label: "User 1" },
        { value: "user2", label: "User 2" },
        { value: "user3", label: "User 3" },
    ];


    return (
        <div className=" rounded-lg">

            <div className="w-full h-full text-left p-4">
                {/* Header Section */}
                <div className="mb-4  justify-between flex">
                    <div>
                        <button onClick={onBack} className="text-blue-600 hover:underline mb-4">←</button>
                        <span className="text-black font-semibold mt-4 block">
                            Risk Management / #
                        </span>
                        <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                            <span>Create Date: 2024/10/04</span>
                            <span>Created By: Nilanga Pathirana</span>
                        </div>
                    </div>
                    <div>
                        <button className="btn-primary h-10 rounded-md w-36" type="button">
                            Update
                        </button>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className='bg-white h-auto rounded-lg p-4 mt-4'>
                    <div className='flex-col space-y-10 mt-6'>
                        <div className='flex-col w-full'>
                            <label>ISO Control</label>
                            <FormSelect
                                name="routeCaseAnalysis"
                                options={isoControl}
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>

                        <div className='flex-col w-full'>
                            <label>Current Gaps</label>
                            <FormTextArea
                                type="text"
                                name="currentGaps"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>

                        <div className='flex-col w-full'>
                            <label>Interested Parties</label>
                            <FormInput
                                type="text"
                                name="interestedParties"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>

                        <div className='flex gap-4'>
                            <div className='flex-col w-1/2'>
                                <label>Threat</label>
                                <FormInput
                                    type="text"
                                    name="threat"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>

                            <div className='flex-col w-1/2'>
                                <label>Reference(s)</label>
                                <FormInput
                                    type="text"
                                    name="references"
                                    formValues={formValues}
                                    onChange={({ target: { name, value } }) =>
                                        handleFormChange(name, value)
                                    }
                                />
                            </div>
                        </div>

                        <div className='flex-col w-full'>
                            <label>Owner</label>
                            <FormSelect
                                name="owner"
                                options={owner}
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>

                    </div>
                </div>

                <TaskTable />

            </div>
        </div>
    );
};

export default UpdateRiskManagement;
