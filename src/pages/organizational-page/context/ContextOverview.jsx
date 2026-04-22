import React, { useEffect, useState } from 'react';
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import { PencilIcon, EllipsisVerticalIcon, CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getUserSelectOptions } from "../../../utils/commonUtils.js";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";
import useFetchOrganizationalContext from "../../../hooks/custom-hooks/compliance/useFetchOrganizationalContext.jsx";
import useFetchFunctions from "../../../hooks/custom-hooks/compliance/useFetchFunctions.jsx";
import useFetchLaws from "../../../hooks/custom-hooks/compliance/useFetchLaws.jsx";
import {
    createFunction,
    createLaw,
    createOrganizationalContext,
    deleteFunction,
    deleteLaw,
    updateFunction,
    updateLaw,
    updateOrganizationalContext
} from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const ContextOverview = () => {
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const projectUserList = useSelector(selectProjectUserList);
    const projectId = selectedProject?.id;
    const [contextId, setContextId] = useState(null);

    const {
        data: contextData,
        refetch: refetchContext
    } = useFetchOrganizationalContext(projectId);
    const { data: functionsData, refetch: refetchFunctions } = useFetchFunctions(projectId);
    const { data: lawsData, refetch: refetchLaws } = useFetchLaws(projectId);

    const [formValues, setFormValues] = useState({
        purpose: "",
        companyName: "",
        companyAddress: "",
        contactInformation: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // Functions table state
    const [functionsRows, setFunctionsRows] = useState([]);
    const [showNewFunctionRow, setShowNewFunctionRow] = useState(false);
    const [newFunctionRow, setNewFunctionRow] = useState({ department: '', description: '', hodId: '' });
    const [editingRowId, setEditingRowId] = useState(null);
    const [openActionRowId, setOpenActionRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Applicable Laws and Regulations state
    const [lawsRows, setLawsRows] = useState([]);
    const [showNewLawRow, setShowNewLawRow] = useState(false);
    const [newLawRow, setNewLawRow] = useState({ law: '', jurisdiction: '' });
    const [editingLawRowId, setEditingLawRowId] = useState(null);
    const [openLawActionRowId, setOpenLawActionRowId] = useState(null);
    const [lawsCurrentPage, setLawsCurrentPage] = useState(1);

    // Delete confirmation state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const hodOptions = getUserSelectOptions(projectUserList || []);
    const getUserNameById = (id) => {
        const user = projectUserList?.find((item) => Number(item.id) === Number(id));
        return user ? `${user.firstName} ${user.lastName}` : "";
    };

    useEffect(() => {
        if (contextData?.id) {
            setContextId(contextData.id);
            setFormValues({
                purpose: contextData.purpose || "",
                companyName: contextData.companyName || "",
                companyAddress: contextData.companyAddress || "",
                contactInformation: contextData.contactInformation || "",
            });
        }
    }, [contextData]);

    useEffect(() => {
        const mapped = (functionsData || []).map((row) => ({
            ...row,
            hodId: row?.hod?.id ? String(row.hod.id) : "",
            hodName: row?.hod?.name || getUserNameById(row?.hod?.id),
        }));
        setFunctionsRows(mapped);
    }, [functionsData, projectUserList]);

    useEffect(() => {
        const mapped = (lawsData || []).map((row) => ({
            id: row.id,
            law: row.lawName,
            jurisdiction: row.jurisdiction,
            description: row.description,
            referenceNumber: row.referenceNumber,
            effectiveDate: row.effectiveDate,
            displayOrder: row.displayOrder,
        }));
        setLawsRows(mapped);
    }, [lawsData]);

    const resetNewFunctionRow = () => setNewFunctionRow({ department: '', description: '', hodId: '' });

    const handleNewFunctionChange = ({ target: { name, value } }) => {
        setNewFunctionRow(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNewClick = () => {
        setShowNewFunctionRow(true);
        resetNewFunctionRow();
    };

    const handleCancelNew = () => {
        setShowNewFunctionRow(false);
        resetNewFunctionRow();
    };

    const handleSaveNew = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newFunctionRow.department || !newFunctionRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createFunction({
                projectID: projectId,
                contextID: contextId,
                department: newFunctionRow.department,
                description: newFunctionRow.description,
                hod: newFunctionRow.hodId ? Number(newFunctionRow.hodId) : null,
                displayOrder: functionsRows.length + 1,
            });
            setShowNewFunctionRow(false);
            resetNewFunctionRow();
            refetchFunctions();
            addToast("Function created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create function", { appearance: "error" });
        }
    };

    const handleDeleteRow = (row) => {
        setItemToDelete({ ...row, type: "function" });
        setIsDeleteDialogOpen(true);
        setOpenActionRowId(null);
    };

    const handleStartEdit = (id) => {
        setEditingRowId(id);
        setOpenActionRowId(null);
    };

    const handleCloseEdit = () => {
        setEditingRowId(null);
    };

    const handleEditChange = (id, { target: { name, value } }) => {
        setFunctionsRows(prev => prev.map(r => r.id === id ? {
            ...r,
            [name]: value,
            hodName: name === "hodId" ? getUserNameById(value) : r.hodName
        } : r));
    };

    const handleDoneEdit = async () => {
        const row = functionsRows.find((item) => item.id === editingRowId);
        if (row) {
            if (!row.department || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateFunction(row.id, {
                    department: row.department,
                    description: row.description,
                    hod: row.hodId ? Number(row.hodId) : null,
                    displayOrder: row.displayOrder || 0,
                });
                refetchFunctions();
                addToast("Function updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update function", { appearance: "error" });
            }
        }
        setEditingRowId(null);
    };

    const toggleActionMenu = (id) => {
        setOpenActionRowId(prev => prev === id ? null : id);
    };

    const rowsPerPage = 5;
    const totalPages = functionsRows.length ? Math.ceil(functionsRows.length / rowsPerPage) : 1;
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const pagedRows = functionsRows.slice(indexOfFirst, indexOfLast);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Laws handlers
    const handleAddNewLawClick = () => {
        setShowNewLawRow(true);
        setNewLawRow({ law: '', jurisdiction: '' });
    };

    const handleNewLawChange = ({ target: { name, value } }) => {
        setNewLawRow(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelNewLaw = () => {
        setShowNewLawRow(false);
        setNewLawRow({ law: '', jurisdiction: '' });
    };

    const handleSaveNewLaw = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newLawRow.law || !newLawRow.jurisdiction) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createLaw({
                projectID: projectId,
                contextID: contextId,
                lawName: newLawRow.law,
                jurisdiction: newLawRow.jurisdiction,
                displayOrder: lawsRows.length + 1,
            });
            setShowNewLawRow(false);
            setNewLawRow({ law: '', jurisdiction: '' });
            refetchLaws();
            addToast("Law created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create law", { appearance: "error" });
        }
    };

    const handleDeleteLawRow = (row) => {
        setItemToDelete({ ...row, type: "law" });
        setIsDeleteDialogOpen(true);
        setOpenLawActionRowId(null);
    };

    const handleStartEditLaw = (id) => {
        setEditingLawRowId(id);
        setOpenLawActionRowId(null);
    };

    const handleCloseEditLaw = () => {
        setEditingLawRowId(null);
    };

    const handleEditLawChange = (id, { target: { name, value } }) => {
        setLawsRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    };

    const handleDoneEditLaw = async () => {
        const row = lawsRows.find((item) => item.id === editingLawRowId);
        if (row) {
            if (!row.law || !row.jurisdiction) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateLaw(row.id, {
                    lawName: row.law,
                    jurisdiction: row.jurisdiction,
                    description: row.description,
                    referenceNumber: row.referenceNumber,
                    effectiveDate: row.effectiveDate,
                    displayOrder: row.displayOrder || 0,
                });
                refetchLaws();
                addToast("Law updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update law", { appearance: "error" });
            }
        }
        setEditingLawRowId(null);
    };

    const toggleLawActionMenu = (id) => {
        setOpenLawActionRowId(prev => prev === id ? null : id);
    };

    const lawsRowsPerPage = 5;
    const lawsTotalPages = lawsRows.length ? Math.ceil(lawsRows.length / lawsRowsPerPage) : 1;
    const lawsIndexOfLast = lawsCurrentPage * lawsRowsPerPage;
    const lawsIndexOfFirst = lawsIndexOfLast - lawsRowsPerPage;
    const pagedLawsRows = lawsRows.slice(lawsIndexOfFirst, lawsIndexOfLast);

    const handleNextLawsPage = () => {
        if (lawsCurrentPage < lawsTotalPages) setLawsCurrentPage(lawsCurrentPage + 1);
    };

    const handlePreviousLawsPage = () => {
        if (lawsCurrentPage > 1) setLawsCurrentPage(lawsCurrentPage - 1);
    };

    // General handler for all form inputs
    const handleChange = (eventOrName, value) => {
        // Handle both event object and direct name/value
        let fieldName, fieldValue;

        if (typeof eventOrName === 'string') {
            // Direct name/value call
            fieldName = eventOrName;
            fieldValue = value;
        } else if (eventOrName?.target) {
            // Event object
            fieldName = eventOrName.target.name;
            fieldValue = eventOrName.target.value;
        }

        if (fieldName) {
            setFormValues(prev => ({
                ...prev,
                [fieldName]: fieldValue
            }));
        }
    };

    const handleSaveContext = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }

        if (!formValues.purpose || !formValues.companyName) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }

        const payload = {
            projectID: projectId,
            documentType: "Context",
            purpose: formValues.purpose,
            companyName: formValues.companyName,
            companyAddress: formValues.companyAddress,
            contactInformation: formValues.contactInformation,
        };

        try {
            if (contextId) {
                await updateOrganizationalContext(contextId, payload);
                addToast("Context updated successfully", { appearance: "success" });
            } else {
                const created = await createOrganizationalContext(payload);
                setContextId(created?.id || null);
                addToast("Context saved successfully", { appearance: "success" });
            }
            refetchContext();
        } catch (error) {
            addToast("Failed to save context", { appearance: "error" });
        }
    };

    // Unified delete confirmation handler
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (itemToDelete.type === "function") {
                await deleteFunction(itemToDelete.id);
                refetchFunctions();
                if (editingRowId === itemToDelete.id) setEditingRowId(null);
                if (openActionRowId === itemToDelete.id) setOpenActionRowId(null);
                addToast("Function deleted successfully", { appearance: "success" });
            } else if (itemToDelete.type === "law") {
                await deleteLaw(itemToDelete.id);
                refetchLaws();
                if (editingLawRowId === itemToDelete.id) setEditingLawRowId(null);
                if (openLawActionRowId === itemToDelete.id) setOpenLawActionRowId(null);
                addToast("Law deleted successfully", { appearance: "success" });
            }
        } catch (error) {
            addToast(`Failed to delete ${itemToDelete.type}`, { appearance: "error" });
        }
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    return (
        <div>
            {/* Top Buttons */}
            <div className='flex justify-end items-center mt-4 space-x-2'>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Approved</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white' onClick={handleSaveContext}>Save</button>
            </div>

            {/* overview */}
            <div className='mt-6'>
                <span className='text-lg font-semibold'>Overview</span>
                <div className='bg-white rounded p-3 mt-2'>
                    <div className='p-2'>
                        <FormTextArea
                            name="purpose"
                            formValues={formValues}
                            onChange={handleChange}
                            showLabel={false}
                            className="w-full"
                            rows={5}
                            placeholder="Enter organization purpose and context..."
                        />
                    </div>
                </div>
            </div>


            {/* company details */}

            <div className='mt-6'>
                <span className='text-lg font-semibold'>Company Details</span>
                <div className='bg-white rounded p-4 mt-2 flex flex-col gap-4'>
                    <div className='flex items-center gap-4'>
                        <label className='w-44 shrink-0 text-sm font-medium'>Company Name</label>
                        <div className='flex-1'>
                            <FormInput
                                type="text"
                                name="companyName"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) => handleChange(name, value)}
                                className="w-1/2 p-3 border rounded-md bg-slate-100"
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <label className='w-44 shrink-0 text-sm font-medium'>Company Address</label>
                        <div className='flex-1'>
                            <FormInput
                                type="text"
                                name="companyAddress"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) => handleChange(name, value)}
                                className="w-1/2 p-3 border rounded-md bg-slate-100"
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <label className='w-44 shrink-0 text-sm font-medium'>Contact Information</label>
                        <div className='flex-1'>
                            <FormInput
                                type="text"
                                name="contactInformation"
                                formValues={formValues}
                                onChange={({ target: { name, value } }) => handleChange(name, value)}
                                className="w-1/2 p-3 border rounded-md bg-slate-100"
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Functions */}

            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Functions</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={handleAddNewClick} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={handleAddNewClick}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '5%' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '30%' }}>Department</th>
                                <th className='py-3 px-2' style={{ width: '40%' }}>Description</th>
                                <th className='py-3 px-2' style={{ width: '20%' }}>HOD</th>
                                <th className='py-3 px-2' style={{ width: '5%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewFunctionRow && (
                                <tr className='text-left border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput
                                            type="text"
                                            name="department"
                                            formValues={{ department: newFunctionRow.department }}
                                            onChange={handleNewFunctionChange}
                                        />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormTextArea
                                            type="text"
                                            name="description"
                                            formValues={{ description: newFunctionRow.description }}
                                            onChange={handleNewFunctionChange}
                                        />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormSelect
                                            name="hodId"
                                            formValues={{ hodId: newFunctionRow.hodId }}
                                            options={hodOptions}
                                            onChange={handleNewFunctionChange}
                                        />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNew}>
                                                <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
                                            </div>
                                            <div className={'cursor-pointer'} onClick={handleCancelNew}>
                                                <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {functionsRows.length === 0 && !showNewFunctionRow && (
                                <tr>
                                    <td className='py-3 px-2 text-text-color text-center' colSpan={5}>No Functions Available</td>
                                </tr>
                            )}
                            {pagedRows.map((row, index) => {
                                const isRowEditing = editingRowId === row.id;
                                return (
                                    <tr className='text-left border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{indexOfFirst + index + 1}</td>
                                        {!isRowEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.department || '-'}</td>
                                                <td className='py-3 px-2'>{row.description || '-'}</td>
                                                <td className='py-3 px-2'>{row.hodName || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openActionRowId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleActionMenu(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => handleStartEdit(row.id)}>
                                                                    <PencilIcon className={'w-5 h-5 text-text-color'} />
                                                                </div>
                                                                <div className='cursor-pointer' onClick={() => handleDeleteRow(row)}>
                                                                    <TrashIcon className={'w-5 h-5 text-text-color'} />
                                                                </div>
                                                                <div className='cursor-pointer' onClick={() => setOpenActionRowId(null)}>
                                                                    <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'>
                                                    <FormInput
                                                        type="text"
                                                        name="department"
                                                        formValues={{ department: row.department }}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormTextArea
                                                        type="text"
                                                        name="description"
                                                        formValues={{ description: row.description }}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormSelect
                                                        name="hodId"
                                                        formValues={{ hodId: row.hodId }}
                                                        options={hodOptions}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEdit}>
                                                            <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
                                                        </div>
                                                        <div className={'cursor-pointer'} onClick={handleCloseEdit}>
                                                            <XMarkIcon className={'w-5 h-5 text-text-color'} />
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
                    {functionsRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button
                                onClick={handlePreviousPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Applicable Laws and Regulations */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Applicable Laws and Regulations</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={handleAddNewLawClick} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={handleAddNewLawClick}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '5%' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '30%' }}>Law</th>
                                <th className='py-3 px-2' style={{ width: '60%' }}>Jurisdiction</th>
                                <th className='py-3 px-2' style={{ width: '5%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewLawRow && (
                                <tr className='text-left border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput
                                            type="text"
                                            name="law"
                                            formValues={{ law: newLawRow.law }}
                                            onChange={handleNewLawChange}
                                        />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormTextArea
                                            type="text"
                                            name="jurisdiction"
                                            formValues={{ jurisdiction: newLawRow.jurisdiction }}
                                            onChange={handleNewLawChange}
                                        />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNewLaw}>
                                                <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
                                            </div>
                                            <div className={'cursor-pointer'} onClick={handleCancelNewLaw}>
                                                <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {lawsRows.length === 0 && !showNewLawRow && (
                                <tr>
                                    <td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Laws Available</td>
                                </tr>
                            )}
                            {pagedLawsRows.map((row, index) => {
                                const isRowEditing = editingLawRowId === row.id;
                                return (
                                    <tr className='text-left border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{lawsIndexOfFirst + index + 1}</td>
                                        {!isRowEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.law || '-'}</td>
                                                <td className='py-3 px-2'>{row.jurisdiction || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openLawActionRowId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleLawActionMenu(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => handleStartEditLaw(row.id)}>
                                                                    <PencilIcon className={'w-5 h-5 text-text-color'} />
                                                                </div>
                                                                <div className='cursor-pointer' onClick={() => handleDeleteLawRow(row)}>
                                                                    <TrashIcon className={'w-5 h-5 text-text-color'} />
                                                                </div>
                                                                <div className='cursor-pointer' onClick={() => setOpenLawActionRowId(null)}>
                                                                    <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'>
                                                    <FormInput
                                                        type="text"
                                                        name="law"
                                                        formValues={{ law: row.law }}
                                                        onChange={(e) => handleEditLawChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormTextArea
                                                        type="text"
                                                        name="jurisdiction"
                                                        formValues={{ jurisdiction: row.jurisdiction }}
                                                        onChange={(e) => handleEditLawChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEditLaw}>
                                                            <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
                                                        </div>
                                                        <div className={'cursor-pointer'} onClick={handleCloseEditLaw}>
                                                            <XMarkIcon className={'w-5 h-5 text-text-color'} />
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
                    {lawsRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button
                                onClick={handlePreviousLawsPage}
                                className={`p-2 rounded-full bg-gray-200 ${lawsCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                disabled={lawsCurrentPage === 1}
                            >
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {lawsCurrentPage} of {lawsTotalPages}</span>
                            <button
                                onClick={handleNextLawsPage}
                                className={`p-2 rounded-full bg-gray-200 ${lawsCurrentPage === lawsTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                disabled={lawsCurrentPage === lawsTotalPages}
                            >
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                message={
                    itemToDelete
                        ? `Do you want to delete "${itemToDelete.type === "function" ? itemToDelete.department : itemToDelete.law}"?`
                        : ""
                }
            />
        </div>
    );
};

export default ContextOverview;
