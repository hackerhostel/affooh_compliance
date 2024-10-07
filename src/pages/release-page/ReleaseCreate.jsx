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

const ReleaseCreate = ({
  screenDetails = {},
  handleFormChange,
  formErrors,
  isValidationErrorsShown,
  handleFormSubmit,
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
    releaseDate: null,
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
    <div style={popupStyles}>
      <button onClick={handleClosePopup} style={closeButtonStyles}>
        <XMarkIcon className="w-6 h-6" />
      </button>
      <div className="p-2">
        <span className="text-3xl">New Release</span>
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
            style={{ marginTop: "8px" }}
          />
        </div>

        <div className=" mt-5">
          <label>Description</label>
          <textarea
            name="description"
            value={screenDetails.description || ""}
            placeholder="Description"
            onChange={({ target: { name, value } }) =>
              handleFormChange(name, value)
            }
            style={{
              width: "100%",
              height: "152px",
              padding: "10px",
              borderRadius: "10px",
              borderColor: "#ccc",
              borderWidth: "1px",
              borderStyle: "solid",
              resize: "none",
              fontSize: "14px",
              marginTop: "8px",
            }}
          />
          {isValidationErrorsShown && formErrors.description && (
            <span className="text-red-500">{formErrors.description}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label for="release-date" class="block mb-1">
              Release Date
            </label>
            <input
              type="date"
              id="release-date"
              name="releaseDate"
              class="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label for="type" class="block mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              class="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="alpha">Alpha</option>
              <option value="beta">Beta</option>
              <option value="release">Release</option>
            </select>
          </div>

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
            style={{ marginTop: "8px" }}
          />
        </div>

        <div className="flex gap-5 mt-5">
          <input
            type="button"
            value="Cancel"
            className="w-full py-3 rounded-lg text-black font-bold cursor-pointer"
            style={{
              width: "205px",
              borderColor: "rgba(116, 122, 136, 1)",
              borderWidth: "2px",
              borderStyle: "solid",
              color: "rgba(116, 122, 136, 1)",
            }}
            onClick={handleClosePopup}
          />

          <input
            type="submit"
            value="Create"
            className="py-3 rounded-lg bg-primary-pink text-white font-bold cursor-pointer"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

const popupStyles = {
  position: "fixed",
  top: "420px",
  right: "0",
  transform: "translateY(-50%)",
  width: "797px",
  height: "840px",
  padding: "20px",
  backgroundColor: "#fff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
  borderRadius: "8px 0 0 8px",
};

const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

export default ReleaseCreate;
