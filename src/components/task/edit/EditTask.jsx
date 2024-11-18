import FormInput from "../../FormInput.jsx";
import React, {useEffect, useState} from "react";
import useValidation from "../../../utils/use-validation.jsx";
import {LoginSchema} from "../../../state/domains/authModels.js";
import EditTaskAdditionalDetails from "./EditTaskAdditionalDetails.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";
import {getUserSelectOptions} from "../../../utils/commonUtils.js";
import FormSelect from "../../FormSelect.jsx";
import {useSelector} from "react-redux";
import {selectProjectUserList} from "../../../state/slice/projectUsersSlice.js";
import FormInputWrapper from "./FormEditInputWrapper.jsx";
import EditTaskScreenDetails from "./EditTaskScreenDetails.jsx";
import {useToasts} from "react-toast-notifications";
import TimeTracking from "./TimeTracking.jsx";
import useFetchTimeLogs from "../../../hooks/custom-hooks/task/useFetchTimeLogs.jsx";
import TimeLogging from "./TimeLogging.jsx";
import CommentAndTimeTabs from "./CommentAndTimeTabs.jsx";

const EditTaskPage = () => {
  const {code} = useParams();
  const {addToast} = useToasts();
  const projectUserList = useSelector(selectProjectUserList);

  const [initialTaskData, setInitialTaskData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setAPIError] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [additionalFormValues, setAdditionalFormValues] = useState({});
  const [initialAdditionalFormValues, setInitialAdditionalFormValues] = useState({});
  const [formErrors] = useValidation(LoginSchema, taskData);

  const {data: timeLogs, refetch: refetchTimeLogs} = useFetchTimeLogs(initialTaskData?.id)

  const handleFormChange = (name, value) => {
    const newForm = {...taskData, [name]: value};
    setTaskData(newForm);
  };

  const handleAdditionalFieldChange = (fieldData) => {
    setAdditionalFormValues(prevValues => ({
      ...prevValues,
      [fieldData.taskFieldID]: fieldData
    }));
  };

  function attributesToMap(attributes) {
    if (!attributes && attributes === null) {
      return {};
    }

    return attributes.reduce((map, fieldData) => {
      map[fieldData.taskFieldID] = {
        fieldTypeName: fieldData.fieldTypeName,
        fieldValue: fieldData.values,
        taskFieldID: fieldData.id
      };
      return map;
    }, {});
  }

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`tasks/by-code/${code}`)
        if (response.data.body.task) {
          const taskDetails = response.data.body.task
          setTaskData(taskDetails)
          setInitialTaskData(taskDetails)

          setAdditionalFormValues(attributesToMap(taskDetails.attributes))
          setInitialAdditionalFormValues(attributesToMap(taskDetails.attributes))
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

  const updateTaskDetails = async (attributeKey, attributeValue) => {
    setIsEditing(true)
    const payload = {
      "taskID": initialTaskData.id,
      "type": "TASK",
      "attributeDetails": {
        attributeKey,
        attributeValue
      }
    }

    try {
      const updatedTask = await axios.put(`/tasks/${initialTaskData.id}`, payload)

      addToast(`task ${attributeKey} updated!`, {appearance: 'success', autoDismiss: true});
      if (updatedTask.data.body.task) {
        setTaskData(updatedTask.data.body.task)
        setInitialTaskData(updatedTask.data.body.task)
      }
    } catch (e) {
      setTaskData(initialTaskData)
      addToast(e.message, {appearance: 'error'});
    } finally {
      setIsEditing(false);
    }
  }

  const updateTaskAttribute = async (attributeKey, taskFieldID, attributeValue) => {
    setIsEditing(true)
    const payload = {
      "taskID": initialTaskData.id,
      "type": "TASK_ATTRIBUTE",
      "attributeDetails": {
        attributeKey,
        taskFieldID,
        attributeValue
      }
    }

    try {
      const updatedTask = await axios.put(`/tasks/${initialTaskData.id}`, payload)

      addToast(`task ${attributeKey} updated!`, {appearance: 'success', autoDismiss: true});
      if (updatedTask.data.body.task) {
        const updatedTaskDetails = updatedTask.data.body.task
        setTaskData(updatedTaskDetails)
        setInitialTaskData(updatedTaskDetails)

        setAdditionalFormValues(attributesToMap(updatedTaskDetails.attributes))
        setInitialAdditionalFormValues(attributesToMap(updatedTaskDetails.attributes))
      }
    } catch (e) {
      setAdditionalFormValues(initialAdditionalFormValues)
      addToast(e.message, {appearance: 'error'});
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <div className="flex">
      <div className="w-3/5 p-5 bg-dashboard-bgc">
        <div className="mb-6">
          <FormInputWrapper
            isEditing={isEditing}
            initialData={initialTaskData}
            currentData={taskData}
            onAccept={() => {
              updateTaskDetails("Name", taskData.name);
            }}
            onReject={() => {
              handleFormChange('name', initialTaskData.name);
            }}
          >
            <FormInput
              type="text"
              name="name"
              formValues={taskData}
              placeholder="Task Title"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </FormInputWrapper>
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
              <FormInputWrapper
                isEditing={isEditing}
                initialData={initialTaskData}
                currentData={taskData}
                onAccept={() => {
                  updateTaskDetails("Description", taskData.description);
                }}
                onReject={() => {
                  handleFormChange('description', initialTaskData.description);
                }}
              >
                <FormInput
                  type="text"
                  name="description"
                  formValues={taskData}
                  onChange={({target: {name, value}}) => handleFormChange(name, value)}
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </FormInputWrapper>
            </div>
          </div>
        </div>

        <EditTaskAdditionalDetails/>
        <CommentAndTimeTabs timeLogs={timeLogs} taskId={initialTaskData?.id || ''} refetchTimeLogs={refetchTimeLogs}/>
      </div>
      <div className="w-2/5 py-5 bg-dashboard-bgc">
          <div className="mb-6">
            <FormSelect
              name="assignee"
              disabled={isEditing}
              placeholder="Assignee"
              formValues={taskData}
              options={projectUserList && projectUserList.length ? getUserSelectOptions(projectUserList) : []}
              onChange={({target: {name, value}}) => {
                handleFormChange(name, value);
                updateTaskDetails("assigneeID", value)
              }}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <div className="mb-6">
            <FormInput
              type="text"
              name="name"
              formValues={taskData}
              placeholder="Task Owner"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <div className="mb-6">
            <FormInput
              type="text"
              name="name"
              formValues={taskData}
              placeholder="Epic Name"
              onChange={({target: {name, value}}) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>

          <EditTaskScreenDetails
            isEditing={isEditing}
            initialTaskData={initialAdditionalFormValues}
            taskFormData={additionalFormValues}
            handleFormChange={handleAdditionalFieldChange}
            isValidationErrorsShown={isValidationErrorsShown}
            screenDetails={taskData.screen}
            updateTaskAttribute={updateTaskAttribute}
          />

        <TimeTracking timeLogs={timeLogs}/>
      </div>
    </div>
  )
}

export default EditTaskPage