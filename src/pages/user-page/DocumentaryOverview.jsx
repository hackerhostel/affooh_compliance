import React, { useState } from 'react';
import FormTextArea from "../../components/FormTextArea.jsx";
import FormInput from '../../components/FormInput.jsx';
import WYSIWYGInput from "../../components/WYSIWYGInput.jsx";
import { PencilIcon } from "@heroicons/react/24/outline";

const DocumentaryOverview = () => {
    // Initial purpose text
    const initialText = `This document defines the purpose of LifeServ's Quality Management System (QMS) in accordance with the requirements of ISO 9001:2015. It aims to establish a clear understanding of what the QMS covers, ensuring that all relevant activities and processes are managed to consistently meet customer and applicable statutory and regulatory requirements, and to enhance customer satisfaction through the effective application of the system, including processes for improvement.`;

    const [formValues, setFormValues] = useState({
        purpose: initialText,
        name: "",
        description: ""
    });

    const [isEditing, setIsEditing] = useState(false);

    // General handler for all form inputs
    const handleChange = (name, value) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            {/* Top Buttons */}
            <div className='flex justify-end items-center mt-4 space-x-2'>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Archived</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Approved</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
            </div>

            {/* Purpose Section */}
            <div className='bg-white rounded mt-10'>
                <div className='p-4 flex space-x-2 items-center'>
                    <span className='text-lg font-semibold'>Purpose</span>
                    <button onClick={() => setIsEditing(prev => !prev)}>
                        <PencilIcon className='w-4 h-5 text-text-color' />
                    </button>
                </div>

                <div className='p-2'>
                   {isEditing ? (
                    <FormTextArea
                        name="purpose"
                        formValues={formValues}
                        onChange={(name, value) => handleChange(name, value)}
                        showLabel={false}
                        className="w-full"
                        rows={5}
                    />
                ) : (
                    <p>{formValues.purpose}</p>
                )} 
                </div>

                
            </div>

            <div className='flex flex-col gap-1 mt-10 bg-white'>
                <div className=' rounded w-64 mt-10 p-4'>
                    <FormInput
                        type="text"
                        name="name"
                        formValues={formValues}
                        onChange={({ target: { name, value } }) => handleChange(name, value)}
                    />
                </div>
                <div className=' rounded p-4'>
                    <WYSIWYGInput
                        initialValue={{ description: formValues.description }}
                        value={formValues.description}
                        name="description"
                        onChange={(name, value) => handleChange(name, value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentaryOverview;
