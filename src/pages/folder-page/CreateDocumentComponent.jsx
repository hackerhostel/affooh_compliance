import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline/index.js";
import FormInput from "../../components/FormInput.jsx";

const CreateDocumentComponent = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleClose = () => {
    onClose && onClose();
    setFormValues({ name: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: hook into API to create document
    setTimeout(() => {
      setIsSubmitting(false);
      handleClose();
    }, 300);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
          <div className="bg-white p-6 shadow-lg w-2/4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-2xl">Add Document</p>
              <div className={"cursor-pointer"} onClick={handleClose}>
                <XMarkIcon className={"w-6 h-6 text-gray-500"} />
              </div>
            </div>
            <form className={"flex flex-col justify-between h-5/6 mt-10"} onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className={"flex-col"}>
                  <p className={"text-secondary-grey"}>link</p>
                  <FormInput
                    type="text"
                    name="link"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6 self-end w-full">
                <button onClick={handleClose} type="button" className="btn-secondary" disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateDocumentComponent;



