import React from 'react';
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";

const SettingPage = () => {
    const selectedProject = useSelector(selectSelectedProject);

    return (
        <div className="h-list-screen overflow-y-auto w-full flex flex-col space-y-2">
            <button
                style={{ width: "266px" }}
                className={`flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer "border-primary-pink" : "border-gray-200"`}
            >Custom fields</button>

            <button
                style={{ width: "266px" }}
                className={`flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer "border-primary-pink" : "border-gray-200"`}
            >Task Type</button>

            <button
                style={{ width: "266px" }}
                className={`flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer "border-primary-pink" : "border-gray-200"`}
            >Screens</button>
        </div>
    );
};

export default SettingPage;