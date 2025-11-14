import React, { useState } from 'react';
import FormTextArea from '../../../components/FormTextArea.jsx';
import TaskTable from '../../ReviewsAndAudits/Non-conformance/TaskTable.jsx'
const NonConformanceUpdate = ({ row, onBack }) => {

    const [formValues, setFormValues] = useState({
        routeCaseAnalysis: '',
        containmentAction: '',
        correctiveAction: ''

    });

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <div className=" rounded-lg">

            <div className="w-full h-full text-left p-4">
                {/* Header Section */}
                <div className="mb-4  justify-between flex">
                    <div>
                        <button onClick={onBack} className="text-blue-600 hover:underline mb-4">←</button>
                        <span className="text-black font-semibold mt-4 block">
                            Review and Audits / ...........
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

                <div className=' flex-col space-y-6 bg-white h-auto rounded-lg p-4'>

                    <div className='flex gap-10'>
                        <div className='flex gap-3'>
                            <span className='text-black font-semibold'>NCR No :</span>
                            <span className='text-text-color'>01</span>
                        </div>

                        <div className='flex gap-3'>
                            <span className='text-black font-semibold'>Source :</span>
                            <span className='text-text-color'>Audit outcome</span>
                        </div>

                        <div className='flex gap-3'>
                            <span className='text-black font-semibold'>Clause No :</span>
                            <span className='text-text-color'>7.3</span>
                        </div>

                        <div className='flex gap-3'>
                            <span className='text-black font-semibold'>Severity :</span>
                            <span className='text-text-color'>Major</span>
                        </div>
                    </div>

                    <div  className='flex gap-8'>
                        <span className='text-black font-semibold w-56'>Description of NC</span>
                        <span className='text-text-color'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum voluptatibus tenetur cum, aperiam expedita alias nulla illum enim dignissimos voluptatum ad tempore ut dolor, perspiciatis cumque fugiat corporis ipsa molestiae.</span>
                    </div>

                </div>

                {/* Basic Info Section */}
                <div className='bg-white h-auto rounded-lg p-4 mt-4'>
                    <div className='flex-col gap-4 mt-6'>
                        <div className='flex-col w-full'>
                            <label>Route case analysis</label>
                            <FormTextArea
                                type="text"
                                name="routeCaseAnalysis"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>

                        <div className='flex-col w-full'>
                            <label>Containment Action</label>
                            <FormTextArea
                                type="text"
                                name="containmentAction"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) =>
                                    handleFormChange(name, value)
                                }
                            />
                        </div>

                        <div className='flex-col w-full'>
                            <label>Corrective Action</label>
                            <FormTextArea
                                type="text"
                                name="correctiveAction"
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

export default NonConformanceUpdate;
