import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import FormInput from "../../components/FormInput.jsx";

const ProjectContentPage = () => {
  const selectedProject = useSelector(selectSelectedProject);
  const [activeButton, setActiveButton] = useState("Details"); // Default selected button
  const [formValues, setFormValues] = useState({ name: "", key: "", type: "", createdBy: "" });

  // Log to check if selectedProject changes
  useEffect(() => {
    console.log("Selected project updated:", selectedProject);
  }, [selectedProject]);

  // Handle button click and set the active button
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Handle form input changes
  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <>
      {!selectedProject ? (
        <div>
          <h5 className="text-black">No Project Selected</h5>
        </div>
      ) : (
        <div className="p-7 bg-dashboard-bgc h-content-screen overflow-y-auto">
          <div className="p-4 flex gap-4">
            <h5 className="text-black font-bold text-lg">
              Project Configuration &gt;
            </h5>
            <span className="text-black text-lg">{selectedProject.name}</span>
          </div>
          <div className="text-base flex gap-5 mt-6 ml-8">
            {["Details", "People", "Configuration", "Workflows"].map((buttonName) => (
              <button
                key={buttonName}
                onClick={() => handleButtonClick(buttonName)}
                className={`px-4 py-2 rounded-full ${
                  activeButton === buttonName
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {buttonName}
              </button>
            ))}
          </div>

          {/* Show the "Details" form when the Details button is clicked */}
          {activeButton === "Details" && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex-col">
                <p className="text-secondary-grey">Name</p>
                <FormInput
                  type="text"
                  name="name"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value, true)
                  }
                />
              </div>

              <div className="flex-col">
                <p className="text-secondary-grey">Key</p>
                <FormInput
                  type="text"
                  name="key"
                  formValues={formValues}
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value, true)
                  }
                />
              </div>

              <div className="flex gap-10">
                <div className="flex-col w-full">
                  <p className="text-secondary-grey">Type</p>
                  <FormInput
                    type="text"
                    name="type"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value, true)
                    }
                  />
                </div>

                <div className="flex-col w-full">
                  <p className="text-secondary-grey">Created By</p>
                  <FormInput
                    type="text"
                    name="createdBy"
                    formValues={formValues}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value, true)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show the "People" UI when the People button is clicked */}
          {activeButton === "People" && (
  <div className="flex mt-4">
    {/* Left: User List */}
    <div className="rounded-md w-1/2 bg-white pt-3 py-10">
      <table className="w-full table-auto text-center"> {/* Ensure table is full-width and content is centered */}
        <thead>
          <tr className="border-b">
            <th className="p-2 text-center">User</th> {/* Add text-center */}
            <th className="p-2 text-center">Role</th> {/* Add text-center */}
          </tr>
        </thead>
        <tbody>
          {Array(10).fill(null).map((_, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2 flex  items-center justify-center"> {/* Add justify-center */}
                <img
                  src="https://via.placeholder.com/32"
                  alt="User"
                  className="rounded-full w-8 h-8 mr-2"
                />
                <span>Nilanga</span>
              </td>
              <td className="w-1/2  p-2 text-center">User</td> {/* Add text-center */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Right: Role Assignment Form */}
    <div style={{height:'253px', width:'711px'}} className="w-1/2 bg-white p-4 ml-4 rounded-md">
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700">User</label>
          <select className="block w-full mt-1 p-2 border rounded-md">
            <option>Select User</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Role</label>
          <select className="block w-full mt-1 p-2 border rounded-md">
            <option>Select Role</option>
          </select>
        </div>
        <div className="flex gap-1 justify-between mt-6">
          <button
            type="button"
            style={{width:"186px"}}
            className="px-4 py-2 border border-cancel-button rounded-md text-cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-pink w-full text-white rounded-md"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        </div>
      )}
    </>
  );
};

export default ProjectContentPage;
