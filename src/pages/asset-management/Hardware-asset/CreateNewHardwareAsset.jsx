import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../../../components/FormInput.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { useToasts } from 'react-toast-notifications';

const CreateNewHardwareAsset = ({ isOpen, onClose }) => {
  const { addToast } = useToasts();

  // Initial form values
  const [formValues, setFormValues] = useState({
    category: '',
    name: '',
    code: '',
    type: '',
    assetOwner: '',
    serialKey: '',
    classification: ''
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
      category: '',
      name: '',
      code: '',
      type: '',
      assetOwner: '',
      serialKey: '',
      classification: ''
    });
    setIsValidationErrorsShown(false);
  };

  // Dummy select options
  const categoryOptions = [
    { label: "Computers", value: "computers" },
    { label: "Office Equipment", value: "office_equipment" },
    { label: "Networking", value: "networking" },
  ];

  const typeOptions = [
    { label: "Laptop", value: "laptop" },
    { label: "Desktop", value: "desktop" },
    { label: "Printer", value: "printer" },
  ];

  const assetOwnerOptions = [
    { label: "Alice Johnson", value: "alice" },
    { label: "David Brown", value: "david" },
    { label: "Evelyn White", value: "evelyn" },
  ];

  const classificationOptions = [
    { label: "Hardware", value: "hardware" },
    { label: "Peripheral", value: "peripheral" },
    { label: "Other", value: "other" },
  ];

  const createNewAsset = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Example validation
    if (!formValues.name || !formValues.code) {
      addToast("Please fill in all required fields.", { appearance: "error" });
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    // Simulate success
    addToast("New hardware asset created successfully!", { appearance: "success" });
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
          <div className="bg-white p-6 shadow-lg w-1/2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-2xl">New Hardware Asset</p>
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

                {/* Category */}
                <div className="flex-col">
                  <p className="text-secondary-grey">Category</p>
                  <FormSelect
                    name="category"
                    formValues={formValues}
                    options={categoryOptions}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>

                {/* Name + Code */}
                <div className="flex space-x-4">
                  <div className="flex-col w-1/2">
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

                  <div className="flex-col w-1/2">
                    <p className="text-secondary-grey">Code</p>
                    <FormInput
                      type="text"
                      name="code"
                      formValues={formValues}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      showErrors={isValidationErrorsShown}
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="flex-col">
                  <p className="text-secondary-grey">Type</p>
                  <FormSelect
                    name="type"
                    formValues={formValues}
                    options={typeOptions}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>

                {/* Asset Owner */}
                <div className="flex-col">
                  <p className="text-secondary-grey">Asset Owner</p>
                  <FormSelect
                    name="assetOwner"
                    formValues={formValues}
                    options={assetOwnerOptions}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>

                {/* Serial Key */}
                <div className="flex-col">
                  <p className="text-secondary-grey">Serial Key</p>
                  <FormInput
                    type="text"
                    name="serialKey"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>

                {/* Classification */}
                <div className="flex-col">
                  <p className="text-secondary-grey">Classification</p>
                  <FormSelect
                    name="classification"
                    formValues={formValues}
                    options={classificationOptions}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>
              </div>

              {/* Buttons */}
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

export default CreateNewHardwareAsset;
