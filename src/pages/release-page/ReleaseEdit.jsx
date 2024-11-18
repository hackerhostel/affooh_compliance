import React, { useEffect, useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";

import FormTextArea from "../../components/FormTextArea.jsx";
import useValidation from "../../utils/use-validation.jsx";
import { ReleaseEditSchema } from "../../utils/validationSchemas.js";
import { useToasts } from "react-toast-notifications";
import {ChevronRightIcon} from "@heroicons/react/24/outline/index.js";
import { selectSelectedRelease } from "../../state/slice/releaseSlice.js";
import { useSelector } from "react-redux";
import axios from "axios";
import {getSelectOptions} from "../../utils/commonUtils.js";

const ReleaseEdit = ({ releaseId }) => {
  const { addToast } = useToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SelectedRelease = useSelector(selectSelectedRelease);

  const [releaseTypes, setReleaseTypes] = useState([]);
  const releaseStatus = [
    {value: 1, label: "RELEASED"},
    {value: 2, label: "UNRELEASED"}
  ];

  const handleFormChange = (name, value, isText) => {
    setFormValues({ ...formValues, [name]: isText ? value : Number(value) });
    setIsValidationErrorsShown(false);
  };

  const formatDateToMMDDYYYY = (dateString)=> {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
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
      });
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
        const status = response?.data?.body?.status;

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

  return (
    <>
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="text-start">
            <div className="text-lg mb-2 flex items-center">
              <span className="font-semibold">Edit Staging Release</span>

              <ChevronRightIcon className="w-5 h-5 text-gray-500 " />

              <span>Project A</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="mr-2">Created Date: 12th July 2024</span>
              <span>Created By: Scott Wagon</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button form="editReleaseForm"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-9 py-2 rounded-lg bg-primary-pink text-white font-bold cursor-pointer">
              Edit
            </button>
          </div>
        </div>
        <div>
          <div className="p-5 bg-white rounded-lg">
            <form id="editReleaseForm" onSubmit={editRelease} className="text-start">
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
                  <FormSelect
                      formValues={formValues}
                      name="status"
                      placeholder="Status"
                      options={releaseStatus}
                      formErrors={formErrors}
                      onChange={({target: {name, value}}) =>
                          handleFormChange(name, value)
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
                      onChange={({target: {name, value}}) =>
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
          <div>
            <div class="overflow-x-auto bg-white rounded-lg">
              <table class="w-full table-auto border-collapse text-start">
                <thead class="border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-2 text-left">Name</th>
                    <th class="px-4 py-2 text-left">Status</th>
                    <th class="px-4 py-2 text-left">Assignee</th>
                    <th class="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="px-4 py-2 flex items-center">
                      <input type="checkbox" class="mr-2" />
                      Sample check list item 001
                    </td>
                    <td class="px-4 py-2 text-gray-600">In Progress</td>
                    <td class="px-4 py-2 flex items-center">
                      <img
                        class="w-8 h-8 rounded-full mr-2"
                        src="https://via.placeholder.com/150"
                        alt="Assignee Image"
                      />
                      Nilanga
                    </td>
                    <td class="px-4 py-2 ">
                      <button class="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <tr class="">
                    <td class="px-4 py-2 flex items-center">
                      <input type="checkbox" class="mr-2" />
                      Sample check list item 001
                    </td>
                    <td class="px-4 py-2 text-gray-600">In Progress</td>
                    <td class="px-4 py-2 flex items-center">
                      <img
                        class="w-8 h-8 rounded-full mr-2"
                        src="https://via.placeholder.com/150"
                        alt="Assignee Image"
                      />
                      Nilanga
                    </td>
                    <td class="px-4 py-2 ">
                      <button class="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReleaseEdit;
