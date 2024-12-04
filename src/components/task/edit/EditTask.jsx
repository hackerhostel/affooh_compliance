import FormInput from "../../FormInput.jsx";
import React, {useEffect, useState} from "react";
import useValidation from "../../../utils/use-validation.jsx";
import {LoginSchema} from "../../../state/domains/authModels.js";
import {useParams} from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";
import {getSelectOptions, getUserSelectOptions} from "../../../utils/commonUtils.js";
import FormSelect from "../../FormSelect.jsx";
import {useSelector} from "react-redux";
import {selectProjectUserList} from "../../../state/slice/projectUsersSlice.js";
import FormInputWrapper from "./FormEditInputWrapper.jsx";
import EditTaskScreenDetails from "./EditTaskScreenDetails.jsx";
import {useToasts} from "react-toast-notifications";
import TimeTracking from "./TimeTracking.jsx";
import useFetchTimeLogs from "../../../hooks/custom-hooks/task/useFetchTimeLogs.jsx";
import CommentAndTimeTabs from "./CommentAndTimeTabs.jsx";
import TaskRelationTabs from "./TaskRelationTabs.jsx";
import useFetchTask from "../../../hooks/custom-hooks/task/useFetchTask.jsx";
import useFetchFlatTasks from "../../../hooks/custom-hooks/task/useFetchFlatTasks.jsx";

const EditTaskPage = () => {
  const {code} = useParams();
  const {addToast} = useToasts();
  const projectUserList = useSelector(selectProjectUserList);

  const [initialTaskData, setInitialTaskData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [taskAttributes, setTaskAttributes] = useState([]);
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [epics, setEpics] = useState([]);
  const [formErrors] = useValidation(LoginSchema, taskData);

  const {
    loading: loading,
    error: apiError,
    data: taskDetails,
    refetch: refetchTask
  } = useFetchTask(code)
  const {data: timeLogs, refetch: refetchTimeLogs} = useFetchTimeLogs(initialTaskData?.id)
  const {data: tasksList} = useFetchFlatTasks(initialTaskData?.project?.id)

  const handleFormChange = (name, value) => {
    const newForm = {...taskData, [name]: value};
    setTaskData(newForm);
  };

  const handleAdditionalFieldChange = (fieldId, value) => {
    const filteredTaskAttribute = taskAttributes.find(ta => ta?.taskFieldID === fieldId);
    if (filteredTaskAttribute) {
      filteredTaskAttribute.values[0] = value;
      setTaskAttributes(prevValues =>
          prevValues.map(ta =>
              ta.taskFieldID === fieldId ? filteredTaskAttribute : ta
          )
      );
    }
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

  const updateStates = (task) => {
    setTaskData({...task, assignee: task?.assignee?.id})
    setTaskAttributes(JSON.parse(JSON.stringify(task?.attributes)));
    setInitialTaskData(task)
  }

  useEffect(() => {
    if (taskDetails?.id) {
      updateStates(taskDetails)
    }
  }, [taskDetails]);

  useEffect(() => {
    if (tasksList?.length) {
      setEpics(tasksList.filter(tl => tl.type === "Epic"))
    }
  }, [tasksList]);

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

      addToast(`Task successfully updated!`, {appearance: 'success', autoDismiss: true});
      const updatedTaskDetails = updatedTask?.data?.body?.task
      if (updatedTaskDetails) {
        updateStates(updatedTaskDetails)
      }
    } catch (e) {
      setTaskData(initialTaskData)
      addToast(e.message, {appearance: 'error'});
    } finally {
      setIsEditing(false);
    }
  }

  const updateTaskAttribute = async (fieldId, value) => {
    const filteredAttribute = taskAttributes.find(ta => ta?.taskFieldID === fieldId)
    if (filteredAttribute) {
      setIsEditing(true)

      const payload = {
        "taskID": initialTaskData.id,
        "type": "TASK_ATTRIBUTE",
        "attributeDetails": {
          attributeKey: filteredAttribute.id,
          taskFieldID: filteredAttribute.taskFieldID,
          attributeValue: value
        }
      }

      try {
        const updatedTask = await axios.put(`/tasks/${initialTaskData.id}`, payload)
        const updatedTaskDetails = updatedTask?.data?.body?.task
        if (updatedTaskDetails) {
          updateStates(updatedTaskDetails)
          addToast(`Task attribute updated!`, {appearance: 'success', autoDismiss: true});
        }
      } catch (e) {
        addToast(e.message, {appearance: 'error'});
      } finally {
        setIsEditing(false);
      }
    }
  }

  const filterTaskFieldValue = (fieldName) => {
    return taskAttributes.find(ta => ta?.taskFieldName === fieldName)?.values[0] || ''
  }

  const filterTaskFieldId = (fieldName) => {
    return taskAttributes.find(ta => ta?.taskFieldName === fieldName)?.taskFieldID || ''
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

        <TaskRelationTabs taskId={initialTaskData?.id || ''} subTasks={taskData?.subTasks}
                          sprintId={taskData?.sprint?.id} refetchTask={refetchTask}/>
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
            <FormSelect
                name="owner"
                disabled={isEditing}
                placeholder="Task Owner"
                formValues={{owner: filterTaskFieldValue("Task Owner")}}
                options={projectUserList && projectUserList.length ? getUserSelectOptions(projectUserList) : []}
                onChange={({target: {value}}) => {
                  handleAdditionalFieldChange(filterTaskFieldId("Task Owner"), value)
                  updateTaskAttribute(filterTaskFieldId("Task Owner"), value);
                }}
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
            />
          </div>
          <div className="mb-6">
            <FormSelect
                placeholder="Epic"
                name="epicID"
                formValues={{epicID: taskData?.epicID}}
                options={getSelectOptions(epics)}
                onChange={({target: {name, value}}) => {
                  handleFormChange(name, value);
                  updateTaskDetails("epicID", value)
                }}
                disabled={isEditing}
            />
          </div>
          <EditTaskScreenDetails
            isEditing={isEditing}
            initialTaskData={initialTaskData}
            handleFormChange={handleAdditionalFieldChange}
            isValidationErrorsShown={isValidationErrorsShown}
            screenDetails={taskData.screen}
            updateTaskAttribute={updateTaskAttribute}
            users={projectUserList}
            taskAttributes={taskAttributes}
          />
        <TimeTracking timeLogs={timeLogs}
                      estimationAttribute={taskAttributes.find(ta => ta?.taskFieldName === "Estimation") || {}}
                      initialEstimationAttribute={initialTaskData?.attributes?.find(ta => ta?.taskFieldName === "Estimation") || {}}
                      handleAdditionalFieldChange={handleAdditionalFieldChange}
                      updateTaskAttribute={updateTaskAttribute} isEditing={isEditing}
        />
      </div>
    </div>
  )
}

export default EditTaskPage