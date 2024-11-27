import React, {useEffect, useState} from "react";
import {
    CheckBadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    XMarkIcon
} from "@heroicons/react/24/outline/index.js";
import {getInitials, getSelectOptions, getUserSelectOptions} from "../../../utils/commonUtils.js";
import {statusCellRender} from "../../sprint-table/utils.jsx";
import FormInput from "../../FormInput.jsx";
import FormSelect from "../../FormSelect.jsx";
import {useSelector} from "react-redux";
import {selectAppConfig} from "../../../state/slice/appSlice.js";
import {selectSelectedProject} from "../../../state/slice/projectSlice.js";
import useFetchScreensForTask from "../../../hooks/custom-hooks/task/useFetchScreensForTask.jsx";

const SubTaskSection = ({subtasks, addingNew, selectedTab, setAddingNew, users}) => {
    const appConfig = useSelector(selectAppConfig);
    const selectedProject = useSelector(selectSelectedProject);

    const {data: screenResponse} = useFetchScreensForTask(appConfig?.taskTypes.find(tt => tt.value === "Task")?.screenID || 0, selectedProject?.id)

    const [newRow, setNewRow] = useState({name: '', assignee: 0, status: ''});
    const [showNewRow, setShowNewRow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState([]);

    useEffect(() => {
        if (addingNew && selectedTab === 'sub_task') {
            setShowNewRow(true)
        } else {
            setShowNewRow(false)
        }
    }, [addingNew, selectedTab]);

    useEffect(() => {
        if (screenResponse?.id) {
            const fieldStatus = screenResponse?.tabs[0]?.fields.find(f => f.name === "Status")?.fieldValues || []
            setStatus(fieldStatus)
            if (fieldStatus.length) {
                setNewRow({...newRow, status: fieldStatus[0].id})
            }
        }
    }, [screenResponse]);

    const rowsPerPage = 5;
    const totalPages = subtasks && subtasks.length ? Math.ceil(subtasks.length / rowsPerPage) : 0;
    const indexOfLastTask = currentPage * rowsPerPage;
    const indexOfFirstTask = indexOfLastTask - rowsPerPage;
    const currentTasks = subtasks && subtasks.length ? subtasks.slice(indexOfFirstTask, indexOfLastTask) : [];

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const onHideNew = () => {
        setAddingNew(false)
        setNewRow({name: '', assignee: 0, status: ''})
    }

    const GenerateRow = ({subTask}) => {
        // console.log(subTask)
        const subTaskId = subTask?.id
        const assignee = subTask?.assignee
        const [isEdit, setIsEditing] = useState(false);
        const [description, setDescription] = useState(subTask?.description || '');
        const [dataChanged, setDataChanged] = useState(false);

        return (
            <tr className="border-b border-gray-200">
                {!isEdit ? (
                    <>
                        <td className="py-5 px-4 text-text-color">{subTask?.name}</td>
                        <td className="py-5 px-4 flex gap-3 items-center text-text-color">
                            <div
                                className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-md font-semibold">
                                {assignee ? (getInitials(`${assignee?.firstName} ${assignee?.lastName}`)) : "N/A"}
                            </div>
                            {assignee && (<p>{assignee?.firstName}</p>)}
                        </td>
                        <td className="py-5 px-4">
                            <div className={"max-w-28"}>
                                {statusCellRender(subTask?.attributes?.status)}
                            </div>
                        </td>
                        <td className="py-5 px-4">
                            <EllipsisVerticalIcon className={"w-6 h-6 text-secondary-grey cursor-pointer"}/>
                        </td>
                    </>
                ) : (
                    <>
                        {/*<td className="px-4 py-5">{moment(subTask?.date).local().format('YYYY-MM-DD')}</td>*/}
                        {/*<td className="px-4 py-5 w-36">*/}
                        {/*    <FormInput*/}
                        {/*        type="number"*/}
                        {/*        min="0"*/}
                        {/*        name="time"*/}
                        {/*        formValues={{time: time}}*/}
                        {/*        // onChange={({target: {name, value}}) => handleChanges(name, value)}*/}
                        {/*    />*/}
                        {/*</td>*/}
                        {/*<td className="px-4 py-5">*/}
                        {/*    <FormInput*/}
                        {/*        type="text"*/}
                        {/*        name="description"*/}
                        {/*        formValues={{description: description}}*/}
                        {/*        // onChange={({target: {name, value}}) => handleChanges(name, value)}*/}
                        {/*    />*/}
                        {/*</td>*/}
                        {/*<td className="px-4 py-5">*/}
                        {/*    <div*/}
                        {/*        className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">*/}
                        {/*        {subTask?.user ? (getInitials(`${subTask?.firstName} ${subTask?.lastName}`)) : "N/A"}*/}
                        {/*    </div>*/}
                        {/*</td>*/}
                        {/*<td className="px-4 py-5">*/}
                        {/*    <div className={"flex gap-5"}>*/}
                        {/*        <div className={"cursor-pointer"}>*/}
                        {/*            <TrashIcon className={"w-5 h-5 text-pink-700"}/>*/}
                        {/*        </div>*/}
                        {/*        {dataChanged && (*/}
                        {/*            <div className={"cursor-pointer"}>*/}
                        {/*                <CheckBadgeIcon className={"w-5 h-5 text-pink-700"}/>*/}
                        {/*            </div>*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*</td>*/}
                    </>
                )}
            </tr>
        );
    };

    return (
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-md shadow-lg">
            {(subtasks && subtasks.length) || showNewRow ? (
                <>
                    <table className="table-auto w-full border-collapse">
                        <thead>
                        <tr className="text-left text-secondary-grey border-b border-gray-200">
                            <th className="py-5 px-4">Task Name</th>
                            <th className="py-5 px-4">Assignee</th>
                            <th className="py-5 px-4">Status</th>
                            <th className="py-5 px-4">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewRow && (
                            <tr className="border-b border-gray-200">
                                <td className="px-4 py-5">
                                    <FormInput
                                        type="text"
                                        name="name"
                                        formValues={{name: newRow.name}}
                                        // onChange={({target: {name, value}}) => handleChanges(name, value)}
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <FormSelect
                                        name="assignee"
                                        formValues={{assignee: newRow.assignee}}
                                        options={getUserSelectOptions(users)}
                                        // onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <FormSelect
                                        name="status"
                                        formValues={{status: newRow.status}}
                                        options={getSelectOptions(status)}
                                        // onChange={({target: {name, value}}) => handleFormChange(name, value)}
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <div className={"flex gap-5"}>
                                        <div className={"cursor-pointer"}>
                                            <CheckBadgeIcon className={"w-6 h-6 text-pink-700"}/>
                                        </div>
                                        <div className={"cursor-pointer"} onClick={onHideNew}>
                                            <XMarkIcon className={"w-6 h-6 text-text-color"}/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {currentTasks.map((task) => (
                            <GenerateRow subTask={task} key={task?.id}/>
                        ))}
                        </tbody>
                    </table>
                    {(subtasks && subtasks.length) && (
                        <div className="w-full flex gap-5 items-center justify-end mt-4">
                            <button
                                onClick={handlePreviousPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeftIcon className={"w-4 h-4 text-secondary-grey"}/>
                            </button>
                            <span className="text-gray-500 text-center">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRightIcon className={"w-4 h-4 text-secondary-grey"}/>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-text-color w-full text-center">No Sub Tasks Available</p>
            )}
        </div>
    );
};

export default SubTaskSection;
