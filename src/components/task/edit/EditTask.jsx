import FormInput from "../../FormInput.jsx";
import React, {useEffect, useRef, useState} from "react";
import useValidation from "../../../utils/use-validation.jsx";
import {LoginSchema} from "../../../state/domains/authModels.js";
import EditTaskAdditionalDetails from "./EditTaskAdditionalDetails.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";

const EditTaskPage = () => {
  const {code} = useParams();
  const [taskData, setTaskData] = useState({username: '', password: ''});
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(LoginSchema, taskData);

  const [loading, setLoading] = useState(false);
  const [apiError, setAPIError] = useState(false);

  const handleFormChange = (name, value) => {
    const newForm = {...taskData, [name]: value};
    setTaskData(newForm);
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`tasks/by-code/${code}`)
        if (response.data) {
          console.log(response.data)
        }
        setAPIError(false)
      } catch (e) {
        setAPIError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTaskDetails()
  }, [code]);

  if (loading) {
    return <div className="p-5"><SkeletonLoader fillBackground/></div>
  }

  if (apiError) {
    return <div className="p-10"><ErrorAlert message="Cannot get task additional details at the moment"/></div>
  }

  return (
    <div className="flex">
      <div className="w-2/3 p-5">
        <div className="mb-6">
          <FormInput
            type="text"
            name="username"
            formValues={taskData}
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
                formValues={taskData}
                onChange={({target: {name, value}}) => handleFormChange(name, value)}
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
          </div>
        </div>

        <EditTaskAdditionalDetails/>
      </div>
      <div className="w-1/3">w-2/3</div>
    </div>
  )
}

export default EditTaskPage