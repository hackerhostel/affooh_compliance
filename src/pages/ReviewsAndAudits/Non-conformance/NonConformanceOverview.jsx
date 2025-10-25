import React, { useState } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const complianceOptions = [
  { label: "Compliant", value: "Compliant" },
  { label: "Partially Compliant", value: "Partially Compliant" },
  { label: "Non-Compliant", value: "Non-Compliant" },
];

const severityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const statusOptions = [
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

const dummyRows = [
  {
    id: 1,
    nonConformance: "Procedure not followed for ISO documentation update",
    source: "Internal Audit",
    compliance: "Non-Compliant",
    clause: "4.2",
    severity: "High",
    dueDate: "2025-08-15",
    status: "In Progress",
    owner: { firstName: "John", lastName: "Doe", avatar: "" },
  },
  {
    id: 2,
    nonConformance: "Lack of employee training documentation",
    source: "External Audit",
    compliance: "Partially Compliant",
    clause: "7.2",
    severity: "Medium",
    dueDate: "2025-07-22",
    status: "To Do",
    owner: { firstName: "Jane", lastName: "Smith", avatar: "" },
  },
  {
    id: 3,
    nonConformance: "Inconsistent record keeping in quality control",
    source: "Process Review",
    compliance: "Compliant",
    clause: "8.3",
    severity: "Low",
    dueDate: "2025-05-10",
    status: "Done",
    owner: { firstName: "Michael", lastName: "Brown", avatar: "" },
  },
];

const NonConformanceOverview = () => {
  const [filterValues, setFilterValues] = useState({
    control: "",
    assignee: "",
    compliance: "",
    severity: "",
    status: "",
  });

  const [rows, setRows] = useState(dummyRows);

  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  return (
    <div>
      <div className="items-center justify-between flex px-4">
        <div>
          <span className="text-xl font-semibold">Non Conformance</span>
        </div>
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
            Archived
          </button>
          <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
            Approved
          </button>
          <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
            Save
          </button>
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="bg-white p-4 mt-5 flex rounded-lg">
        <div className="flex gap-4 p-4">
          <div className="border-2 border-secondary-bcg rounded-lg px-24 py-8">
            <div className="flex flex-col items-center gap-1 text-text-color">
              <span className="text-3xl font-medium">25</span>
              <span className="text-lg font-medium">NCRs</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-4">
          <div className="border-2 border-pass-border-color rounded-lg px-24 py-8">
            <div className="flex flex-col items-center gap-1 text-text-color">
              <span className="text-3xl font-medium">25</span>
              <span className="text-lg font-medium">To Do</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-4">
          <div className="border-2 border-priority-high rounded-lg px-24 py-8">
            <div className="flex flex-col items-center gap-1 text-text-color">
              <span className="text-3xl font-medium">12</span>
              <span className="text-lg font-medium">In Progress</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-4">
          <div className="border-2 border-pending-border-color rounded-lg px-24  py-8">
            <div className="flex flex-col items-center gap-1  text-text-color">
              <span className="text-3xl font-medium">25</span>
              <span className="text-lg font-medium">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 mt-4">
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
      </div>

      {/* Table */}
      <div className="px-4 mt-5 h-[600px] rounded-md bg-white">
        <table className="w-full border-collapse bg-white mb-10">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-6">#</th>
              <th className="px-4 py-3">Non Conformance</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Compliance</th>
              <th className="px-4 py-3">Clause</th>
              <th className="px-4 py-3 text-center">Severity</th>
              <th className="px-4 py-3 text-center">Due Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const user = row.owner;
              return (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3 w-[200px]">{row.nonConformance}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">{row.compliance}</td>
                  <td className="px-4 py-3">{row.clause}</td>
                  <td className="px-4 py-3 text-center">{row.severity}</td>
                  <td className="px-4 py-3 text-center">{row.dueDate}</td>
                  <td className="px-4 py-3 text-center">{row.status}</td>
                  <td className="px-4 py-3 ">
                    {user ? (
                      <div className="flex items-center justify-left space-x-2">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonConformanceOverview;
