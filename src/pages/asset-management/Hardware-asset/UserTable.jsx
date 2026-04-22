import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import {
  PencilIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  doGetAssignmentHistory,
  doAssignUser,
  doUpdateAssignment,
  doDeleteAssignment,
} from "../../../state/slice/assetSlice.js";
import { useToasts } from 'react-toast-notifications';

const UserTable = ({ assetId, projectUsers }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const rows = useSelector((state) => state.asset.assignmentHistory || []);
  const isHistoryLoading = useSelector((state) => state.asset.isAssignmentHistoryLoading);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({ userID: "", assignedDate: "", returnedDate: "" });
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingValues, setEditingValues] = useState({ returnedDate: "" });
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assetId) {
      dispatch(doGetAssignmentHistory(assetId));
    }
  }, [assetId, dispatch]);

  const assignToOptions = projectUsers.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const rowsPerPage = 5;
  const totalPages = Math.ceil(rows.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const pagedRows = rows.slice(indexOfFirst, indexOfLast);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleAddNewClick = () => {
    setShowNewRow(true);
    setNewRow({ userID: "", assignedDate: "", returnedDate: "" });
  };

  const handleNewChange = ({ target: { name, value } }) => {
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNew = async () => {
    if (!newRow.userID || !newRow.assignedDate) {
      addToast("Please fill in User and Assign Date", { appearance: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(doAssignUser({
        assetID: assetId,
        userID: Number(newRow.userID),
        assignedDate: newRow.assignedDate,
        assignmentNotes: null,
      })).unwrap();

      if (newRow.returnedDate && result?.assignmentID) {
        await dispatch(doUpdateAssignment({
          assignmentID: result.assignmentID,
          assignmentData: { returnedDate: newRow.returnedDate },
        })).unwrap();
      }

      addToast("User assigned successfully!", { appearance: "success" });
      setShowNewRow(false);
      dispatch(doGetAssignmentHistory(assetId));
    } catch (error) {
      addToast(error?.error || error?.message || "Failed to save assignment", { appearance: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelNew = () => {
    setShowNewRow(false);
  };

  const handleStartEdit = (row) => {
    setEditingRowId(row.id);
    setEditingValues({ returnedDate: formatDate(row.returnedDate) === "-" ? "" : formatDate(row.returnedDate) });
    setOpenActionRowId(null);
  };

  const handleSaveEdit = async (row) => {
    setIsSubmitting(true);
    try {
      await dispatch(doUpdateAssignment({
        assignmentID: row.id,
        assignmentData: {
          returnedDate: editingValues.returnedDate || null,
        },
      })).unwrap();
      addToast("Assignment updated successfully!", { appearance: "success" });
      setEditingRowId(null);
      dispatch(doGetAssignmentHistory(assetId));
    } catch (error) {
      addToast(error?.error || error?.message || "Failed to update assignment", { appearance: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  const handleDeleteRow = (id) => {
    setAssignmentToDelete(id);
    setDeleteDialogOpen(true);
    setOpenActionRowId(null);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    setIsSubmitting(true);
    try {
      await dispatch(doDeleteAssignment(assignmentToDelete)).unwrap();
      addToast("Assignment deleted successfully!", { appearance: "success" });
      dispatch(doGetAssignmentHistory(assetId));
    } catch (error) {
      addToast(error?.error || error?.message || "Failed to delete assignment", { appearance: "error" });
    } finally {
      setIsSubmitting(false);
      setAssignmentToDelete(null);
    }
  };

  const toggleActionMenu = (id) => {
    setOpenActionRowId((prev) => (prev === id ? null : id));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Users</span>
        <div className="flex items-center gap-1">
          <PlusCircleIcon onClick={handleAddNewClick} className="w-6 h-6 text-pink-500 cursor-pointer" />
          <button className="text-text-color" onClick={handleAddNewClick} disabled={isSubmitting}>
            Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded p-3 mt-2">
        {isHistoryLoading ? (
          <div className="text-center py-8 text-gray-500">Loading history...</div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left text-secondary-grey border-b border-gray-200">
                <th className="py-3 px-2 w-10">#</th>
                <th className="py-3 px-4 w-72">Assign To</th>
                <th className="py-3 px-2 w-48">Assign Date</th>
                <th className="py-3 px-2 w-48">Return Date</th>
                <th className="py-3 px-2 w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {showNewRow && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2 w-72">
                    <FormSelect
                      name="userID"
                      formValues={newRow}
                      options={assignToOptions}
                      onChange={handleNewChange}
                      placeholder="Select User"
                      showLabel={false}
                    />
                  </td>
                  <td className="py-3 px-2 w-48">
                    <FormInput
                      name="assignedDate"
                      type="date"
                      formValues={newRow}
                      onChange={handleNewChange}
                      showLabel={false}
                    />
                  </td>
                  <td className="py-3 px-2 w-48">
                    <FormInput
                      name="returnedDate"
                      type="date"
                      formValues={newRow}
                      onChange={handleNewChange}
                      showLabel={false}
                    />
                  </td>
                  <td className="py-3 px-2 w-32">
                    <div className="flex gap-3 items-center">
                      <div className="cursor-pointer" onClick={handleSaveNew}>
                        <CheckCircleIcon className={`w-5 h-5 text-primary-pink ${isSubmitting ? 'opacity-50' : ''}`} />
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
                  <td className="py-3 px-2 text-center text-gray-500" colSpan={5}>
                    No assigned users found
                  </td>
                </tr>
              )}

              {pagedRows.map((row, index) => {
                const isEditing = editingRowId === row.id;
                const userName = row.firstName ? `${row.firstName} ${row.lastName}` : "Unknown User";

                return (
                  <tr key={row.id} className="border-b border-gray-200">
                    <td className="py-3 px-2">{indexOfFirst + index + 1}</td>

                    {!isEditing ? (
                      <>
                        <td className="py-3 px-2">{userName}</td>
                        <td className="py-3 px-2">{formatDate(row.assignedDate)}</td>
                        <td className="py-3 px-2">{formatDate(row.returnedDate)}</td>
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
                              <div className="cursor-pointer" onClick={() => handleStartEdit(row)}>
                                <PencilIcon className="w-5 h-5 text-text-color" />
                              </div>
                              <div className="cursor-pointer" onClick={() => handleDeleteRow(row.id)}>
                                <TrashIcon className="w-5 h-5 text-text-color" />
                              </div>
                              <div className="cursor-pointer" onClick={() => setOpenActionRowId(null)}>
                                <XMarkIcon className="w-5 h-5 text-text-color" />
                              </div>
                            </div>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2">{userName}</td>
                        <td className="py-3 px-2">{formatDate(row.assignedDate)}</td>
                        <td className="py-3 px-2 w-48">
                          <FormInput
                            name="returnedDate"
                            type="date"
                            formValues={editingValues}
                            onChange={({ target: { value } }) =>
                              setEditingValues({ returnedDate: value })
                            }
                            showLabel={false}
                          />
                        </td>
                        <td className="py-3 px-2 w-32">
                          <div className="flex gap-3 items-center">
                            <div
                              className={`cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}
                              onClick={() => !isSubmitting && handleSaveEdit(row)}
                            >
                              <CheckCircleIcon className="w-5 h-5 text-primary-pink" />
                            </div>
                            <div className="cursor-pointer" onClick={handleCancelEdit}>
                              <XMarkIcon className="w-5 h-5 text-text-color" />
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {rows.length > 0 && (
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
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setAssignmentToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment?"
        message="This assignment will be permanently deleted. Are you sure?"
      />
    </div>
  );
};

export default UserTable;
