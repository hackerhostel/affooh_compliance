import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import {
    selectIsProjectDetailsLoading,
    selectSelectedProject,
    setProjectType
} from "../../state/slice/projectSlice.js";
import FormInput from "../../components/FormInput.jsx";
import {EllipsisVerticalIcon} from '@heroicons/react/24/outline';
import FormSelect from "../../components/FormSelect.jsx";
import {getSelectOptions} from "../../utils/commonUtils.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {doGetProjectUsers, selectProjectUserList} from "../../state/slice/projectUsersSlice.js";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import useValidation from "../../utils/use-validation.jsx";
import {ProjectUpdateSchema} from "../../utils/validationSchemas.js";
import {selectOrganizationUsers} from "../../state/slice/appSlice.js";
import {doGetWhoAmI} from "../../state/slice/authSlice.js";

const ProjectContentPage = () => {
    const dispatch = useDispatch();
    const {addToast} = useToasts();
    const formRef = useRef(null);
    const selectedProject = useSelector(selectSelectedProject);
    const isProjectDetailsLoading = useSelector(selectIsProjectDetailsLoading);
    const userListForProject = useSelector(selectProjectUserList);
    const projectTypes = useSelector(setProjectType);
    const organizationUsers = useSelector(selectOrganizationUsers);
    const [activeButton, setActiveButton] = useState("Details");
    const [formValues, setFormValues] = useState({name: "", prefix: "", projectType: "", projectUserIDs: ""});
    const [formErrors] = useValidation(ProjectUpdateSchema, formValues);
    const projectUsersIdList = userListForProject.map(user => user.id);

    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormValues({...selectedProject, projectUserIDs: projectUsersIdList});
    }, [selectedProject]);

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    // Handle form input changes
    const handleFormChange = (name, value) => {
        setFormValues({...formValues, [name]: value});
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

    const handleUserAdd = async () => {
        if (formValues.projectUserIDs === "") {
            addToast('Please select a user to add', {appearance: "error"});
            return;
        }

        setIsSubmitting(true);

        if (formErrors && Object.keys(formErrors).length > 0) {
            setIsValidationErrorsShown(true);
        } else {
            setIsValidationErrorsShown(false);
            try {
                const payLoad = {
                    ...formValues,
                    projectUserIDs: [...projectUsersIdList, parseInt(formValues.projectUserIDs)]
                }
                const response = await axios.put(`/projects/${selectedProject.id}`, payLoad)
                const updated = response?.data?.body

                if (updated) {
                    addToast('User Added Successfully Updated', {appearance: 'success'});
                    dispatch(doGetProjectUsers(selectedProject?.id));
                } else {
                    addToast('Failed To Add User', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed To Add User', {appearance: 'error'});
            }
        }
        setIsSubmitting(false)
    };

    const userList = (users) => {
        const nonProjectUsers = organizationUsers.filter(orgUser =>
            !userListForProject.some(projUser => projUser.id === orgUser.id)
        );

        return nonProjectUsers.map(users => ({value: users.id, label: `${users.firstName} ${users.lastName}`}));
    };

    const updateProject = async (event) => {
        setIsSubmitting(true)
        event.preventDefault();

        if (formErrors && Object.keys(formErrors).length > 0) {
            setIsValidationErrorsShown(true);
        } else {
            setIsValidationErrorsShown(false);
            try {
                const response = await axios.put(`/projects/${selectedProject.id}`, formValues)
                const updated = response?.data?.body

                if (updated) {
                    dispatch(doGetWhoAmI());
                    addToast('Project Successfully Updated', {appearance: 'success'});
                } else {
                    addToast('Failed To Updated The Project', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed To Updated The Project', {appearance: 'error'});
            }
        }
        setIsSubmitting(false)
    }

    if (isProjectDetailsLoading) return <div className="p-2"><SkeletonLoader/></div>;

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
                        <form onSubmit={updateProject} ref={formRef}
                              className="flex p-5 flex-col gap-4 mt-4 bg-white rounded-lg">
                            <div className="flex-col">
                                <p className="text-secondary-grey">Name</p>
                                <FormInput
                                    type="text"
                                    name="name"
                                    style={inputStyle}
                                    formValues={formValues}
                                    value={formValues.name}
                                    onChange={({target: {name, value}}) =>
                                        handleFormChange(name, value, true)
                                    }
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>

                            <div className="flex-col">
                                <p className="text-secondary-grey">Key</p>
                                <FormInput
                                    type="text"
                                    name="prefix"
                                    value={formValues.prefix}
                                    formValues={formValues}
                                    onChange={({target: {name, value}}) =>
                                        handleFormChange(name, value, true)
                                    }
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>

                            <div className="flex gap-10">
                                <div className="flex-col w-full">
                                    <p className="text-secondary-grey">Type</p>
                                    <FormSelect
                                        name="projectType"
                                        formValues={formValues}
                                        value={formValues.projectType}
                                        options={getSelectOptions(projectTypes)}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                        formErrors={formErrors}
                                        showErrors={isValidationErrorsShown}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-10 justify-end">
                                <div className="flex-col">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="px-4 py-2 bg-primary-pink w-full text-white rounded-md"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
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
                                    {userListForProject.map((user, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2 flex items-center justify-center">
                                                <img
                                                    src="https://via.placeholder.com/32"
                                                    alt="User"
                                                    className="rounded-full w-8 h-8 mr-2"
                                                />
                                                <span>{`${user.firstName} ${user.lastName}`}</span>
                                            </td>
                                            <td className="w-1/2 p-2 text-center">User</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Right: Role Assignment Form */}
                            <div style={{height: '253px', width: '711px'}}
                                 className="w-1/2 bg-white p-4 ml-4 rounded-md">
                                <div className="flex-col">
                                    <p className="text-secondary-grey">User</p>
                                    <FormSelect
                                        name="projectUserIDs"
                                        formValues={formValues}
                                        value={formValues.projectUserIDs}
                                        options={userList(organizationUsers)}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                    />
                                </div>
                                <div className="flex gap-1 justify-between mt-6">
                                    <button
                                        style={{width: "186px"}}
                                        className="px-4 py-2 border border-cancel-button rounded-md text-cancel-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUserAdd}
                                        className="px-4 py-2 bg-primary-pink w-full text-white rounded-md"
                                    >
                                        Add
                                    </button>
                                </div>
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
                                            <span
                                                className="px-5 py-2 rounded bg-priority-button-high text-white">High</span>
                                        </td>
                                        <td className="px-6 py-4">Sprint 1</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">In Progress</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                <EllipsisVerticalIcon className="h-6 w-6"/>
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">Subtask</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-5 py-2 rounded bg-priority-button-medium text-black">Low</span>
                                        </td>
                                        <td className="px-6 py-4">Sprint 2</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">To-do</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                <EllipsisVerticalIcon className="h-6 w-6"/>
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">Epic</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-5 py-2 rounded bg-priority-button-low text-black">Medium</span>
                                        </td>
                                        <td className="px-6 py-4">Sprint 3</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">In Progress</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                <EllipsisVerticalIcon className="h-6 w-6"/>
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">Bugs</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-5 py-2 rounded bg-priority-button-high text-white">High</span>
                                        </td>
                                        <td className="px-6 py-4">Sprint 4</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">To-do</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                <EllipsisVerticalIcon className="h-6 w-6"/>
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
                                        style={{width: "450px"}}
                                        onChange={({target: {name, value}}) => handleIssueFormChange(name, value)}
                                    />
                                    <FormInput
                                        type="text"
                                        name="priority"
                                        placeholder="Priority"
                                        formValues={issueFormValues}
                                        onChange={({target: {name, value}}) => handleIssueFormChange(name, value)}
                                    />
                                    <FormInput
                                        type="text"
                                        name="severity"
                                        placeholder="Severity"
                                        formValues={issueFormValues}
                                        onChange={({target: {name, value}}) => handleIssueFormChange(name, value)}
                                    />
                                    <FormInput
                                        type="text"
                                        name="status"
                                        placeholder="Status"
                                        formValues={issueFormValues}
                                        onChange={({target: {name, value}}) => handleIssueFormChange(name, value)}
                                    />
                                </form>

                                <div className="flex justify-end">
                                    <button style={{width: '418px'}} type="submit"
                                            className="mt-2 px-6 py-2 bg-primary-pink text-white rounded-lg">
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

