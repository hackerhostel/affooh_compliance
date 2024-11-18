import React, { useCallback, useEffect, useState } from "react";
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
import axios from "axios";
import { selectTestCaseStatuses } from "../../state/slice/testCaseFormDataSlice.js";
import { getSelectOptions } from "../../utils/commonUtils.js";
import { doGetReleases } from "../../state/slice/releaseSlice.js";

const ReleaseCreate = ({ isOpen, onClose }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [releaseTypes, setReleaseTypes] = useState([]);
  const releaseStatus = [
    { value: 1, label: "RELEASED" },
    { value: 2, label: "UNRELEASED" },
  ];

  useEffect(() => {
    getReleaseTypes();
  }, []);

  const handleProjectChange = (name, value) => {
    handleFormChange(name, value);
    dispatch(doSwitchProject(value));
  };

  const handleFormChange = (name, value, isText) => {
    setFormValues({ ...formValues, [name]: isText ? value : Number(value) });
    setIsValidationErrorsShown(false);
  };

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    releaseDate: "",
    type: 1,
    version: "",
    projectID: selectedProject.id.toString(),
    status: 1,
  });
  const [formErrors] = useValidation(ReleaseCreateSchema, formValues);

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

  const getStatusLabel = (value) => {
    const status = releaseStatus.find((status) => status.value === value);
    return status?.label || "";
  };

  const createRelease = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (formErrors && Object.keys(formErrors).length > 0) {
      setIsValidationErrorsShown(true);
    } else {
      setIsValidationErrorsShown(false);

      try {
        const payload = {
          ...formValues,
          status: getStatusLabel(formValues.status),
        };
        const response = await axios.post("releases", {
          release: payload,
        });

        const releaseId = response?.data?.body?.releaseId;

        if (releaseId > 0) {
          dispatch(doGetReleases(selectedProject?.id));
          addToast("Release Successfully Created", { appearance: "success" });
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
      {isOpen && (
        <div
          className="fixed top-[420px] right-0 transform -translate-y-1/2
  w-[797px] h-[840px] p-5 bg-white shadow-md 
  z-[1000] rounded-l-lg"
        >
          <button
            onClick={onClose}
            className="
  absolute top-2.5 right-2.5 bg-transparent border-none 
  text-[16px] cursor-pointer
"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="p-2">
            <div className="text-3xl border-b border-gray-300/40 pb-2">
              New Release
            </div>
            <form onSubmit={createRelease}>
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
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <div>
                  <FormInput
                    type="date"
                    name="releaseDate"
                    formValues={formValues}
                    placeholder="Release Date"
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value, true)
                    }
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>

                <div>
                  <FormSelect
                    formValues={formValues}
                    name="status"
                    placeholder="Status"
                    options={releaseStatus}
                    formErrors={formErrors}
                    onChange={({ target: { name, value } }) =>
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
                      handleFormChange(name, value, true)
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

              <div className="flex gap-5 mt-5">
                <input
                  type="button"
                  value="Cancel"
                  className="w-full py-3 rounded-lg  font-bold cursor-pointer w-[205px] border-2 border-[#747A88] text-[#747A88]"
                  onClick={onClose}
                  disabled={isSubmitting}
                />

                <input
                  type="submit"
                  value="Create"
                  disabled={isSubmitting}
                  className="py-3 rounded-lg bg-primary-pink text-white font-bold cursor-pointer w-full"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReleaseCreate;
