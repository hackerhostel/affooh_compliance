import React, {useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/outline/index.js";

const TestCasesSection = ({testCases = []}) => {

    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 5;
    const totalPages = testCases && testCases.length ? Math.ceil(testCases.length / rowsPerPage) : 0;
    const indexOfLastTask = currentPage * rowsPerPage;
    const indexOfFirstTask = indexOfLastTask - rowsPerPage;
    const currentPageContent = testCases && testCases.length ? testCases.slice(indexOfFirstTask, indexOfLastTask) : [];

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

    // const GenerateRow = ({criteria}) => {
    //     const criteriaId = criteria?.acId
    //     const description = criteria?.description
    //     const [status, setSatus] = useState(criteria?.status);
    //
    //     const updateCriteria = (e) => {
    //         const check = e?.target?.checked ? "Accepted" : "Open";
    //         if (status !== check) {
    //             setSatus(check);
    //             manageCriteria('update', {acId: criteriaId, status: check});
    //         }
    //     };
    //
    //     return (
    //         <tr className="border-b border-gray-200">
    //             <td className="py-5 px-4 text-text-color" colSpan="2">{description}</td>
    //             <td className="py-5 px-4 flex gap-3 items-center text-text-color">
    //                 <div>
    //                     <ToggleButton onChange={e => updateCriteria(e)}
    //                                   checked={status === "Accepted"} disabled={isSubmitting}/>
    //                 </div>
    //             </td>
    //             <td className="px-4 py-5">
    //                 <div className={"flex gap-5"}>
    //                     <div className="cursor-pointer" onClick={() => manageCriteria('remove', criteriaId)}>
    //                         <TrashIcon className={"w-5 h-5 text-red-600 cursor-pointer"}/>
    //                     </div>
    //                 </div>
    //             </td>
    //         </tr>
    //     );
    // };

    return (
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-md shadow-lg">
            {(testCases && testCases.length) ? (
                <>
                    <table className="table-auto w-full border-collapse">
                        <thead>
                        <tr className="text-left text-secondary-grey border-b border-gray-200">
                            <th className="py-5 px-4">Name</th>
                            <th className="py-5 px-4">How</th>
                            <th className="py-5 px-4">Priority</th>
                            <th className="py-5 px-4">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentPageContent.map((cases) => (
                            <div></div>
                            //<GenerateRow criteria={criteria} key={criteria?.acId}/>
                        ))}
                        </tbody>
                    </table>
                    {(testCases && testCases.length > 0) && (
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
                <p className="text-text-color w-full text-center">No Test Cases Available</p>
            )}
        </div>
    );
};

export default TestCasesSection;
