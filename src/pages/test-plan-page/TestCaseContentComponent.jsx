import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import SearchBar from "../../components/SearchBar.jsx";
import TestCaseCreateComponent from "./TestCaseCreateComponent.jsx";

const TestCaseContentComponent = ({testCasesForProject, refetchTestCases}) => {
    const dispatch = useDispatch();

    const [testCases, setTestCases] = useState([]);
    const [filteredTestCases, setFilteredTestCases] = useState([]);
    const [isTestCaseCreateOpen, setIsTestCaseCreateOpen] = useState(false);

    useEffect(() => {
        if (testCasesForProject.length) {
            setTestCases(testCasesForProject)
            setFilteredTestCases(testCasesForProject)
        }
    }, [testCasesForProject]);

    const handleTestCaseSearch = (term) => {
        if (term.trim() === '') {
            setFilteredTestCases(testCases);
        } else {
            const filtered = testCases.filter(tp =>
                tp?.summary.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredTestCases(filtered);
        }
    };

    const onTestCaseAddNew = () => {
        setIsTestCaseCreateOpen(true)
    }

    const handleTestCaseCreateClose = (created) => {
        setIsTestCaseCreateOpen(false);
        if (created === true) {
            refetchTestCases()
        }
    };

    return (
        <>
            <div className="flex-col mb-8">
                <div className="flex gap-5 items-center mb-4">
                    <p className="text-secondary-grey font-bold text-lg">Test Cases</p>
                    <div className="flex gap-1 items-center mr-5 cursor-pointer" onClick={onTestCaseAddNew}>
                        <PlusCircleIcon className="w-6 h-6 text-pink-500"/>
                        <span className="font-thin text-xs text-gray-600">Add New</span>
                    </div>
                    <SearchBar onSearch={handleTestCaseSearch}/>
                </div>
                <div className="py-4 flex-col bg-white p-4 rounded-md">
                    {!testCasesForProject || !testCasesForProject.length ? (
                        <p className={"text-secondary-grey text-xs text-center w-full"}>No available test
                            cases</p>
                    ) : (
                        <table className="min-w-full ">
                            <thead>
                            <tr className="w-full">
                                <th className="p-2">Summary</th>
                                <th className="p-2">Priority</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTestCases.map(row => (
                                <tr key={row.id}
                                    className="w-full">
                                    <td className="border border-gray-300 p-2 w-3/6">{row.summary}</td>
                                    <td className="border border-gray-300 text-center p-2 w-1/6">
                                            <span
                                                className={`px-2 py-1 rounded`}>
                                                {row.priority.value}
                                            </span>
                                    </td>
                                    <td className="border border-gray-300 text-center p-2 w-1/6">{row.category.value}</td>
                                    <td className="border border-gray-300 text-center p-2 w-1/6">{row.status.value}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <TestCaseCreateComponent isOpen={isTestCaseCreateOpen} onClose={handleTestCaseCreateClose}/>
        </>
    );
};

export default TestCaseContentComponent;
