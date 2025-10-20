import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";

const DeviceMovedOverview = () => {
  // Dummy filter form state
  const [formValues, setFormValues] = useState({
    assetName: "",
    code: "",
    moveDate: "",
    returnDate: "",
    reason: "",
  });

  // ✅ Dummy device movement data
  const [deviceRows, setDeviceRows] = useState([
    {
      id: 1,
      assetName: "Dell Laptop XPS 13",
      code: "DLX13-001",
      moveDate: "2025-09-10",
      returnDate: "2025-09-20",
      reason: "Temporary remote work setup",
      movedBy: { firstName: "Alice", lastName: "Johnson", avatar: "" },
      approved: { firstName: "John", lastName: "Doe", avatar: "" },
    },
    {
      id: 2,
      assetName: "HP Printer Pro 400",
      code: "HPP400-004",
      moveDate: "2025-08-05",
      returnDate: "2025-08-15",
      reason: "Departmental relocation",
      movedBy: { firstName: "Maria", lastName: "Gomez", avatar: "" },
      approved: { firstName: "Michael", lastName: "Lee", avatar: "" },
    },
    {
      id: 3,
      assetName: "Lenovo ThinkPad T14",
      code: "LTP14-009",
      moveDate: "2025-07-01",
      returnDate: "2025-07-10",
      reason: "Conference use",
      movedBy: { firstName: "Emma", lastName: "Brown", avatar: "" },
      approved: { firstName: "Sophia", lastName: "Davis", avatar: "" },
    },
  ]);

   const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options); // Example: "10 Sep"
  };

  // Delete handler
  const handleDeleteRow = (id) => {
    setDeviceRows((prev) => prev.filter((row) => row.id !== id));
  };

  // Render user cell
  const renderUserCell = (user) => {
    if (!user)
      return <span className="text-gray-400 italic">No user</span>;

    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-6">
      {/* Top Buttons */}
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

      <div className="flex items-center justify-between gap-5 mt-4">
        <span className="text-lg font-semibold">Device Moved </span>
      </div>

      {/* Filter Section */}
      <div className="flex items-center mt-4 justify-between">
        <div className="flex space-x-4">
          {["movedBy", "owner"].map(
            (field) => (
              <div className="w-28" key={field}>
                <FormSelect
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  showLabel={false}
                  options={[]}
                  formValues={formValues}
                  onChange={(e) =>
                    setFormValues({ ...formValues, [field]: e.target.value })
                  }
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-3 shadow-sm">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="py-4 px-2 w-10">ID</th>
              <th className="py-4 px-4">Asset Name</th>
              <th className="py-4 px-4">Code</th>
              <th className="py-4 px-4">Move Date</th>
              <th className="py-4 px-4">Return Date</th>
              <th className="py-4 px-4">Reason</th>
              <th className="py-4 px-4">Moved By</th>
              <th className="py-4 px-4">Approved</th>
              {/* <th className="py-3 px-4 text-center">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {deviceRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  No records found
                </td>
              </tr>
            ) : (
              deviceRows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-2">{index + 1}</td>
                  <td className="py-4 px-4">{row.assetName}</td>
                  <td className="py-4 px-4">{row.code}</td>
                  <td className="py-4 px-4">{formatDate(row.moveDate)}</td>
                  <td className="py-4 px-4">{formatDate(row.returnDate)}</td>
                  <td className="py-4 px-4">{row.reason}</td>
                  <td className="py-4 px-4">{renderUserCell(row.movedBy)}</td>
                  <td className="py-4 px-4">{renderUserCell(row.approved)}</td>
                  {/* <td className="py-4 px-4 text-center">
                    <TrashIcon
                      onClick={() => handleDeleteRow(row.id)}
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500 transition"
                    />
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceMovedOverview;
