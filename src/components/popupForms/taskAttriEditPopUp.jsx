import React from 'react';
import {XCircleIcon} from "@heroicons/react/24/outline/index.js";

const TaskAttriEditPopUp = ({editOptions, setEditOptions}) => {
    const closeModal = () => setEditOptions({});

    return (
        editOptions?.id && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm" onClick={closeModal}/>
                <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <XCircleIcon onClick={closeModal}
                                 className={"absolute top-4 right-4 w-7 h-7 text-primary-pink cursor-pointer"}/>
                    <div className="text-center mt-10 flex-col">
                        <p className="text-sm text-text-color mt-2">
                            Editing <b>{editOptions?.caption}</b> of
                        </p>
                        <p className="text-sm text-text-color">
                            <b>{`${editOptions?.title}`}</b> task
                        </p>
                        <p className="text-sm text-text-color mt-2">
                            Current Value: <b>{`${editOptions?.value}`}</b>
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button type="submit"
                                    className="px-4 py-2 bg-primary-pink text-white rounded hover:bg-pink-600 w-2/4 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                // disabled={isSubmitting}
                            >
                                Update
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 rounded w-1/4 border border-black cursor-pointer disabled:cursor-not-allowed"
                                // disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default TaskAttriEditPopUp;
