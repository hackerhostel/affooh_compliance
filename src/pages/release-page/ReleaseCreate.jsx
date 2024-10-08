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

const ReleaseCreate = ({
  screenDetails = {},
  handleClosePopup,
  handleDeleteStoryPoint,
}) => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);
  const [statusTags, setStatusTags] = useState([]);

  const handleProjectChange = (name, value) => {
    handleFormChange(name, value);
    dispatch(doSwitchProject(value));
  };

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [formValues, setFormValues] = useState({name: '', releaseDate: 'MM/DD/YYYY', type: '', version: ''});
  const [formErrors] = useValidation(ReleaseCreateSchema, formValues);

  const getProjectOptions = useCallback(() => {
    return projectList.map((project) => ({
      value: project.id,
      label: project.name,
    }));
  }, [projectList]);

  const handleAddTag = () => {
    setStatusTags([...statusTags, { id: Date.now(), name: "Status" }]);
  };

  const handleRemoveTag = (id) => {
    setStatusTags(statusTags.filter((tag) => tag.id !== id));
  };

  const [formData, setFormData] = useState({
    releaseDate: "MM/DD/YYYY",
    type: "",
    version: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, releaseDate: date });
  };

  return (
    <div
      className="fixed top-[420px] right-0 transform -translate-y-1/2 
  w-[797px] h-[840px] p-5 bg-white shadow-md 
  z-[1000] rounded-l-lg"
    >
      <button
        onClick={handleClosePopup}
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
        <div className=" mt-5">
          <FormInput
            type="text"
            name="name"
            formValues={screenDetails}
            placeholder="Name"
            onChange={({ target: { name, value } }) =>
              handleFormChange(name, value)
            }
            formErrors={formErrors}
            showErrors={isValidationErrorsShown}
          />
        </div>

        <div className="mt-5">
          <label className="block text-sm text-text-color">Description</label>
          <FormTextArea
            name="description"
            showShadow={false}
            formValues={"Description"}
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
              formValues={formData.releaseDate}
              placeholder="Release Date"
              onChange={({ target: { name, value } }) =>
                handleFormChange(name, value)
              }
            />
          </div>

          <div>
            <FormSelect
              formValues=""
              name="type"
              placeholder="Type"
              options={[{ value: "alpha", label: "Alpha" }]}
            />
          </div>
          <div>
            <FormInput
              type="text"
              name="version"
              formValues={screenDetails}
              placeholder="Version"
              onChange={({ target: { name, value } }) =>
                handleFormChange(name, value)
              }
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
        </div>

        <div className="flex gap-5 mt-5">
          <input
            type="button"
            value="Cancel"
            className="w-full py-3 rounded-lg  font-bold cursor-pointer w-[205px] border-2 border-[#747A88] text-[#747A88]"
            onClick={handleClosePopup}
          />

          <input
            type="submit"
            value="Create"
            className="py-3 rounded-lg bg-primary-pink text-white font-bold cursor-pointer w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ReleaseCreate;
