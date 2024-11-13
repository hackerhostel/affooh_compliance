import React, {useState} from 'react';
import {getInitials} from "../../../utils/commonUtils.js";
import {CheckBadgeIcon, PlusCircleIcon, TrashIcon, XCircleIcon} from "@heroicons/react/24/outline/index.js";
import FormInput from "../../FormInput.jsx";
import {useSelector} from "react-redux";
import {selectUser} from "../../../state/slice/authSlice.js";

const TimeLogging = ({timeLogs, taskId}) => {
    const userDetails = useSelector(selectUser);

    const [showNewRow, setShowNewRow] = useState(false);
    const [newRow, setNewRow] = useState({time: 0, description: ''});

    const handleAddNewRow = () => {
        setShowNewRow(true);
    };

    const handleSaveNewRow = () => {
        console.log("New row saved:", newRow);
        setShowNewRow(false);
        setNewRow({time: 0, description: ''});
    };

    const handleCancelNewRow = () => {
        setShowNewRow(false);
        setNewRow({time: 0, description: ''});
    };

    const handleInputChange = (name, value) => {
        setNewRow((prevRow) => ({
            ...prevRow,
            [name]: name === "time" ? Number(value) : value,
        }));
    };

    const GenerateRow = ({row}) => {
        const user = row?.user;
        const [time, setTime] = useState(row?.time || 0);
        const [description, setDescription] = useState(row?.description || '');
        const [dataChanged, setDataChanged] = useState(false);

        const handleChanges = (name, value) => {
            if (name === "time") {
                const newTime = Number(value);
                setTime(newTime);
                setDataChanged(newTime !== row?.time || description !== (row?.description || ''));
            } else {
                const newDescription = value;
                setDescription(newDescription);
                setDataChanged(time !== row?.time || newDescription !== (row?.description || ''));
            }
        }

        const deleteTimeLog = () => {
            console.log("deleted")
        }

        const updateTimeLog = () => {
            console.log("updated")
        }

        return (
            <tr className="border-b">
                <td className="px-4 py-2">{new Date(row?.date).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 w-36">
                    <FormInput
                        type="number"
                        min="0"
                        name="time"
                        formValues={{time: time}}
                        onChange={({target: {name, value}}) => handleChanges(name, value)}
                    />
                </td>
                <td className="px-4 py-2">
                    <FormInput
                        type="text"
                        name="description"
                        formValues={{description: description}}
                        onChange={({target: {name, value}}) => handleChanges(name, value)}
                    />
                </td>
                <td className="px-4 py-2">
                    <div
                        className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                        {row?.user ? (getInitials(`${user?.firstName} ${user?.lastName}`)) : "N/A"}
                    </div>
                </td>
                <td className="px-4 py-2">
                    <div className={"flex gap-5"}>
                        <div onClick={deleteTimeLog} className={"cursor-pointer"}>
                            <TrashIcon className={"w-5 h-5 text-pink-700"}/>
                        </div>
                        {dataChanged && (
                            <div onClick={updateTimeLog} className={"cursor-pointer"}>
                                <CheckBadgeIcon className={"w-5 h-5 text-pink-700"}/>
                            </div>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="w-full mt-8">
            <div className="flex w-full mb-3 justify-between pr-5">
                <p className="text-text-color text-lg font-bold">Time Logs</p>
                <div className="flex gap-1 items-center">
                    <PlusCircleIcon
                        onClick={handleAddNewRow}
                        className={`w-6 h-6 ${showNewRow ? "text-gray-300 cursor-not-allowed" : "text-pink-500 cursor-pointer"}`}
                    />
                    <span className="font-thin text-xs text-gray-600">Add New</span>
                </div>
            </div>
            <div className="w-full p-6 bg-white rounded-lg shadow-lg flex-col">
                {timeLogs.length || showNewRow ? (
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time Spent (hr)</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewRow && (
                            <tr className="border-b">
                                <td className="px-4 py-2">{new Date().toISOString().split('T')[0]}</td>
                                <td className="px-4 py-2 w-36">
                                    <FormInput
                                        type="number"
                                        min="0"
                                        name="time"
                                        formValues={{time: newRow.time}}
                                        onChange={({target: {name, value}}) => handleInputChange(name, value)}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <FormInput
                                        type="text"
                                        name="description"
                                        formValues={{description: newRow.description}}
                                        onChange={({target: {name, value}}) => handleInputChange(name, value)}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <div
                                        className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                                        {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
                                    </div>
                                </td>
                                <td className="px-4 py-2 ">
                                    <div className={"flex gap-5"}>
                                        <XCircleIcon onClick={handleCancelNewRow}
                                                     className="w-5 h-5 text-gray-500 cursor-pointer"/>
                                        <CheckBadgeIcon onClick={handleSaveNewRow}
                                                        className="w-5 h-5 text-pink-700 cursor-pointer"/>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {timeLogs && timeLogs.map((row) => (
                            <GenerateRow row={row} key={row.id}/>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-text-color">No Time Logs Available</p>
                )}
            </div>
        </div>
    );
};

export default TimeLogging;
