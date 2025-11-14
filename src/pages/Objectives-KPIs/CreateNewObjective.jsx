import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from '../../components/FormTextArea.jsx';
import { useToasts } from 'react-toast-notifications';

const CreateNewObjective = ({ isOpen, onClose }) => {
  const { addToast } = useToasts();

  // Initial form values
  const [formValues, setFormValues] = useState({
    name: '',
    version: '',
    downloadSource: '',
    classification: '',
    ownedBy: ''
  });

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    setIsValidationErrorsShown(false);
  };

  const handleClose = () => {
    onClose();
    setFormValues({
      name: '',
      classification: '',
      description: ''
    });
    setIsValidationErrorsShown(false);
  };

  // Dummy select options
  const classificationOptions = [
    { label: "Confidential", value: "confidential" },
    { label: "Internal", value: "internal" },
    { label: "Public", value: "public" },
    { label: "Restricted", value: "restricted" }
  ];

  const type =[
    { label: "IaaS", value: "iaas" },
    { label: "PaaS", value: "paas" },
    { label: "SaaS", value: "saas" },
  ]

  const createNewAsset = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formValues.name || !formValues.version) {
      addToast("Please fill in all required fields.", { appearance: "error" });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    // Simulate success
    addToast("New data asset created successfully!", { appearance: "success" });
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
          <div className="bg-white p-6 shadow-lg w-1/2 max-h-screen overflow-y-auto rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-2xl">Create New Objective Collection</p>
              <div className="cursor-pointer" onClick={handleClose}>
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </div>
            </div>

            {/* Form */}
            <form
              className="flex flex-col justify-between h-5/6 mt-10"
              onSubmit={createNewAsset}
            >
              <div className="space-y-4 text-left">

                <div className="flex-col space-y-6">
                  <div className="flex-col w-full">
                    <p className="text-secondary-grey">Name</p>
                    <FormInput
                      type="text"
                      name="name"
                      formValues={formValues}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      showErrors={isValidationErrorsShown}
                    />
                  </div>

                  <div className="flex-col w-full">
                    <p className="text-secondary-grey">Description</p>
                    <FormTextArea
                      type="text"
                      name="description"
                      formValues={formValues}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      showErrors={isValidationErrorsShown}
                    />
                  </div>

                  <div className="flex-col w-full">
                    <p className="text-secondary-grey">Classification</p>
                    <FormSelect
                      name="type"
                      formValues={formValues}
                      options={classificationOptions}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      showErrors={isValidationErrorsShown}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 mt-6 self-end w-full">
                <button
                  onClick={handleClose}
                  type="button"
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

export default CreateNewObjective;
