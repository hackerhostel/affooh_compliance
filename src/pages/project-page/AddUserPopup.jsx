import React, { useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";

const AddUserPopup = ({ isOpen, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-96">
          <span className="text-xl font-bold mb-4 block">Add New Member</span>
          <form onSubmit={handleSubmit}>
            {/* First Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                First Name
              </label>
              <FormInput
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>

            {/* Role Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Role
              </label>
              <FormSelect
                name="role"
                value={formValues.role}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              >
                <option value="">Select a Role</option>
                <option value="Company Administrator">Company Administrator</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Employee">Employee</option>
              </FormSelect>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-pink text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;
