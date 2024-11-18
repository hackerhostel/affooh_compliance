import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";
import {
  doSwitchProject,
  selectProjectList,
  selectSelectedProject,
} from "../../state/slice/projectSlice.js";
import useValidation from "../../utils/use-validation.jsx";
import { ReleaseCreateSchema } from "../../utils/validationSchemas.js";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const ReleaseCreate = ({ isOpen, onClose }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    releaseDate: "MM/DD/YYYY",
    type: "",
    version: "",
  });
  const [formErrors] = useValidation(ReleaseCreateSchema, formValues);

  const handleProjectChange = (name, value) => {
    handleFormChange(name, value);
    dispatch(doSwitchProject(value));
  };

  const handleFormChange = (name, value, isText) => {
    setFormValues({ ...formValues, [name]: isText ? value : Number(value) });
    setIsValidationErrorsShown(false);
  };

  const handleClose = () => {
    onClose();
    setFormValues({ name: "", releaseDate: "MM/DD/YYYY", type: "", version: "" });
    setIsValidationErrorsShown(false);
  };

  const createRelease = async (event) => {
    event.preventDefault();
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
          addToast("Failed To Create The Release", { appearance: "error" });
        }
      } catch (error) {
        addToast("Failed To Create The Release", { appearance: "error" });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
          <div className="bg-white p-6 shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-2xl">New Release</p>
              <div className="cursor-pointer" onClick={handleClose}>
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <form className="flex flex-col justify-between h-5/6 mt-10" onSubmit={createRelease}>
              <div className="space-y-4">
                <div className="flex-col">
                  <p className="text-secondary-grey">Name</p>
                  <FormInput
                    type="text"
                    name="name"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div className="flex-col">
                  <p className="text-secondary-grey">Description</p>
                  <FormTextArea
                    name="description"
                    rows={4}
                    formValues={formValues}
                    onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div className="flex-col">
                  <p className="text-secondary-grey">Release Date</p>
                  <FormInput
                    type="date"
                    name="releaseDate"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div className="flex-col">
                  <p className="text-secondary-grey">Type</p>
                  <FormSelect
                    name="type"
                    options={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]}
                    formValues={formValues}
                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div className="flex-col">
                  <p className="text-secondary-grey">Version</p>
                  <FormInput
                    type="text"
                    name="version"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6 self-end w-full">
                <button
                  onClick={handleClose}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReleaseCreate;
