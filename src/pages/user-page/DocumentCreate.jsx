import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import UserSelect from '../../components/UserSelect.jsx';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const CreateDocumentPopup = ({ isOpen, onClose }) => {
    const { addToast } = useToasts();

    const [formValues, setFormValues] = useState({
        title: '',
        documentId: '',
        version: '',
        effectiveDate: '',
        classification: '',
        owner: '',
        approvedBy: '',
        template: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    const handleClose = () => {
        onClose();
        setFormValues({
            title: '',
            documentId: '',
            version: '',
            effectiveDate: '',
            classification: '',
            owner: '',
            approvedBy: '',
            template: ''
        });
    };

    const createDocument = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post("/documents", { document: formValues });

            if (response?.data?.success) {
                addToast('Document Successfully Created', { appearance: 'success' });
                handleClose();
            } else {
                addToast('Failed To Create The Document', { appearance: 'error' });
            }
        } catch (error) {
            addToast('Failed To Create The Document', { appearance: 'error' });
        }

        setIsSubmitting(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed  inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">New Document</p>
                            <div className="cursor-pointer" onClick={handleClose}>
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>

                        <form className="flex flex-col justify-between h-5/6 mt-6" onSubmit={createDocument}>
                            <div className="space-y-4">
                                <div className="flex-col">
                                    <p className="text-secondary-grey">Document Title</p>
                                    <FormInput
                                        type="text"
                                        name="title"
                                        formValues={formValues}
                                        onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Document ID</p>
                                        <FormInput
                                            type="text"
                                            name="documentId"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                        />
                                    </div>
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Version</p>
                                        <FormInput
                                            type="text"
                                            name="version"
                                            formValues={formValues}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Effective Date</p>
                                        <FormSelect
                                            name="effectiveDate"
                                            formValues={formValues}
                                            options={[]} // Add date picker or dynamic options
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                        />
                                    </div>
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Classification</p>
                                        <FormSelect
                                            name="classification"
                                            formValues={formValues}
                                            options={[]} // Fill with classification options
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                        <div className="flex-col">
                                            <p className="text-secondary-grey">Owner</p>
                                            <UserSelect
                                                name="owner"
                                                value={formValues.owner}
                                                onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                                users={[]} 
                                            />
                                        </div>
                                                                    
                                    <div className="flex-col">
                                        <p className="text-secondary-grey">Approved By</p>
                                        <UserSelect
                                                name="owner"
                                                value={formValues.owner}
                                                onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                                users={[]} 
                                            />
                                    </div>
                                </div>

                                <div className="flex-col">
                                    <p className="text-secondary-grey">Template</p>
                                    <FormSelect
                                        name="template"
                                        formValues={formValues}
                                        options={[]} // Fill with template options from backend
                                        onChange={({ target: { name, value } }) => handleFormChange(name, value)}
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

export default CreateDocumentPopup;
