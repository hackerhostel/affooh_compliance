import React, {useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon} from "@heroicons/react/24/outline/index.js";

const SubTaskSection = () => {
    const tasks = [
        {
            name: "Affooh Landing Page Design",
            assignee: "Nilanga",
            status: "In Progress",
            statusColor: "bg-blue-100 text-blue-700"
        },
        {name: "Home Page", assignee: "Scott", status: "Change Request", statusColor: "bg-yellow-100 text-yellow-700"},
        {name: "Home Page", assignee: "Anne", status: "Completed", statusColor: "bg-green-100 text-green-700"},
        {name: "Home Page", assignee: "Anara", status: "New", statusColor: "bg-blue-100 text-blue-700"},
        {name: "Home Page", assignee: "Leo", status: "Hold", statusColor: "bg-gray-100 text-gray-700"},
        //     {name: "Dashboard", assignee: "Emma", status: "Completed", statusColor: "bg-green-100 text-green-700"},
        //     {name: "Login Page", assignee: "John", status: "In Progress", statusColor: "bg-blue-100 text-blue-700"},
        //     {
        //         name: "API Integration",
        //         assignee: "Sophia",
        //         status: "Change Request",
        //         statusColor: "bg-yellow-100 text-yellow-700"
        //     },
        //     {name: "User Profile", assignee: "Chris", status: "New", statusColor: "bg-blue-100 text-blue-700"},
        //     {name: "Settings Page", assignee: "Michael", status: "Hold", statusColor: "bg-gray-100 text-gray-700"},
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Calculate total pages

    const totalPages = Math.ceil(tasks.length / rowsPerPage);

    // Get the tasks for the current page
    const indexOfLastTask = currentPage * rowsPerPage;
    const indexOfFirstTask = indexOfLastTask - rowsPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

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

    return (
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-md shadow-lg">
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
                {currentTasks.map((task, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="py-5 px-4">{task.name}</td>
                        <td className="py-5 px-4">{task.assignee}</td>
                        <td className="py-5 px-4">
                            <span className={`py-1 px-3 rounded-full text-sm ${task.statusColor}`}>{task.status}</span>
                        </td>
                        <td className="py-5 px-4">
                            <EllipsisVerticalIcon className={"w-6 h-6 text-secondary-grey cursor-pointer"}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
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
        </div>
    );
};

export default SubTaskSection;
