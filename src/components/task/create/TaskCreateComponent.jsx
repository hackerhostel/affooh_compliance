import React, { useRef, useState, useEffect } from "react";
import FormInput from "../../FormInput.jsx";
import useValidation from "../../../utils/use-validation.jsx";
import { HeaderTaskCreateSchema } from "../../../state/domains/authModels.js";
import FormSelect from "../../FormSelect.jsx";
import TaskScreenDetails from "./TaskScreenDetails.jsx";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAppConfig } from "../../../state/slice/appSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";
import { useToasts } from "react-toast-notifications";
import { XMarkIcon } from "@heroicons/react/24/outline/index.js";
import { getSelectOptions } from "../../../utils/commonUtils.js";
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";
import { selectSprintListForProject } from "../../../state/slice/sprintSlice.js";
import WYSIWYGInput from "../../WYSIWYGInput.jsx";
import UserSelect from "../../UserSelect.jsx";
import useFetchEpics from "../../../hooks/custom-hooks/task/useFetchEpics.jsx";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import ProgressBar from "@uppy/progress-bar";

// Uppy styles
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/progress-bar/dist/style.css";

function getRequiredAdditionalFieldList(fieldsArray) {
  const requiredFields = [];

  fieldsArray.forEach((field) => {
    if (Array.isArray(field.fields)) {
      field.fields.forEach((subField) => {
        if (subField.required === 1) {
          requiredFields.push(subField.id);
        }
      });
    }
  });

  return requiredFields;
}

const TaskCreateComponent = ({ onClose, isOpen }) => {
  const { addToast } = useToasts();
  const appConfig = useSelector(selectAppConfig);
  const selectedProject = useSelector(selectSelectedProject);
  const users = useSelector(selectProjectUserList);
  const sprintListForProject = useSelector(selectSprintListForProject);
  const { data: epics } = useFetchEpics(selectedProject?.id);

  const [loading, setLoading] = useState(false);
  const [createTaskForm, setCreateTaskForm] = useState({
    name: "",
    taskTypeID: "",
    sprintID: "",
  });
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(HeaderTaskCreateSchema, createTaskForm);
  const [isTaskTypeLoading, setIsTaskTypeLoading] = useState(false);
  const [isTaskTypeApiError, setIsTaskTypeApiError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEpicScreen, setIsEpicScreen] = useState(false);
  const [screenDetails, setScreenDetails] = useState(null);
  const [additionalFormValues, setAdditionalFormValues] = useState({});
  const [requiredAdditionalFieldList, setRequiredAdditionalFieldList] =
    useState([]);
  const [attachments, setAttachments] = useState([]); // Files ready for upload
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [createdTaskId, setCreatedTaskId] = useState(null);
  const uppy = useRef(null);

  // Initialize Uppy
  useEffect(() => {
    if (!isOpen) return;

    const dashboardElement = document.getElementById("uppy-dashboard");
    if (!dashboardElement) {
      console.error("Dashboard target element #uppy-dashboard not found");
      return;
    }

    uppy.current = new Uppy({
      restrictions: {
        maxFileSize: 250 * 1024 * 1024, 
        allowedFileTypes: [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "video/mp4",
        ],
      },
      autoProceed: false,
    })
      .use(Dashboard, {
        target: dashboardElement,
        inline: true,
        height: 300,
        showProgressDetails: true,
        hideUploadButton: true,
        proudlyDisplayPoweredByUppy: false,
        doneButtonHandler: null,
      })
      .use(ProgressBar, {
        target: "#uppy-progress-bar",
        hideAfterFinish: false,
      });

    // Handle file preview when file is added
    uppy.current.on("file-added", (file) => {
      const filePreview = {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        data: file.data,
        meta: file.meta,
        uploaded: false,
      };
      setAttachments((prev) => [...prev, filePreview]);
    });

    // Handle file removal
    uppy.current.on("file-removed", (file) => {
      setAttachments((prev) => prev.filter((f) => f.id !== file.id));
    });

    return () => {
      if (uppy.current && typeof uppy.current.reset === "function") {
        uppy.current.reset();
        uppy.current = null;
      }
    };
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    if (name === "taskTypeID") {
      const selectedTaskType = appConfig.taskTypes.find(
        (tt) => tt.id === parseInt(value)
      );
      if (selectedTaskType?.screenID) {
        fetchScreenForTask(selectedTaskType.screenID);
        setIsEpicScreen(selectedTaskType.value === "Epic");
      }
    }
    const newForm = { ...createTaskForm, [name]: value };
    setCreateTaskForm(newForm);
  };

  const handleAdditionalFieldChange = (fieldData) => {
    setAdditionalFormValues((prevValues) => ({
      ...prevValues,
      [fieldData.taskFieldID]: fieldData,
    }));
  };

  const handleTaskCreateClose = () => {
    setCreateTaskForm({ name: "", taskTypeID: "", sprintID: "" });
    setAttachments([]);
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setCreatedTaskId(null);
    setIsUploadingFiles(false);
    uppy.current?.cancelAll();
    onClose();
  };

  const fetchScreenForTask = async (screenId) => {
    setIsTaskTypeLoading(true);
    try {
      const response = await axios.get(
        `screens/${screenId}?projectID=${selectedProject.id}`
      );
      if (response.data.screen) {
        const screenData = response.data.screen;
        setScreenDetails(screenData);
        setRequiredAdditionalFieldList(
          getRequiredAdditionalFieldList(screenData.tabs)
        );
      }
      setIsTaskTypeApiError(false);
    } catch (e) {
      setIsTaskTypeApiError(true);
    } finally {
      setIsTaskTypeLoading(false);
      setAdditionalFormValues({});
    }
  };

  // Function to upload single file to backend
  const uploadFileToBackend = async (file, taskID) => {
    try {
      const uniqueKey = `${Date.now()}-${file.name}`;

      const attachmentData = {
        taskID: taskID,
        key: uniqueKey,
        name: file.name,
        size: file.size,
        format: file.type,
      };

      const response = await axios.post(
        `/tasks/${taskID}/attachments`,
        attachmentData
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        error: error,
      };
    }
  };

  // Function to handle file uploads with progress
  const handleFileUploads = async (taskID) => {
    if (attachments.length === 0)
      return { success: true, uploaded: 0, failed: 0 };

    setIsUploadingFiles(true);
    let successfulUploads = 0;
    let failedUploads = 0;

    for (let i = 0; i < attachments.length; i++) {
      const file = attachments[i];
      setCurrentFileIndex(i + 1);

      // Update progress based on file index
      const baseProgress = (i / attachments.length) * 100;
      const fileProgress = baseProgress + 25 / attachments.length; // Each file gets 25% progress chunk
      setUploadProgress(Math.round(fileProgress));

      // Update Uppy progress for visual feedback
      uppy.current?.setFileState(file.id, {
        progress: {
          uploadStarted: Date.now(),
          uploadComplete: false,
          percentage: 0,
        },
      });

      try {
        const result = await uploadFileToBackend(file, taskID);

        if (result.success) {
          successfulUploads++;
          // Mark file as uploaded in Uppy
          uppy.current?.setFileState(file.id, {
            progress: {
              uploadStarted: Date.now(),
              uploadComplete: true,
              percentage: 100,
            },
          });

          // Update attachments state
          setAttachments((prev) =>
            prev.map((att) =>
              att.id === file.id ? { ...att, uploaded: true } : att
            )
          );
        } else {
          failedUploads++;
          uppy.current?.setFileState(file.id, {
            error: "Upload failed",
          });
        }
      } catch (error) {
        failedUploads++;
        uppy.current?.setFileState(file.id, {
          error: "Upload failed",
        });
      }

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setUploadProgress(100);
    setIsUploadingFiles(false);

    return {
      success: true,
      uploaded: successfulUploads,
      failed: failedUploads,
    };
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    let additionalFieldFormErrors = false;

    requiredAdditionalFieldList.forEach((r) => {
      if (!additionalFormValues[r]) {
        additionalFieldFormErrors = true;
      }
    });

    if (formErrors || additionalFieldFormErrors) {
      setIsValidationErrorsShown(true);
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setIsValidationErrorsShown(false);

    try {
      const payload = {
        ...createTaskForm,
        projectID: selectedProject?.id,
        attributes: Object.entries(additionalFormValues).map(
          ([key, value]) => value
        ),
      };

      if (createTaskForm?.taskOwner) {
        const ownerValues = screenDetails?.tabs[0]?.fields.find(
          (at) => at?.fieldType?.name === "USER_PICKER"
        );
        let taskOwnerFound = false;

        if (ownerValues?.fieldType?.id) {
          payload.attributes = payload.attributes.map((attribute) => {
            if (attribute.fieldTypeName === "USER_PICKER") {
              taskOwnerFound = true;
              return {
                fieldTypeName: "USER_PICKER",
                fieldValue: [payload?.taskOwner],
                taskFieldID: ownerValues?.id,
              };
            }
            return attribute;
          });

          if (!taskOwnerFound) {
            payload.attributes.push({
              fieldTypeName: "USER_PICKER",
              fieldValue: [payload?.taskOwner],
              taskFieldID: ownerValues?.id,
            });
          }
        }

        delete payload?.taskOwner;
      }

      // Step 1: Create task first
      const response = await axios.post("tasks", {
        task: payload,
      });

      const taskID = response.data.id;
      setCreatedTaskId(taskID);

      // Step 2: Upload files if any
      if (attachments.length > 0) {
        const uploadResult = await handleFileUploads(taskID);

        // Show final success message
        let successMessage = `Task ID: ${taskID} created successfully`;
        if (uploadResult.uploaded > 0) {
          successMessage += ` with ${uploadResult.uploaded} attachment${uploadResult.uploaded > 1 ? "s" : ""}`;
        }

        if (uploadResult.failed > 0) {
          successMessage += ` (${uploadResult.failed} failed to upload)`;
        }

        addToast(successMessage, {
          appearance: uploadResult.failed > 0 ? "warning" : "success",
          autoDismiss: true,
        });
      } else {
        // No files to upload
        addToast(`Task ID: ${taskID} created successfully`, {
          appearance: "success",
          autoDismiss: true,
        });
      }

      // Small delay to show completion
      setTimeout(() => {
        handleTaskCreateClose();
      }, 1500);
    } catch (error) {
      console.error("Error creating task:", error);
      addToast(error.message || "Error creating task", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
      setUploadProgress(0);
      setIsUploadingFiles(false);
    }
  };

  const getTaskAdditionalDetailsComponent = () => {
    if (isTaskTypeLoading) {
      return (
        <div className="my-5">
          <SkeletonLoader />
        </div>
      );
    }

    if (isTaskTypeApiError) {
      return (
        <div className="my-5">
          <ErrorAlert message="Cannot get task additional details at the moment" />
        </div>
      );
    }

    if (!screenDetails) {
      return <></>;
    }

    return (
      <TaskScreenDetails
        taskFormData={additionalFormValues}
        handleFormChange={handleAdditionalFieldChange}
        isValidationErrorsShown={isValidationErrorsShown}
        screenDetails={screenDetails}
      />
    );
  };

  const handleFileOpen = async (file) => {
    if (file.data) {
      const url = URL.createObjectURL(file.data);
      window.open(url, "_blank");
    }
  };

  const removeFile = (fileId) => {
    if (isUploadingFiles) return; // Prevent removal during upload

    setAttachments((prev) => prev.filter((f) => f.id !== fileId));
    uppy.current?.removeFile(fileId);
    addToast("File removed", {
      appearance: "info",
      autoDismiss: true,
    });
  };

  const renderFilePreviews = () => {
    if (attachments.length === 0) return null;

    return (
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Files to upload:</p>
        {attachments.map((file, index) => {
          const isImage = file.type.startsWith("image/");
          const isCurrentlyUploading =
            isUploadingFiles && index === currentFileIndex - 1;
          const isUploaded = file.uploaded;
          const isPending = isUploadingFiles && index > currentFileIndex - 1;

          return (
            <div
              key={file.id}
              className={`flex items-center space-x-2 my-2 p-2 rounded transition-colors ${
                isUploaded
                  ? "bg-green-50 border border-green-200"
                  : isCurrentlyUploading
                    ? "bg-blue-50 border border-blue-200"
                    : isPending
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-gray-50"
              }`}
            >
              {isImage ? (
                <img
                  src={URL.createObjectURL(file.data)}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded cursor-pointer"
                  onClick={() => handleFileOpen(file)}
                />
              ) : (
                <div
                  className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded cursor-pointer"
                  onClick={() => handleFileOpen(file)}
                >
                  <span className="text-xs text-gray-500">
                    {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {isCurrentlyUploading && (
                  <p className="text-xs text-blue-600 font-medium">
                    Uploading...
                  </p>
                )}
                {isUploaded && (
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Uploaded
                  </p>
                )}
                {isPending && (
                  <p className="text-xs text-gray-500">Waiting...</p>
                )}
              </div>
              {!isUploadingFiles && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1"
                  onClick={() => removeFile(file.id)}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {isUploadingFiles && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-700">
                {createdTaskId
                  ? `Task ${createdTaskId} created! Uploading files... (${currentFileIndex}/${attachments.length})`
                  : "Creating task..."}
              </span>
              <span className="text-sm text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-10">
          <div className="bg-white pl-10 pt-6 pr-6 pb-10 shadow-lg w-3/6 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-semibold">Create New Task</p>
              <div className={"cursor-pointer"} onClick={handleTaskCreateClose}>
                <XMarkIcon className={"w-6 h-6 text-gray-500"} />
              </div>
            </div>
            <form
              className="space-y-4 mt-10"
              ref={formRef}
              onSubmit={handleCreateTask}
            >
              <div className="mb-6">
                <FormSelect
                  showLabel
                  placeholder="Sprint"
                  name="sprintID"
                  formValues={createTaskForm}
                  options={getSelectOptions(sprintListForProject)}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>
              <div className="mb-6">
                <FormSelect
                  showLabel
                  placeholder="Task Type"
                  name="taskTypeID"
                  formValues={createTaskForm}
                  options={appConfig.taskTypes.map((tt) => ({
                    label: tt.value,
                    value: tt.id,
                  }))}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
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
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Description
                </label>
                <div className="border border-gray-300 rounded-md p-2">
                  <div className="flex space-x-2 mb-2">
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-6">
                    <WYSIWYGInput
                      initialValue={{ description: "" }}
                      value={createTaskForm.description}
                      name={"description"}
                      onchange={handleFormChange}
                    />
                  </div>
                </div>
              </div>
              {!isEpicScreen && (
                <div className="mb-6">
                  <FormSelect
                    showLabel
                    placeholder="Epic"
                    name="epicID"
                    formValues={createTaskForm}
                    options={getSelectOptions(epics)}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                  />
                </div>
              )}
              <div className="flex space-x-4 mb-6">
                <div className="w-2/4">
                  <UserSelect
                    label="Assignee"
                    name="assigneeID"
                    value={createTaskForm.assigneeID}
                    users={users}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                  />
                </div>
                <div className="w-2/4">
                  <UserSelect
                    label="Task Owner"
                    name="taskOwner"
                    value={createTaskForm.taskOwner}
                    users={users}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                  />
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div id="uppy-dashboard" className="mb-4"></div>
                <div id="uppy-progress-bar"></div>
                <p className="mt-1 text-sm text-gray-500 text-center">
                  Drag & drop files or click to browse <br />
                  (Max 250MB, Images, Docs, Videos)
                </p>
                {renderFilePreviews()}
              </div>
              {getTaskAdditionalDetailsComponent()}
              <div className="flex space-x-4 mt-10 self-end w-full">
                <button
                  onClick={handleTaskCreateClose}
                  className="btn-secondary"
                  disabled={loading || isUploadingFiles}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || loading || isUploadingFiles}
                >
                  {loading
                    ? isUploadingFiles
                      ? "Uploading Files..."
                      : "Creating Task..."
                    : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCreateComponent;
