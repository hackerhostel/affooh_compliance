import React, {useState} from 'react';
import {XMarkIcon} from "@heroicons/react/24/outline/index.js";
import axios from "axios";
import {useToasts} from "react-toast-notifications";

const SprintDeleteComponent = ({onClose, sprint}) => {
    const {addToast} = useToasts();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = (deleted = false) => {
        onClose(deleted)
    };

    const deleteSprint = async (event) => {
        setIsSubmitting(true)
        event.preventDefault();
        try {
            const response = await axios.delete(`/sprints/${sprint?.id}`)
            handleClose(true)
            addToast('Sprint Successfully Deleted', {appearance: 'success'});
        } catch (error) {
            addToast('Failed To Delete The Sprint', {appearance: 'error'});
        }
        setIsSubmitting(false)
    }

    return (
        <>
            {sprint?.id && (
                <div
                    className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 shadow-lg w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">Delete Sprint {sprint?.name} ?</p>
                            <div className={"cursor-pointer"} onClick={() => handleClose(false)}>
                                <XMarkIcon className={"w-6 h-6 text-gray-500"}/>
                            </div>
                        </div>
                        <form className={"flex flex-col justify-between h-5/6 mt-10"} onSubmit={deleteSprint}>
                            <div className="space-y-4">
                                <p className="text-secondary-grey">Are you sure you want to delete the this sprint ?</p>
                            </div>
                            <div className="flex space-x-4 mt-6 self-end w-full">
                                <button
                                    onClick={() => handleClose(false)}
                                    className="px-4 py-2 text-gray-700 rounded w-1/4 border border-black cursor-pointer disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button type="submit"
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-3/4 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        disabled={isSubmitting}
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SprintDeleteComponent;
