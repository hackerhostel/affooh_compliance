import React, { useEffect, useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";

import FormTextArea from "../../components/FormTextArea.jsx";
import useValidation from "../../utils/use-validation.jsx";
import { ReleaseEditSchema } from "../../utils/validationSchemas.js";
import { useToasts } from "react-toast-notifications";
import {
  CheckBadgeIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline/index.js";
import { selectSelectedRelease } from "../../state/slice/releaseSlice.js";
import { useSelector } from "react-redux";
import axios from "axios";
import { getInitials, getSelectOptions } from "../../utils/commonUtils.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import moment from "moment/moment.js";
import DateSelector from "../../components/DateSelector.jsx";
import {selectProjectUserList} from "../../state/slice/projectUsersSlice.js";

const ReleaseEdit = ({ releaseId }) => {
  const { addToast } = useToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SelectedRelease = useSelector(selectSelectedRelease);
  const selectedProject = useSelector(selectSelectedProject);
  const projectUsers = useSelector(selectProjectUserList);

  const [releaseTypes, setReleaseTypes] = useState([]);
  const [createdDate, setCreatedDate] = useState("");

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({ name: "", status: "", assignee: "" });
  const [dateSelectorOpen, setDateSelectorOpen] = useState(false);
  const timeLogs = [{ name: "Ahmed", status: "UNRELEASED", assignee: "" }, { name: "Ahmed", status: "UNRELEASED", assignee: "" }]

  const handleAddNewRow = () => {
    setShowNewRow(true);
  };

  const handleCancelNewRow = () => {
    setShowNewRow(false);
    setNewRow({ name: "", status: "", assignee: "" });
  };

  const handleInputChange = (name, value) => {
    setNewRow((prevRow) => ({
      ...prevRow,
      [name]: name === "time" ? Number(value) : value,
    }));
  };

  const handleFormChange = (name, value, isText) => {
    setFormValues({ ...formValues, [name]: isText ? value : Number(value) });
    setIsValidationErrorsShown(false);
  };

  const formatDateToMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);

  const [formValues, setFormValues] = useState({
    id: SelectedRelease?.id,
    name: SelectedRelease?.name,
    description: SelectedRelease?.description,
    releaseDate: formatDateToMMDDYYYY(SelectedRelease?.releaseDate),
    type: SelectedRelease?.type.id,
    status: SelectedRelease?.status,
    version: SelectedRelease?.version,
    projectID: selectedProject?.id,
  });

  useEffect(() => {
    if (SelectedRelease) {
      setFormValues({
        id: SelectedRelease.id,
        name: SelectedRelease.name,
        description: SelectedRelease?.description,
        releaseDate: formatDateToMMDDYYYY(SelectedRelease?.releaseDate),
        type: SelectedRelease.type?.id,
        status: SelectedRelease.status,
        version: SelectedRelease.version,
        projectID: selectedProject?.id,
      });

      setCreatedDate(new Date(SelectedRelease?.createdAt).toDateString());
    }
  }, [SelectedRelease]);

  useEffect(() => {
    getReleaseTypes();
  }, []);

  const getReleaseTypes = async () => {
    await axios
      .get("releases/types")
      .then((r) => {
        setReleaseTypes(r?.data?.releaseType);
      })
      .catch((e) => {
        addToast("Failed To Get Release Types", { appearance: "error" });
      });
  };

  const [formErrors] = useValidation(ReleaseEditSchema, formValues);

  const getCreatedUser = () => {
    const user = projectUsers.find(user => user.id === SelectedRelease?.createdBy);
    return user?.firstName + user?.lastName;
  };

  const editRelease = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    if (formErrors && Object.keys(formErrors).length > 0) {
      setIsValidationErrorsShown(true);
    } else {
      setIsValidationErrorsShown(false);
      try {
        const response = await axios.put(`releases/${SelectedRelease.id}`, {
          release: formValues,
        });
        const status = response?.data?.status;

        if (status) {
          addToast("Release Successfully Updated", { appearance: "success" });
        } else {
          addToast("Failed To Update The Release ", { appearance: "error" });
        }
      } catch (error) {
        addToast("Failed To Update The Release ", { appearance: "error" });
      }
    }
    setIsSubmitting(false);
  };

  const GenerateRow = ({ row }) => {
    const timeLogId = row?.id;
    const user = row?.user;
    const [time, setTime] = useState(row?.time || 0);
    const [description, setDescription] = useState(row?.description || "");
    const [dataChanged, setDataChanged] = useState(false);

    const handleChanges = (name, value) => {
      if (name === "time") {
        const newTime = Number(value);
        setTime(newTime);
        setDataChanged(
          newTime !== row?.time || description !== (row?.description || ""),
        );
      } else {
        const newDescription = value;
        setDescription(newDescription);
        setDataChanged(
          time !== row?.time || newDescription !== (row?.description || ""),
        );
      }
    };

    const deleteTimeLog = async () => {
      try {
        const response = await axios.delete(
          `/tasks/${taskId}/time-logs/${timeLogId}`,
        );
        const deleted = response?.data?.body?.status;

        if (deleted) {
          addToast("Time log successfully deleted", { appearance: "success" });
          refetchTimeLogs();
        } else {
          addToast("Failed to delete the time log", { appearance: "error" });
        }
      } catch (error) {
        addToast("Failed to delete the time log", { appearance: "error" });
      }
    };

    const updateTimeLog = async () => {
      if (time > 0) {
        try {
          await axios.put(`/tasks/${taskId}/time-logs/${timeLogId}`, {
            time: time,
            description: description,
            date: row.date,
          });
          addToast("Time log successfully updated", { appearance: "success" });
          refetchTimeLogs();
        } catch (error) {
          addToast("Failed to update the logged time", { appearance: "error" });
        }
      } else {
        addToast("Time should be greater than 0", { appearance: "warning" });
      }
    };

    return (
      <tr className="border-b">
        <td className="px-4 py-2">
          {moment(row?.date).local().format("YYYY-MM-DD")}
        </td>
        <td className="px-4 py-2 w-36">
          <FormInput
            type="number"
            min="0"
            name="time"
            formValues={{ time: time }}
            onChange={({ target: { name, value } }) =>
              handleChanges(name, value)
            }
          />
        </td>
        <td className="px-4 py-2">
          <FormInput
            type="text"
            name="description"
            formValues={{ description: description }}
            onChange={({ target: { name, value } }) =>
              handleChanges(name, value)
            }
          />
        </td>
        <td className="px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
            {row?.user
              ? getInitials(`${user?.firstName} ${user?.lastName}`)
              : "N/A"}
          </div>
        </td>
        <td className="px-4 py-2">
          <div className={"flex gap-5"}>
            <div onClick={deleteTimeLog} className={"cursor-pointer"}>
              <TrashIcon className={"w-5 h-5 text-pink-700"} />
            </div>
            {dataChanged && (
              <div onClick={updateTimeLog} className={"cursor-pointer"}>
                <CheckBadgeIcon className={"w-5 h-5 text-pink-700"} />
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="text-start">
            <div className="text-lg mb-2 flex items-center">
              <span className="font-semibold">Edit Staging Release</span>

              <ChevronRightIcon className="w-5 h-5 text-gray-500 " />

              <span>{SelectedRelease?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="mr-2">Created Date: {createdDate}</span>
              <span>Created By: {getCreatedUser()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              form="editReleaseForm"
              type="submit"
              disabled={isSubmitting}
              className="px-9 py-2 rounded-lg bg-primary-pink text-white font-bold cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>
        <div>
          <div className="p-5 bg-white rounded-lg">
            <form
              id="editReleaseForm"
              onSubmit={editRelease}
              className="text-start"
            >
              <div className=" mt-5">
                <FormInput
                  type="text"
                  name="name"
                  formValues={formValues}
                  placeholder="Name"
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value, true)
                  }
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm text-text-color">
                  Description
                </label>
                <FormTextArea
                  name="description"
                  showShadow={false}
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value, true)
                  }
                  rows={6}
                />
                {isValidationErrorsShown && formErrors.description && (
                  <span className="text-red-500">{formErrors.description}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <div>
                  <FormInput
                    isDate={true}
                    type="date"
                    name="releaseDate"
                    formValues={formValues}
                    placeholder="Release Date"
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value, true)
                    }
                  />
                </div>
                <div>
                  <FormInput
                    type="text"
                    formValues={formValues}
                    name="status"
                    placeholder="Status"
                    formErrors={formErrors}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value, true)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div>
                  <FormInput
                    type="text"
                    name="version"
                    formValues={formValues}
                    placeholder="Version"
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div>
                  <FormSelect
                    formValues={formValues}
                    name="type"
                    placeholder="Type"
                    options={getSelectOptions(releaseTypes)}
                    formErrors={formErrors}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    showErrors={isValidationErrorsShown}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="py-4">
          <div className="font-semibold text-start text-secondary-grey mb-4">
            Check List Items
          </div>
          <div className="w-full mt-8">
            <div className="flex w-full mb-3 justify-end pr-5">
              <div className="flex gap-1 items-center">
                <PlusCircleIcon
                  onClick={handleAddNewRow}
                  className={`w-6 h-6 ${showNewRow ? "text-gray-300 cursor-not-allowed" : "text-pink-500 cursor-pointer"}`}
                />
                <span className="font-thin text-xs text-gray-600">Add New</span>
              </div>
            </div>
            <div className="w-full p-6 bg-white rounded-lg shadow-lg flex-col">
              {timeLogs.length || showNewRow ? (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Assignee</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showNewRow && (
                      <tr className="border-b">
                        <td className="px-4 py-2">
                          <FormInput
                              type="text"
                              name="name"
                              formValues={{ name: newRow.name }}
                              onChange={({ target: { name, value } }) =>
                                  handleInputChange(name, value)
                              }
                          />
                        </td>
                        <td className="px-4 py-2 w-36">
                          <FormInput
                              type="text"
                              name="status"
                              formValues={{ status: newRow.status }}
                              onChange={({ target: { name, value } }) =>
                                  handleInputChange(name, value)
                              }
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormInput
                            type="text"
                            name="description"
                            formValues={{ description: newRow.description }}
                            onChange={({ target: { name, value } }) =>
                              handleInputChange(name, value)
                            }
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                            Ahmed
                            Shafraz
                          </div>
                        </td>
                        <td className="px-4 py-2 ">
                          <div className={"flex gap-5"}>
                            <XCircleIcon
                              onClick={handleCancelNewRow}
                              className="w-5 h-5 text-gray-500 cursor-pointer"
                            />
                            <CheckBadgeIcon
                              className="w-5 h-5 text-pink-700 cursor-pointer"
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                    {timeLogs &&
                      timeLogs.map((row) => (
                        <GenerateRow row={row} key={row.id} />
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-text-color">No Time Logs Available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReleaseEdit;
