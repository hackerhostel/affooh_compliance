import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {
  doSwitchProject,
  selectProjectList,
  selectSelectedProject,
} from "../../state/slice/projectSlice.js";
import FormTextArea from "../../components/FormTextArea.jsx";
import useValidation from "../../utils/use-validation.jsx";
import { ReleaseCreateSchema } from "../../utils/validationSchemas.js";
import { useToasts } from "react-toast-notifications";
import {ChevronRightIcon} from "@heroicons/react/24/outline/index.js";

const ReleaseEdit = ({ releaseId }) => {
  const { addToast } = useToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (name, value, isText) => {
    setFormValues({ ...formValues, [name]: isText ? value : Number(value) });
    setIsValidationErrorsShown(false);
  };

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    releaseDate: "MM/DD/YYYY",
    type: "",
    version: "",
  });
  const [formErrors] = useValidation(ReleaseCreateSchema, formValues);

  const createRelease = async (event) => {
    setIsSubmitting(true);
    if (formErrors && Object.keys(formErrors).length > 0) {
      setIsValidationErrorsShown(true);
    } else {
      setIsValidationErrorsShown(false);
      try {
        const response = await axios.post("/release-create", {
          task: formValues,
        });
        const releaseId = response?.data?.body?.releaseId;

        if (releaseId > 0) {
          addToast("Release Successfully Created", { appearance: "success" });
          handleClose();
        } else {
          addToast("Failed To Create The Release ", { appearance: "error" });
        }
      } catch (error) {
        addToast("Failed To Create The Release ", { appearance: "error" });
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
            <input
              type="submit"
              value="Edit"
              disabled={isSubmitting}
              className="px-9 py-2 rounded-lg bg-primary-pink text-white font-bold cursor-pointer "
            />
          </div>
        </div>
        <div>
          <div className="p-5 bg-white rounded-lg">
            <form onSubmit={createRelease} className="text-start">
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
                    type="date"
                    name="releaseDate"
                    formValues={formValues}
                    placeholder="Release Date"
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                  />
                </div>
                <div>
                  <FormInput
                    type="text"
                    name="Status"
                    formValues={formValues}
                    placeholder="Status"
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value)
                    }
                    formErrors={formErrors}
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
                    options={[{ value: "alpha", label: "Alpha" }]}
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
