import React, {useRef, useState} from 'react';

import FormInput from "../../FormInput.jsx";
import useValidation from "../../../utils/use-validation.jsx";
import {TaskCreateSchema} from "../../../state/domains/authModels.js";
import FormSelect from "../../FormSelect.jsx";
import TaskScreenDetails from "./TaskScreenDetails.jsx";
import axios from "axios";
import {useSelector} from "react-redux";
import {selectAppConfig} from "../../../state/slice/appSlice.js";
import {selectSelectedProject} from "../../../state/slice/projectSlice.js";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";
import {useToasts} from "react-toast-notifications";
import Modal from "../../../components/Modal.jsx";

function getRequiredAdditionalFieldList(fieldsArray) {
  const requiredFields = [];

  fieldsArray.forEach(field => {
    if (Array.isArray(field.fields)) {
      field.fields.forEach(subField => {
        if (subField.required === 1) {
          requiredFields.push(subField.id)
        }
      });
    }
  });

  return requiredFields;
}

const TaskForm = ({sprintId, onClose, isOpen}) => {
  const appConfig = useSelector(selectAppConfig);
  const selectedProject = useSelector(selectSelectedProject);
  const {addToast} = useToasts();

  const [loading, setLoading] = useState(false);
  const [createTaskForm, setCreateTaskForm] = useState({name: '', taskTypeID: ''});
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(TaskCreateSchema, createTaskForm);

  const [isTaskTypeLoading, setIsTaskTypeLoading] = useState(false);
  const [isTaskTypeApiError, setIsTaskTypeApiError] = useState(false);

  const [screenDetails, setScreenDetails] = useState(null);
  const [additionalFormValues, setAdditionalFormValues] = useState({});
  const [requiredAdditionalFieldList, setRequiredAdditionalFieldList] = useState([]);

  const handleFormChange = (name, value) => {
    if (name === 'taskTypeID') {
      const selectedTaskType = appConfig.taskTypes.find(tt => tt.id === parseInt(value))
      if (selectedTaskType?.screenID) {
        fetchScreenForTask(selectedTaskType.screenID)
      }
    }

    const newForm = {...createTaskForm, [name]: value};
    setCreateTaskForm(newForm);
  };

  const handleAdditionalFieldChange = (fieldData) => {
    setAdditionalFormValues(prevValues => ({
      ...prevValues, [fieldData.taskFieldID]: fieldData
    }));
  };

  const fetchScreenForTask = async (screenId) => {
    setIsTaskTypeLoading(true)
    try {
      const response = await axios.get(`screens/${screenId}?projectID=${selectedProject.id}`)
      if (response.data.screen) {
        const screenData = response.data.screen

        setScreenDetails(screenData)
        setRequiredAdditionalFieldList(getRequiredAdditionalFieldList(screenData.tabs))
      }
      setIsTaskTypeApiError(false)
    } catch (e) {
      setIsTaskTypeApiError(true)
    } finally {
      setIsTaskTypeLoading(false)
      setAdditionalFormValues({})
    }
  }

  const handleCreateTask = async (event) => {
    event.preventDefault();
    let additionalFieldFormErrors = false;

    requiredAdditionalFieldList.map(r => {
      if (!additionalFormValues[r]) {
        additionalFieldFormErrors = true
      }
    })

    if (formErrors || additionalFieldFormErrors) {
      setIsValidationErrorsShown(true);
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setIsValidationErrorsShown(false);

    const payload = {
      ...createTaskForm,
      projectID: selectedProject?.id,
      sprintID: sprintId,
      attributes: Object.entries(additionalFormValues).map(([key, value]) => (value)),
    }

    try {
      const response = await axios.post("tasks", {task: payload})

      addToast(`new task ID: ${response.data.id} added`, {appearance: 'success', autoDismiss: true});
      onClose();
    } catch (e) {
      addToast(e.message, {appearance: 'error'});
    } finally {
      setLoading(false);
    }
  }

  const getTaskAdditionalDetailsComponent = () => {
    if (isTaskTypeLoading) {
      return <div className="my-5"><SkeletonLoader/></div>
    }

    if (isTaskTypeApiError) {
      return <div className="my-5"><ErrorAlert message="Cannot get task additional details at the moment"/></div>
    }

    if (!screenDetails) {
      return <></>
    }

    return <TaskScreenDetails
        taskFormData={additionalFormValues}
        handleFormChange={handleAdditionalFieldChange}
        isValidationErrorsShown={isValidationErrorsShown}
        screenDetails={screenDetails}
    />
  }

  return (<Modal
      title={'Create New Task'}
      isOpen={isOpen}
      onClose={onClose}
      type='side'
  >
    <div className="w-[39rem] mx-auto p-2 bg-white shadow-sm rounded-lg h-full">
      <form className="space-y-4" ref={formRef} onSubmit={handleCreateTask}>
        <div className="mb-6">
          <FormSelect
              showLabel
              placeholder="Task Type"
              name="taskTypeID"
              formValues={createTaskForm}
              options={appConfig.taskTypes.map(tt => {
                return {
                  label: tt.value, value: tt.id
                }
              })}
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
          />
        </div>

        <div className="mb-6">
          <FormInput
              type="text"
              name="name"
              formValues={createTaskForm}
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor"
                     className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              {/* TODO: Add more formatting buttons here */}
            </div>
            <div className="mb-6">
              <FormInput
                  type="text"
                  name="description"
                  formValues={createTaskForm}
                  onChange={({target: {name, value}}) => handleFormChange(name, value)}
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <FormSelect
              showLabel
              placeholder="Epic"
              name="epic"
              formValues={createTaskForm}
              options={['In Progress', 'Completed', 'On Hold']}
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <div
                className="flex items-center space-x-2 rounded-full py-1 border-2 px-3 text-sm/6 font-semibold text-white hover:bg-gray-50">
              {/*TODO: need a way to get profile avatar*/}
              {/*{userDetails.avatar ? (*/}
              {/*  <img*/}
              {/*    src={userDetails.avatar}*/}
              {/*    alt={`${userDetails.firstName} ${userDetails.lastName}`}*/}
              {/*    className="w-7 h-7 rounded-full object-cover"*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <div*/}
              {/*    className="w-7 h-7 rounded-full bg-primary-pink flex items-center justify-center text-white text-xl font-semibold">*/}
              {/*    {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}*/}
              {/*  </div>*/}
              {/*)}*/}
              <span className="text-sm text-gray-600">Alex s.</span>
              <button type="button" className="text-gray-400 hover:text-gray-600">×</button>
            </div>
          </div>
          <div className="mb-6">
            <FormInput
                type="text"
                name="taskOwner"
                formValues={createTaskForm}
                placeholder="Task Owner"
                onChange={({target: {name, value}}) => handleFormChange(name, value)}
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
               className="w-6 h-6 mx-auto text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <p className="mt-1 text-sm text-gray-500">Drop attachment or <span
              className="text-pink-500">browse files</span></p>
        </div>

        {getTaskAdditionalDetailsComponent()}

        <div className="flex items-end justify-end space-x-4 mt-6">
          <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              onClick={onClose}
          >
            Cancel
          </button>
          <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-pink hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  </Modal>);
};

export default TaskForm;