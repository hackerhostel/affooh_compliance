import React, { useState, useEffect } from "react";
import FormSelect from "../../components/FormSelect.jsx";
import { doGetProjectUsers, selectProjectUserList } from "../../state/slice/projectUsersSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {selectOrganizationUsers} from "../../state/slice/appSlice.js";

const AddUserPopup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const userListForProject = useSelector(selectProjectUserList);
  const organizationUsers = useSelector(selectOrganizationUsers);
  const usersNotInProject = organizationUsers.filter(orgUser =>
      !userListForProject.some(projectUser => projectUser.id === orgUser.id)
  );
  const [formValues, setFormValues] = useState({ projectUserIDs: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      dispatch(doGetProjectUsers(selectedProject.id));
    }
  }, [selectedProject, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserAdd = async () => {
    if (!formValues.projectUserIDs) {
      alert("Please select a user to add.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        projectUserIDs: [
          ...(usersNotInProject.map((user) => user.id) || []),
          parseInt(formValues.projectUserIDs, 10),
        ],
      };

      const response = await axios.put(`/projects/${selectedProject.id}`, payload);
      if (response?.data?.body) {
        alert("User successfully added.");
        dispatch(doGetProjectUsers(selectedProject?.id));
        onClose();
      } else {
        alert("Failed to add user.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-96 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <span className="text-xl font-semibold">Add New Member</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserAdd();
          }}
        >
          <div className="mb-4">
            <label className="block text-secondary-grey mt-10 text-sm font-medium mb-2">
              Select User
            </label>
            <FormSelect
              name="projectUserIDs"
              value={formValues.projectUserIDs}
              options={usersNotInProject.map((user) => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName}`.trim(),
              }))}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>

          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-32"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary w-32"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;
