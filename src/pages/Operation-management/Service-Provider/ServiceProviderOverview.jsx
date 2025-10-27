import React, { useState } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const ServiceProviderOverview = () => {
  // Helper to format date as "12-Feb"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${day}-${month}`;
  };

  // Dummy data
  const [supplierRows, setSupplierRows] = useState([
    {
      id: 1,
      supplierName: "ABC Traders",
      namesAndItems: "John Supplies - Laptops, Keyboards",
      address: "123 Main Street, Colombo",
      contactPerson: "John Silva",
      contactNumber: "+94 77 123 4567",
      email: "john@abctraders.com",
      contractEndDate: "2025-12-10",
    },
    {
      id: 2,
      supplierName: "TechZone Pvt Ltd",
      namesAndItems: "TechZone - Monitors, Printers",
      address: "45 Galle Road, Gampaha",
      contactPerson: "Jane Fernando",
      contactNumber: "+94 71 987 6543",
      email: "jane@techzone.lk",
      contractEndDate: "2025-11-20",
    },
  ]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    supplierName: "",
    namesAndItems: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    contractEndDate: "",
  });

  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(supplierRows.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = supplierRows.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      supplierName: "",
      namesAndItems: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      contractEndDate: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = () => {
    if (
      !newRow.supplierName ||
      !newRow.namesAndItems ||
      !newRow.address ||
      !newRow.contactPerson ||
      !newRow.contactNumber ||
      !newRow.email ||
      !newRow.contractEndDate
    )
      return;

    const newEntry = { id: Date.now(), ...newRow };
    setSupplierRows((prev) => [...prev, newEntry]);
    setShowNewRow(false);
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    setSupplierRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = () => setEditingRowId(null);
  const handleDeleteRow = (id) =>
    setSupplierRows((prev) => prev.filter((r) => r.id !== id));

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="p-4">
      {/* Buttons */}
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

      {/* Title + Add New */}
      <div className="flex items-center space-x-4 mt-5">
        <span className="text-lg font-semibold">Service Provider List</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon
            onClick={handleAddNewClick}
            className="w-6 h-6 text-pink-500 cursor-pointer"
          />
          <button className="text-text-color" onClick={handleAddNewClick}>
            Add New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-2">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-2 w-10">#</th>
              <th className="py-3 px-2">Supplier Name</th>
              <th className="py-3 px-2">Description of Service</th>
              <th className="py-3 px-2">Address</th>
              <th className="py-3 px-2">Contact Person</th>
              <th className="py-3 px-2">Contact Number</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Contract End Date</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row, index) => {
              const isEditing = editingRowId === row.id;
              return (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-3 px-2">{indexOfFirst + index + 1}</td>

                  {!isEditing ? (
                    <>
                      <td className="py-3 px-2">{row.supplierName}</td>
                      <td className="py-3 px-2">{row.namesAndItems}</td>
                      <td className="py-3 px-2">{row.address}</td>
                      <td className="py-3 px-2">{row.contactPerson}</td>
                      <td className="py-3 px-2">{row.contactNumber}</td>
                      <td className="py-3 px-2">{row.email}</td>
                      <td className="py-3 px-2">
                        {formatDate(row.contractEndDate)}
                      </td>
                      <td className="py-3 px-2">
                        {openActionRowId !== row.id ? (
                          <div
                            className="cursor-pointer inline-flex"
                            onClick={() => toggleActionMenu(row.id)}
                          >
                            <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div
                              className="cursor-pointer"
                              onClick={() => handleStartEdit(row.id)}
                            >
                              <PencilIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDeleteRow(row.id)}
                            >
                              <TrashIcon className="w-5 h-5 text-text-color" />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => setOpenActionRowId(null)}
                            >
                              <XMarkIcon className="w-5 h-5 text-text-color" />
                            </div>
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      {[
                        "supplierName",
                        "namesAndItems",
                        "address",
                        "contactPerson",
                        "contactNumber",
                        "email",
                        "contractEndDate",
                      ].map((field) => (
                        <td key={field} className="py-3 px-2">
                          <FormTextArea
                            name={field}
                            formValues={{ [field]: row[field] }}
                            onChange={(e) => handleEditChange(row.id, e)}
                          />
                        </td>
                      ))}
                      <td className="py-3 px-2">
                        <div className="flex gap-3 items-center">
                          <div className="cursor-pointer" onClick={handleDoneEdit}>
                            <CheckBadgeIcon className="w-5 h-5 text-text-color" />
                          </div>
                          <div className="cursor-pointer" onClick={handleCancelNew}>
                            <XMarkIcon className="w-5 h-5 text-text-color" />
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}

            {/* New Row - shown at bottom */}
            {showNewRow && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2">-</td>
                {[
                  "supplierName",
                  "namesAndItems",
                  "address",
                  "contactPerson",
                  "contactNumber",
                  "email",
                  "contractEndDate",
                ].map((field) => (
                  <td key={field} className="py-3 px-2">
                    <FormTextArea
                      name={field}
                      formValues={{ [field]: newRow[field] }}
                      onChange={handleNewChange}
                    />
                  </td>
                ))}
                <td className="py-3 px-2">
                  <div className="flex gap-3 items-center">
                    <div className="cursor-pointer" onClick={handleSaveNew}>
                      <CheckBadgeIcon className="w-5 h-5 text-pink-700" />
                    </div>
                    <div className="cursor-pointer" onClick={handleCancelNew}>
                      <XMarkIcon className="w-5 h-5 text-text-color" />
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {pagedRows.length === 0 && !showNewRow && (
              <tr>
                <td
                  className="py-3 px-2 text-center text-gray-500"
                  colSpan={9}
                >
                  No supplier data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {supplierRows.length > 0 && (
          <div className="w-full flex gap-5 items-center justify-end mt-4">
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
            </button>
            <span className="text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`p-2 rounded-full bg-gray-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderOverview;
