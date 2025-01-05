import React, { useCallback, useEffect, useState } from "react";
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
import {
  doGetReleases,
  doGetReleasesCheckListItems,
  selectCheckListItems,
  selectSelectedRelease,
} from "../../state/slice/releaseSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getInitials, getSelectOptions } from "../../utils/commonUtils.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import moment from "moment/moment.js";
import DateSelector from "../../components/DateSelector.jsx";
import { selectProjectUserList } from "../../state/slice/projectUsersSlice.js";
import errorAlert from "../../components/ErrorAlert.jsx";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";

const ReleaseEdit = ({ releaseId }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SelectedRelease = useSelector(selectSelectedRelease);
  const selectedProject = useSelector(selectSelectedProject);
  const projectUsers = useSelector(selectProjectUserList);
  const checkListItems = useSelector(selectCheckListItems);

  const [releaseTypes, setReleaseTypes] = useState([]);
  const [createdDate, setCreatedDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState({});

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    name: "",
    status: "TODO",
    assignee: 1,
  });
  const [dateSelectorOpen, setDateSelectorOpen] = useState(false);
  // const [releaseCheckListItems, setReleaseCheckListItems] = useState([]);
  const checkListStatuses = [
    { value: "TODO", label: "TODO" },
    { value: "IN-PROGRESS", label: "IN-PROGRESS" },
    { value: "DONE", label: "DONE" },
  ];
  const releaseStatus = [
    { value: "RELEASED", label: "RELEASED" },
    { value: "UNRELEASED", label: "UNRELEASED" },
  ];

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
      [name]: value,
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
    dispatch(doGetReleasesCheckListItems());
  }, []);

  let releaseCheckListItems = checkListItems.filter(
    (item) => item.releaseID === SelectedRelease?.id,
  );

  const getProjectUsers = useCallback(() => {
    return projectUsers.map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    }));
  }, [projectUsers]);

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
    const user = projectUsers.find(
      (user) => user.id === SelectedRelease?.createdBy,
    );
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

  const addChecklist = async () => {
    if (newRow.name !== "") {
      await axios
        .post(`releases/${SelectedRelease.id}/checkListItem`, {
          checkListItem: {
            ...newRow,
            checkListID: SelectedRelease.checklistID,
          },
        })
        .then((r) => {
          if (r) {
            setShowNewRow(false);
            addToast("Check List Item Created Successfully", {
              appearance: "success",
            });
            dispatch(doGetReleasesCheckListItems());
          } else {
            addToast("Failed To Create Check List Item", {
              appearance: "error",
            });
          }
        })
        .catch((e) => {
          addToast("Failed To Create Check List Item", { appearance: "error" });
        });
    } else {
      addToast("Please Enter a name", { appearance: "warning" });
    }
  };

  const updateCheckLitItem = async (row) => {
    await axios
      .put(`releases/${SelectedRelease.id}/checkListItem`, {
        checkListItem: row,
      })
      .then((r) => {
        if (r) {
          addToast("Check List Item Updated Successfully", {
            appearance: "success",
          });
          dispatch(doGetReleasesCheckListItems());
        } else {
          addToast("Failed To Update Check List Item", { appearance: "error" });
        }
      })
      .catch((e) => {
        addToast("Failed To Update Check List Item", { appearance: "error" });
      });
  };

  const handleDeleteClick = (item) => {
    setToDeleteItem(item);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (toDeleteItem) {
      try {
        const response = await axios.delete(
          `releases/${SelectedRelease.id}/checkListItem/${toDeleteItem.checklistItemID}`,
        );
        const deleted = response?.data?.body?.checkListItem;

        if (deleted) {
          addToast("Check list item successfully deleted", {
            appearance: "success",
          });
          dispatch(doGetReleasesCheckListItems());
        } else {
          addToast("Failed to delete Check list item", { appearance: "error" });
        }
      } catch (error) {
        addToast("Failed to delete Check list item", { appearance: "error" });
      }
    }
    setIsDialogOpen(false);
  };

  const GenerateRow = ({ row, onUpdate, onDelete }) => {
    const [name, setName] = useState(row?.name || "");
    const [status, setStatus] = useState(row?.status || "TODO");
    const [assignee, setAssignee] = useState(row?.assignee || "");
    const [hasChange, setHasChange] = useState(false);

    const handleChanges = (name, value) => {
      switch (name) {
        case "name":
          setName(value);
          break;
        case "status":
          setStatus(value);
          break;
        case "assignee":
          setAssignee(value);
          break;
        default:
          return "";
      }

      setHasChange(true);
    };

    const updateCheckListItemRow = () => {
      setHasChange(false);
      onUpdate({
        name,
        status,
        assignee,
        checklistItemID: row?.checklistItemID,
      });
    };

    const deleteChecklistItem = async () => {
      onDelete(row);
    };

    return (
      <tr className="border-b">
        <td className="px-4 py-2">
          <FormInput
            type="text"
            name="name"
            formValues={{ name: name }}
            onChange={({ target: { name, value } }) =>
              handleChanges(name, value)
            }
          />
        </td>
        <td className="px-4 py-2 w-36">
          <FormSelect
            name="status"
            formValues={{ status: status }}
            options={checkListStatuses}
            onChange={({ target: { name, value } }) =>
              handleChanges(name, value)
            }
          />
        </td>
        <td className="px-4 py-2">
          <FormSelect
            name="assignee"
            formValues={{ assignee: assignee }}
            options={getProjectUsers()}
            onChange={({ target: { name, value } }) =>
              handleChanges(name, value)
            }
          />
        </td>
        <td className="px-4 py-2">
          <div className={"flex gap-5"}>
            <div onClick={deleteChecklistItem} className={"cursor-pointer"}>
              <TrashIcon className={"w-5 h-5 text-pink-700"} />
            </div>
            {hasChange && (
              <div
                onClick={updateCheckListItemRow}
                className={"cursor-pointer"}
              >
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
            <div className="text-lg mt-5 flex items-center">
              <span className="font-semibold">Edit Staging Release</span>

              <ChevronRightIcon className="w-5 h-5 text-gray-500 " />

              <span className="text-gray-500">{SelectedRelease?.name}</span>
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

        <div className="flex space-x-5">
          <div className="p-5 mt-8 w-72 bg-white rounded-lg">
            <form
              id="editReleaseForm"
              onSubmit={editRelease}
              className="text-start"
            >
              <div className=" mt-4 ">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
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
                <div className="flex-col">
                  <FormSelect
                    name="status"
                    placeholder="Status"
                    formValues={formValues}
                    options={releaseStatus}
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

          <div className="py-7">
          <div className="font-semibold text-start  text-xl text-secondary-grey ">
            Check List Items
          </div>
          <div className="w-full ">
            <div className="flex w-full justify-end pr-5">
              <div className="flex gap-1 items-center">
                <PlusCircleIcon
                  onClick={handleAddNewRow}
                  className={`w-6 h-6 ${showNewRow ? "text-gray-300 cursor-not-allowed" : "text-pink-500 cursor-pointer"}`}
                />
                <span className="font-thin text-xs text-gray-600">Add New</span>
              </div>
            </div>
            <div style={{width:"800px"}} className=" p-6 bg-white rounded-lg flex-col">
              {releaseCheckListItems.length || showNewRow ? (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="text-text-color">
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
                            formValues={newRow}
                            onChange={({ target: { name, value } }) =>
                              handleInputChange(name, value)
                            }
                          />
                        </td>
                        <td className="px-4 py-2 ">
                          <FormSelect
                            name="status"
                            formValues={newRow}
                            options={checkListStatuses}
                            onChange={({ target: { name, value } }) =>
                              handleInputChange(name, value)
                            }
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormSelect
                            name="assignee"
                            formValues={newRow}
                            options={getProjectUsers()}
                            onChange={({ target: { name, value } }) =>
                              handleInputChange(name, value)
                            }
                          />
                        </td>
                        <td className="px-4 py-2 ">
                          <div className={"flex gap-5"}>
                            <XCircleIcon
                              onClick={handleCancelNewRow}
                              className="w-5 h-5 text-gray-500 cursor-pointer"
                            />
                            <CheckBadgeIcon
                              onClick={addChecklist}
                              className="w-5 h-5 text-pink-700 cursor-pointer"
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                    {releaseCheckListItems &&
                      releaseCheckListItems.map((row, index) => (
                        <GenerateRow
                          row={row}
                          key={index}
                          onUpdate={updateCheckLitItem}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-text-color">No Check List Items Available</p>
              )}
            </div>
          </div>
        </div>
        </div>
        
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        message={toDeleteItem ? `To delete item - ${toDeleteItem.name} ?` : ""}
      />
    </>
  );
};

export default ReleaseEdit;
