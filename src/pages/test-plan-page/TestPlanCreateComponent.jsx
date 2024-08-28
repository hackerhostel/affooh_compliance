import React from 'react';
import {XMarkIcon} from "@heroicons/react/24/outline/index.js";

const TestPlanCreateComponent = ({isOpen, onClose}) => {

    const handleClose = () => {
        onClose()
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
                    <div className="bg-white p-6 shadow-lg w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-2xl">New Test Plan</p>
                            <div className={"cursor-pointer"} onClick={handleClose}>
                                <XMarkIcon className={"w-6 h-6 text-gray-500"}/>
                            </div>
                        </div>
                        <div className={"flex flex-col justify-between h-5/6 mt-10"}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Project"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Sprint"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Release"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex space-x-4 mt-6 self-end w-full">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-gray-700 rounded w-1/4 border border-black">
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-primary-pink text-white rounded hover:bg-pink-600 w-3/4">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TestPlanCreateComponent;
