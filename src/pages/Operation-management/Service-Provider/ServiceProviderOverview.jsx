import React, { useState, useEffect } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import { 
  getServiceProviders, 
  createServiceProvider, 
  updateServiceProvider, 
  deleteServiceProvider 
} from "../../../utils/serviceProviderApi";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const ServiceProviderOverview = ({ onSelectServiceProvider }) => {
  const { addToast } = useToasts();
  const [serviceProviderRows, setServiceProviderRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // New Row state
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    serviceProviderName: "",
    servicesProvided: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    contractEndDate: "",
  });

  // Edit/Action states
  const [editingRowId, setEditingRowId] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const data = await getServiceProviders();
      setServiceProviderRows(data);
    } catch (error) {
      addToast("Failed to fetch service providers", { appearance: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      serviceProviderName: "",
      servicesProvided: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      contractEndDate: "",
    });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    if (name === "contactNumber" && value && !/^\d*$/.test(value)) return;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    if (!newRow.serviceProviderName || !newRow.email) {
      addToast("Service Provider Name and Email are required", { appearance: "warning" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newRow.email)) {
      addToast("Please enter a valid email address", { appearance: "warning" });
      return;
    }

    if (newRow.contactNumber && !/^\d+$/.test(newRow.contactNumber)) {
      addToast("Contact number must contain only digits", { appearance: "warning" });
      return;
    }

    try {
      await createServiceProvider(newRow);
      addToast("Service provider added successfully", { appearance: "success" });
      setShowNewRow(false);
      fetchServiceProviders();
    } catch (error) {
      addToast("Failed to add service provider", { appearance: "error" });
    }
  };

  const handleCancelNew = () => setShowNewRow(false);

  const handleStartEdit = (id) => {
    setEditingRowId(id);
    setOpenActionRowId(null);
  };

  const handleEditChange = (id, { target: { name, value } }) => {
    if (name === "contactNumber" && value && !/^\d*$/.test(value)) return;
    setServiceProviderRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleDoneEdit = async (id) => {
    const row = serviceProviderRows.find(r => r.id === id);
    if (!row) return;

    if (!row.serviceProviderName || !row.email) {
      addToast("Service Provider Name and Email are required", { appearance: "warning" });
      return;
    }

    if (row.contactNumber && !/^\d+$/.test(row.contactNumber)) {
      addToast("Contact number must contain only digits", { appearance: "warning" });
      return;
    }

    try {
      await updateServiceProvider(id, row);
      addToast("Service provider updated successfully", { appearance: "success" });
      setEditingRowId(null);
      fetchServiceProviders();
    } catch (error) {
      addToast("Failed to update service provider", { appearance: "error" });
    }
  };

  const confirmDelete = (row) => {
    setItemToDelete(row);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleDeleteRow = async () => {
    if (!itemToDelete) return;
    try {
      await deleteServiceProvider(itemToDelete.id);
      addToast("Service provider deleted successfully", { appearance: "success" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchServiceProviders();
    } catch (error) {
      addToast("Failed to delete service provider", { appearance: "error" });
    }
  };

  const toggleActionMenu = (id) =>
    setOpenActionRowId((prev) => (prev === id ? null : id));

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(serviceProviderRows.length / rowsPerPage));
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = serviceProviderRows.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="p-4">
      {/* Title + Add New */}
      <div className="flex items-center space-x-4 mt-5">
        <span className="text-lg font-semibold">Approved List</span>
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
      <div className="bg-white rounded p-3 mt-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="text-left text-secondary-grey border-b border-gray-200">
                  <th className="py-3 px-2 w-10">#</th>
                  <th className="py-3 px-2">Service Provider Name</th>
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
                          <td className="py-3 px-2">{row.serviceProviderName}</td>
                          <td className="py-3 px-2">{row.servicesProvided}</td>
                          <td className="py-3 px-2">{row.address}</td>
                          <td className="py-3 px-2">{row.contactPerson}</td>
                          <td className="py-3 px-2">{row.contactNumber}</td>
                          <td className="py-3 px-2">{row.email}</td>
                          <td className="py-3 px-2">
                            {row.contractEndDate ? formatDate(row.contractEndDate) : "-"}
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
                                  onClick={() => onSelectServiceProvider && onSelectServiceProvider(row.id)}
                                  title="View Details"
                                >
                                  <EyeIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleStartEdit(row.id)}
                                  title="Edit"
                                >
                                  <PencilIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => confirmDelete(row)}
                                  title="Delete"
                                >
                                  <TrashIcon className="w-5 h-5 text-text-color" />
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setOpenActionRowId(null)}
                                  title="Cancel"
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
                            "serviceProviderName", 
                            "servicesProvided", 
                            "address", 
                            "contactPerson", 
                            "contactNumber", 
                            "email"
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
                             <input 
                               type="date"
                               name="contractEndDate"
                               className="border p-1 w-full"
                               value={row.contractEndDate ? row.contractEndDate.split('T')[0] : ""}
                               onChange={(e) => handleEditChange(row.id, e)}
                             />
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-3 items-center">
                              <div className="cursor-pointer" onClick={() => handleDoneEdit(row.id)}>
                                <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                              </div>
                              <div className="cursor-pointer" onClick={() => setEditingRowId(null)}>
                                <XMarkIcon className="w-5 h-5 text-text-color" />
                              </div>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}

                {/* New Row */}
                {showNewRow && (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2">-</td>
                    {[
                      "serviceProviderName", 
                      "servicesProvided", 
                      "address", 
                      "contactPerson", 
                      "contactNumber", 
                      "email"
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
                       <input 
                         type="date"
                         name="contractEndDate"
                         className="border p-1 w-full"
                         value={newRow.contractEndDate}
                         onChange={handleNewChange}
                       />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-3 items-center">
                        <div className="cursor-pointer" onClick={handleSaveNew}>
                          <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                        </div>
                        <div className="cursor-pointer" onClick={handleCancelNew}>
                          <XMarkIcon className="w-5 h-5 text-text-color" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {serviceProviderRows.length === 0 && !showNewRow && (
                  <tr>
                    <td className="py-3 px-2 text-center text-gray-500" colSpan={9}>
                      No service provider data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {serviceProviderRows.length > 0 && (
              <div className="w-full flex gap-5 items-center justify-end mt-4">
                <button
                  onClick={handlePreviousPage}
                  className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
                </button>
                <span className="text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRow}
        message={
          itemToDelete
            ? `Are you sure you want to delete service provider "${itemToDelete.serviceProviderName}"?`
            : "Are you sure you want to delete this service provider?"
        }
      />
    </div>
  );
};

export default ServiceProviderOverview;
