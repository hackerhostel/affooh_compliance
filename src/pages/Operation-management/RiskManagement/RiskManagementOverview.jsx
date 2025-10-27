import React, { useState } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import RiskLevelCell from "../../../components/RiskCell.jsx";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import FormInput from "../../../components/FormInput.jsx";

const complianceOptions = [
    { label: "Non-Compliant", value: "Non-Compliant" },
    { label: "Partially Compliant", value: "Partially Compliant" },
    { label: "Compliant", value: "Compliant" },
];

const severityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
];

const statusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Pending", value: "Pending" },
];

const initialData = [
    {
        id: 1,
        title: "ISO control - close/Annex A",
        currentGaps: "Gap 1: Missing documentation",
        complianceStatus: "Non-Compliant",
        severity: "High",
        recommendedAction: "Review and update documentation accordingly.",
        recommendedAction2: "Review and update documentation accordingly2.",
        responsibility: {
            firstName: "John",
            lastName: "Doe",
            avatar: "",
        },
        dueDate: "2025-08-15",
        status: "In Progress",
        task: "Update ISO documentation",
        recommended: "Add context documentation",
        status2: "Pending",
        task2: "2"
    },
];

const RiskManagementOverview = () => {
    const [filterValues, setFilterValues] = useState({
        control: "",
        assignee: "",
        compliance: "",
        severity: "",
        status: "",
    });

    const [rows, setRows] = useState(initialData);

    const handleRowChange = (id, field, value) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    return (
        <div>
            <div className=" items-center justify-between flex px-4">
                <div><span className="text-xl font-semibold">Risk Management</span></div>
                <div className="flex justify-end items-center mt-4 space-x-2">
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Archived</button>
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Approved</button>
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Save</button>
                </div>
            </div>

            <div className='bg-white p-4 mt-5 flex rounded-lg'>
                <div className="flex gap-4 p-4">
                    <div className='border-2 border-secondary-bcg rounded-lg px-24 py-8'>
                        <div className='flex flex-col items-center gap-1 text-text-color'>
                            <span className='text-3xl font-medium'>25</span>
                            <span className='text-lg font-medium'>All</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 p-4">
                    <div className='border-2 border-pass-border-color rounded-lg px-24 py-8'>
                        <div className='flex flex-col items-center gap-1 text-text-color'>
                            <span className='text-3xl font-medium'>25</span>
                            <span className='text-lg font-medium'>Pass</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 p-4">
                    <div className='border-2 border-priority-high rounded-lg px-24 py-8'>
                        <div className='flex flex-col items-center gap-1 text-text-color'>
                            <span className='text-3xl font-medium'>12</span>
                            <span className='text-lg font-medium'>Fail</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 p-4">
                    <div className='border-2 border-pending-border-color rounded-lg px-24  py-8'>
                        <div className='flex flex-col items-center gap-1  text-text-color'>
                            <span className='text-3xl font-medium'>25</span>
                            <span className='text-lg font-medium'>Pending</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Filters Row */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-4 p-4">
                    <div className="w-28">
                        <FormSelect
                            name="control"
                            options={[]}
                            placeholder="Control"
                            showLabel={false}
                            value={filterValues.control}
                            onChange={(e) =>
                                setFilterValues({ ...filterValues, control: e.target.value })
                            }
                        />
                    </div>

                    <div className="w-28">
                        <FormSelect
                            name="assignee"
                            placeholder="Assignee"
                            showLabel={false}
                            options={[]}
                            value={filterValues.assignee}
                            onChange={(e) =>
                                setFilterValues({ ...filterValues, assignee: e.target.value })
                            }
                        />
                    </div>

                    <div className="w-36">
                        <FormSelect
                            name="compliance"
                            placeholder="Compliance"
                            showLabel={false}
                            options={complianceOptions}
                            value={filterValues.compliance}
                            onChange={(e) =>
                                setFilterValues({ ...filterValues, compliance: e.target.value })
                            }
                        />
                    </div>

                    <div className="w-28">
                        <FormSelect
                            name="severity"
                            placeholder="Severity"
                            showLabel={false}
                            options={severityOptions}
                            value={filterValues.severity}
                            onChange={(e) =>
                                setFilterValues({ ...filterValues, severity: e.target.value })
                            }
                        />
                    </div>

                    <div className="w-28">
                        <FormSelect
                            name="status"
                            placeholder="Status"
                            showLabel={false}
                            options={statusOptions}
                            value={filterValues.status}
                            onChange={(e) =>
                                setFilterValues({ ...filterValues, status: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="flex w-44 items-center">
                    <button className="btn-primary h-10 rounded-md " type="button">
                        Update
                    </button>
                    <EllipsisVerticalIcon className="w-8 ml-2" />
                </div>
            </div>

            {/* First Table */}
            <div className="px-4 mt-5 h-[600px] bg-white rounded">
                <table className="w-full border-collapse bg-white rounded-lg  mb-10">
                    <thead className="text-left">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">ISO Control - Clause/Annex A</th>
                            <th className="px-4 py-3">Current Gaps</th>
                            <th className="px-4 py-3 text-center">Risk Level</th>
                            <th className="px-4 py-3 text-center">Owner</th>
                            <th className="px-4 py-3 text-center">Residual Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} className="border-t bg-gray-100">
                                <td className="px-4 py-3 text-left">{row.id}</td>
                                <td className="px-4 py-3 text-left">{row.iso}</td>
                                <td className="px-4 py-3">{row.currentGaps}</td>
                                <td className="px-4 w-44 py-3">
                                    <RiskLevelCell data={{ impact: 5, likelihood: 3 }} />
                                </td>
                                 <td className="px-4 py-3">
                                        
                                    </td>

                                    <td className="px-4 w-44 py-3">
                                    <RiskLevelCell data={{ impact: 5, likelihood: 3 }} />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Second Table */}
                <table className="w-full border-collapse rounded-md overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-3">Response</th>
                            <th className="px-4 py-3 w-[420px]">Recommended Action</th>
                            <th className="px-4 py-3 text-center w-[150px]">Responsibility</th>
                            <th className="px-4 py-3 text-center w-[130px]">Due Date</th>
                            <th className="px-4 py-3 text-center w-[180px]">Status</th>
                            <th className="px-4 py-3 text-center">Task</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const user = row.responsibility;
                            return (
                                <tr key={row.id} className="border-t bg-gray-100">
                                    <td className="px-4 py-3 w-[170px]">
                                        <FormSelect
                                            name="status"
                                            value={row.status}
                                            options={statusOptions}
                                            onChange={(e) =>
                                                handleRowChange(row.id, "status", e.target.value)
                                            }
                                            showLabel={false}
                                            className="w-full rounded-md"
                                        />
                                    </td>
                                     
                                    <td className="px-4 py-3 align-top">
                                        <FormTextArea
                                            name="recommendedAction"
                                            value={row.recommendedAction}
                                            onChange={(e) =>
                                                handleRowChange(row.id, "recommendedAction", e.target.value)
                                            }
                                            showLabel={false}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        {user ? (
                                            <div className="flex items-center space-x-2">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                                                        {user.firstName?.[0]}
                                                        {user.lastName?.[0]}
                                                    </div>
                                                )}
                                                <span>
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No user</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <FormInput
                                            name="dueDate"
                                            value={row.dueDate}
                                            type="date"
                                            onChange={(e) =>
                                                handleRowChange(row.id, "dueDate", e.target.value)
                                            }
                                            showLabel={false}
                                            className="w-full"
                                            />
                                    </td>
                                    <td className="px-4 py-3">
                                        <FormSelect
                                            name="status"
                                            value={row.status}
                                            options={statusOptions}
                                            onChange={(e) =>
                                                handleRowChange(row.id, "status", e.target.value)
                                            }
                                            showLabel={false}
                                            className="w-full rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">{row.task}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Third Table Example Row */}
                <table className="mt-8 w-full border-collapse rounded-md overflow-hidden">
                    <tbody>
                        <tr className="bg-gray-100 px-4 py-2">
                            <th className="px-4 py-2" >Interested Parties</th>
                            <th className="px-4 py-2" >Threat</th>
                            <th className="w-44">Reference(s)</th>
                            <th className="w-15">Re-Assessment Date</th>
                            <th></th>
                        </tr>
                        {rows.map((row) => (
                            <tr key={row.id} className="border-t bg-gray-100">
                                <td className="px-4 py-3 w-[420px]">
                                    4.2 - Understanding the organization and its context
                                </td>
                                <td className="px-4 py-3">
                                    test
                                </td>
                                <td className="px-4 py-3">
                                   test
                                </td>
                                <td className="px-4 py-3">
                                    <FormInput
                                            name="dueDate"
                                            value={row.dueDate}
                                            type="date"
                                            onChange={(e) =>
                                                handleRowChange(row.id, "dueDate", e.target.value)
                                            }
                                            showLabel={false}
                                            className="w-full"
                                            />
                                    </td>
                                    <FormTextArea
                                            name="recommendedAction"
                                            value={row.test}
                                            onChange={(e) =>
                                                handleRowChange(row.id, "recommendedAction", e.target.value)
                                            }
                                            showLabel={false}
                                            className="w-full rounded-md p-4"
                                        />
                            </tr>
                        ))}
                    </tbody>
                </table>

               

            </div>
        </div>
    );
};

export default RiskManagementOverview;
