import React, {useState} from 'react';
import {getInitials} from "../../../utils/commonUtils.js";
import {CheckBadgeIcon, PlusCircleIcon, TrashIcon, XCircleIcon} from "@heroicons/react/24/outline/index.js";
import FormInput from "../../FormInput.jsx";
import {useSelector} from "react-redux";
import {selectUser} from "../../../state/slice/authSlice.js";
import DateSelector from "../../DateSelector.jsx";
import moment from "moment";
import axios from "axios";
import {useToasts} from "react-toast-notifications";

const TimeLogging = ({timeLogs, taskId, refetchTimeLogs}) => {
    const {addToast} = useToasts();
    const userDetails = useSelector(selectUser);

    const [showNewRow, setShowNewRow] = useState(false);
    const [newRow, setNewRow] = useState({time: 0, description: '', date: new Date()});
    const [dateSelectorOpen, setDateSelectorOpen] = useState(false);

    const handleAddNewRow = () => {
        setShowNewRow(true);
    };

    const handleSaveTimeLog = async () => {
        if (newRow.time > 0) {
            try {
                const response = await axios.post(`/tasks/${taskId}/time-logs`, {
                    ...newRow,
                    date: moment(newRow?.date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                })
                const created = response?.data?.body?.status

                if (created) {
                    addToast('Time Logged Successfully ', {appearance: 'success'});
                    refetchTimeLogs()
                    setShowNewRow(false);
                    setNewRow({time: 0, description: '', date: new Date()});
                } else {
                    addToast('Failed log time', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed log time', {appearance: 'error'});
            }
        } else {
            addToast('Time should be greater than 0', {appearance: 'warning'});
        }

    };

    const handleCancelNewRow = () => {
        setShowNewRow(false);
        setNewRow({time: 0, description: '', date: new Date()});
    };

    const handleInputChange = (name, value) => {
        setNewRow((prevRow) => ({
            ...prevRow,
            [name]: name === "time" ? Number(value) : value,
        }));
    };

    const handleDateSelect = (value) => {
        setNewRow({...newRow, date: value});
    };

    const handleDateClose = (doReset) => {
        setDateSelectorOpen(false)
        if (doReset) {
            setNewRow({...newRow, date: new Date()});
        }
    };

    const GenerateRow = ({row}) => {
        const timeLogId = row?.id
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

        const deleteTimeLog = async () => {
            try {
                const response = await axios.delete(`/tasks/${taskId}/time-logs/${timeLogId}`)
                const deleted = response?.data?.body?.status

                if (deleted) {
                    addToast('Time log successfully deleted', {appearance: 'success'});
                    refetchTimeLogs()
                } else {
                    addToast('Failed to delete the time log', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed to delete the time log', {appearance: 'error'});
            }
        }

        const updateTimeLog = async () => {
            if (time > 0) {
                try {
                    await axios.put(`/tasks/${taskId}/time-logs/${timeLogId}`, {
                        time: time,
                        description: description,
                        date: row.date
                    })
                    addToast('Time log successfully updated', {appearance: 'success'});
                    refetchTimeLogs()
                } catch (error) {
                    addToast('Failed to update the logged time', {appearance: 'error'});
                }
            } else {
                addToast('Time should be greater than 0', {appearance: 'warning'});
            }
        }

        return (
            <tr className="border-b">
                <td className="px-4 py-2">{moment(row?.date).local().format('YYYY-MM-DD')}</td>
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
            <div className="flex w-full mb-3 justify-end pr-5">
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
                                <td className="px-4 py-2">
                                    <div className={"bg-secondary-pink cursor-pointer py-3 pl-3 rounded-md"}
                                         onClick={() => setDateSelectorOpen(true)}>
                                        {moment(newRow?.date).format('YYYY-MM-DD')}
                                    </div>
                                </td>
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
                                        <CheckBadgeIcon onClick={handleSaveTimeLog}
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
                <DateSelector date={newRow?.date} onClose={handleDateClose} isOpen={dateSelectorOpen}
                              onSave={handleDateSelect}/>
            </div>
        </div>
    );
};

export default TimeLogging;
