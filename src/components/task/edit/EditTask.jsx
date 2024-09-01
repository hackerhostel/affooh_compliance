import FormInput from "../../FormInput.jsx";
import React, {useRef, useState} from "react";
import useValidation from "../../../utils/use-validation.jsx";
import {LoginSchema} from "../../../state/domains/authModels.js";
import EditTaskAdditionalDetails from "./EditTaskAdditionalDetails.jsx";

const EditTaskPage = () => {
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(LoginSchema, loginDetails);

  const handleFormChange = (name, value) => {
    const newForm = { ...loginDetails, [name]: value };
    setLoginDetails(newForm);
  };

  return (
    <div className="flex">
      <div className="w-2/3 p-5">
        <div className="mb-6">
          <FormInput
            type="text"
            name="username"
            formValues={loginDetails}
            placeholder="Task Title"
            onChange={({target: {name, value}}) => handleFormChange(name, value)}
            formErrors={formErrors}
            showErrors={isValidationErrorsShown}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="border border-gray-300 rounded-md p-2">
            <div className="flex space-x-2 mb-2">
              <button type="button" className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              {/* Add more formatting buttons here */}
            </div>
            <div className="mb-6">
              <FormInput
                type="text"
                name="username"
                formValues={loginDetails}
                onChange={({target: {name, value}}) => handleFormChange(name, value)}
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
          </div>
        </div>

        <EditTaskAdditionalDetails />
      </div>
      <div className="w-1/3">w-2/3</div>
    </div>
  )
}

export default EditTaskPage