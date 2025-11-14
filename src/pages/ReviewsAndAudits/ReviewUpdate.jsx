import React, { useState } from 'react';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';


const ReviewUpdate = ({ onBack }) => {

    const [formValues, setFormValues] = useState({
        name: '',
        classifications: ''
       
    });


    const classifications = [
        { label: "Confidential", value: "confidential" },
        { label: "Internal Use", value: "internal_use" },
        { label: "Public", value: "public" },
    ];


    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <div className="w-full bg-dashboard-bgc h-full text-left p-4">
            {/* Header Section */}
            <div className="mb-4 justify-between flex">
                <div>
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

            {/* Basic Info Section */}
            <div className='bg-white h-64 rounded-lg p-4'>
                <div className='flex-col gap-4 mt-6'>
                    <div className='flex-col w-full'>
                        <label>Name</label>
                        <FormInput
                            type="text"
                            name="name"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                    
                    <div className='flex-col w-full mt-7'>
                        <label>Classification</label>
                        <FormSelect
                            name="classification"
                            formValues={formValues}
                            options={classifications}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default ReviewUpdate;
