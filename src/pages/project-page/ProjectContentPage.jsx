import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import FormInput from "../../components/FormInput.jsx";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const ProjectContentPage = () => {
  const selectedProject = useSelector(selectSelectedProject);
  const [activeButton, setActiveButton] = useState("Details"); 
  const [formValues, setFormValues] = useState({ name: "", key: "", type: "", createdBy: "" });


  
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Handle form input changes
  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [issueFormValues, setIssueFormValues] = useState({
    issueType: "",
    priority: "",
    severity: "",
    status: ""
  });


  const handleIssueFormChange = (name, value) => {
    setIssueFormValues({
      ...issueFormValues,
      [name]: value
    });
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
          <div className="text flex gap-3 mt-6 ml-8">
            {["Details", "People", "Configuration", "Workflows"].map((buttonName) => (
              <button
                key={buttonName}
                onClick={() => handleButtonClick(buttonName)}
                className={`px-4 py-2 rounded-full ${activeButton === buttonName
                  ? "bg-black text-white"
                  : "bg-white text-black"
                  }`}
              >
                {buttonName}
              </button>
            ))}
          </div>

  
          {activeButton === "Details" && (
            <div className="flex p-5 flex-col gap-4 mt-4 bg-white rounded-lg">
              <div className="flex-col">
                <p className="text-secondary-grey">Name</p>
                <FormInput
                  type="text"
                  name="name"
                  style={inputStyle}
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

         
          {activeButton === "People" && (
            <div className="flex mt-4">
              {/* Left: User List */}
              <div className="rounded-md w-1/2 bg-white pt-3 py-10">
                <table className="w-full table-auto text-center"> 
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-center">User</th>
                      <th className="p-2 text-center">Role</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {Array(10).fill(null).map((_, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 flex items-center justify-center"> 
                          <img
                            src="https://via.placeholder.com/32"
                            alt="User"
                            className="rounded-full w-8 h-8 mr-2"
                          />
                          <span>Nilanga</span>
                        </td>
                        <td className="w-1/2 p-2 text-center">User</td> 
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right: Role Assignment Form */}
              <div style={{ height: '253px', width: '711px' }} className="w-1/2 bg-white p-4 ml-4 rounded-md">
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
                      style={{ width: "186px" }}
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

         
          {activeButton === "Configuration" && (
            <div className="mt-6">
              <div className="overflow-x-auto bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-sm text-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">Title</th>
                      <th scope="col" className="px-6 py-3">Priority</th>
                      <th scope="col" className="px-6 py-3">Severity</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Task</td>
                        <td className="px-6 py-4">
                          <span className="px-5 py-2 rounded bg-priority-button-high text-white">High</span>
                        </td>
                        <td className="px-6 py-4">Sprint 1</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">In Progress</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-500 hover:text-gray-700">
                            <EllipsisVerticalIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>

                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Subtask</td>
                        <td className="px-6 py-4">
                          <span className="px-5 py-2 rounded bg-priority-button-medium text-black">Low</span>
                        </td>
                        <td className="px-6 py-4">Sprint 2</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">To-do</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-500 hover:text-gray-700">
                            <EllipsisVerticalIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>

                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Epic</td>
                        <td className="px-6 py-4">
                          <span className="px-5 py-2 rounded bg-priority-button-low text-black">Medium</span>
                        </td>
                        <td className="px-6 py-4">Sprint 3</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">In Progress</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-500 hover:text-gray-700">
                            <EllipsisVerticalIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>

                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Bugs</td>
                        <td className="px-6 py-4">
                          <span className="px-5 py-2 rounded bg-priority-button-high text-white">High</span>
                        </td>
                        <td className="px-6 py-4">Sprint 4</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">To-do</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-500 hover:text-gray-700">
                            <EllipsisVerticalIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>
                    </tbody>

                </table>
              </div>

              {/* Form */}
              <div className="bg-white mt-6 p-6 rounded-md shadow-sm">
                <form className="flex gap-2">
                  <FormInput
                    type="text"
                    name="issueType"
                    placeholder="Enter Issue type"
                    formValues={issueFormValues}
                    style={{ width: "450px" }}
                    onChange={({ target: { name, value } }) => handleIssueFormChange(name, value)}
                  />
                  <FormInput
                    type="text"
                    name="priority"
                    placeholder="Priority"
                    formValues={issueFormValues}
                    onChange={({ target: { name, value } }) => handleIssueFormChange(name, value)}
                  />
                  <FormInput
                    type="text"
                    name="severity"
                    placeholder="Severity"
                    formValues={issueFormValues}
                    onChange={({ target: { name, value } }) => handleIssueFormChange(name, value)}
                  />
                  <FormInput
                    type="text"
                    name="status"
                    placeholder="Status"
                    formValues={issueFormValues}
                    onChange={({ target: { name, value } }) => handleIssueFormChange(name, value)}
                  />
                </form>

                <div className="flex justify-end">
                  <button style={{ width: '418px' }} type="submit" className="mt-2 px-6 py-2 bg-primary-pink text-white rounded-lg">
                    Add
                  </button>
                </div>


              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default ProjectContentPage;

const inputStyle = {
  border: '1px solid rgba(230, 230, 230, 1)'
};

