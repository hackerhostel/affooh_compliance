import React, { useState } from 'react';
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import { PencilIcon, EllipsisVerticalIcon, CheckBadgeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";

const ContextOverview = () => {
    // Initial purpose text
    const initialText = `This document defines the purpose of LifeServ's Quality Management System (QMS) in accordance with the requirements of ISO 9001:2015. It aims to establish a clear understanding of what the QMS covers, ensuring that all relevant activities and processes are managed to consistently meet customer and applicable statutory and regulatory requirements, and to enhance customer satisfaction through the effective application of the system, including processes for improvement.`;

    const [formValues, setFormValues] = useState({
        purpose: initialText,
        name: "",
        contactInformation: "",
        address: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // Functions table state
    const [functionsRows, setFunctionsRows] = useState([
        { id: 1, department: 'Quality', description: 'Manage QMS and audits', hod: 'Alice Johnson' },
        { id: 2, department: 'Operations', description: 'Oversee daily operations', hod: 'Bob Smith' },
        { id: 3, department: 'HR', description: 'Handle recruitment and training', hod: 'Carol Lee' },
    ]);
    const [showNewFunctionRow, setShowNewFunctionRow] = useState(false);
    const [newFunctionRow, setNewFunctionRow] = useState({ department: '', description: '', hod: '' });
    const [editingRowId, setEditingRowId] = useState(null);
    const [openActionRowId, setOpenActionRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Applicable Laws and Regulations state
    const [lawsRows, setLawsRows] = useState([
        { id: 101, law: 'ISO 9001:2015', jurisdiction: 'International' },
        { id: 102, law: 'OSHA Act', jurisdiction: 'United States' },
        { id: 103, law: 'GDPR', jurisdiction: 'European Union' },
    ]);
    const [showNewLawRow, setShowNewLawRow] = useState(false);
    const [newLawRow, setNewLawRow] = useState({ law: '', jurisdiction: '' });
    const [editingLawRowId, setEditingLawRowId] = useState(null);
    const [openLawActionRowId, setOpenLawActionRowId] = useState(null);
    const [lawsCurrentPage, setLawsCurrentPage] = useState(1);

    // Simple options for Department and HOD selects
    const departmentOptions = getSelectOptions([
        { id: 'Quality', name: 'Quality' },
        { id: 'Operations', name: 'Operations' },
        { id: 'Sales', name: 'Sales' },
        { id: 'HR', name: 'HR' },
    ]);

    const hodOptions = getSelectOptions([
        { id: 'Alice Johnson', name: 'Alice Johnson' },
        { id: 'Bob Smith', name: 'Bob Smith' },
        { id: 'Carol Lee', name: 'Carol Lee' },
    ]);

    const resetNewFunctionRow = () => setNewFunctionRow({ department: '', description: '', hod: '' });

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

    const handleSaveNew = () => {
        if (!newFunctionRow.department || !newFunctionRow.description || !newFunctionRow.hod) {
            return; // Basic guard; UI already shows inputs
        }
        const newRow = {
            id: Date.now(),
            ...newFunctionRow,
        };
        setFunctionsRows(prev => [...prev, newRow]);
        setShowNewFunctionRow(false);
        resetNewFunctionRow();
    };

    const handleDeleteRow = (id) => {
        setFunctionsRows(prev => prev.filter(r => r.id !== id));
        if (editingRowId === id) setEditingRowId(null);
        if (openActionRowId === id) setOpenActionRowId(null);
    };

    const handleStartEdit = (id) => {
        setEditingRowId(id);
        setOpenActionRowId(null);
    };

    const handleCloseEdit = () => {
        setEditingRowId(null);
    };

    const handleEditChange = (id, { target: { name, value } }) => {
        setFunctionsRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    };

    const handleDoneEdit = () => {
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

    const handleSaveNewLaw = () => {
        if (!newLawRow.law || !newLawRow.jurisdiction) return;
        const newRow = { id: Date.now(), ...newLawRow };
        setLawsRows(prev => [...prev, newRow]);
        setShowNewLawRow(false);
        setNewLawRow({ law: '', jurisdiction: '' });
    };

    const handleDeleteLawRow = (id) => {
        setLawsRows(prev => prev.filter(r => r.id !== id));
        if (editingLawRowId === id) setEditingLawRowId(null);
        if (openLawActionRowId === id) setOpenLawActionRowId(null);
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

    const handleDoneEditLaw = () => {
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
    const handleChange = (name, value) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            {/* Top Buttons */}
            <div className='flex justify-end items-center mt-4 space-x-2'>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Archived</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Approved</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
            </div>

            {/* overview */}
            <div className='mt-6'>
                <span className='text-lg font-semibold'>Overview</span>
                <div className='bg-white rounded p-3 mt-2'>
                    <div className='p-2'>
                        <FormTextArea
                            name="purpose"
                            formValues={formValues}
                            onChange={(name, value) => handleChange(name, value)}
                            showLabel={false}
                            className="w-full"
                            rows={5}
                        />
                    </div>
                </div>
            </div>


            {/* company details */}

            <div className='mt-6'>
                <span className='text-lg font-semibold'>Company Details</span>
                <div className='bg-white rounded p-3 mt-2 '>
                    <div  className='flex items-center gap-5'>
                        <label htmlFor="">Company Name</label>
                        <FormInput
                            type="text"
                            name="companyName"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) => handleChange(name, value)}
                            className="w-96 p-2 border rounded-md mt-2 ml-6 bg-slate-100"
                        />
                    </div>

                     <div className='flex items-center gap-5'>
                        <label htmlFor="">Company Address</label>
                        <FormInput
                            type="text"
                            name="address"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) => handleChange(name, value)}
                            className="w-96 p-2 border rounded-md mt-2 ml-2 bg-slate-100"
                        />
                    </div>

                     <div className='flex items-center gap-5'>
                        <label htmlFor="">Contact Information</label>
                        <FormInput
                            type="text"
                            name="contactInformation"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) => handleChange(name, value)}
                            className="w-96 p-2 border rounded-md mt-2 bg-slate-100"
                        />
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
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2 w-10'>#</th>
                                <th className='py-3 px-2'>Department</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2'>HOD</th>
                                <th className='py-3 px-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewFunctionRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2 w-48'>
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
                                    <td className='py-3 px-2 w-48'>
                                        <FormSelect
                                            name="hod"
                                            formValues={{ hod: newFunctionRow.hod }}
                                            options={hodOptions}
                                            onChange={handleNewFunctionChange}
                                        />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNew}>
                                                <CheckBadgeIcon className={'w-5 h-5 text-pink-700'} />
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
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{indexOfFirst + index + 1}</td>
                                        {!isRowEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.department || '-'}</td>
                                                <td className='py-3 px-2'>{row.description || '-'}</td>
                                                <td className='py-3 px-2'>{row.hod || '-'}</td>
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
                                                                <div className='cursor-pointer' onClick={() => handleDeleteRow(row.id)}>
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
                                                <td className='py-3 px-2 w-48'>
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
                                                <td className='py-3 px-2 w-48'>
                                                    <FormSelect
                                                        name="hod"
                                                        formValues={{ hod: row.hod }}
                                                        options={hodOptions}
                                                        onChange={(e) => handleEditChange(row.id, e)}
                                                    />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEdit}>
                                                            <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
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
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                        <tr className='text-left text-secondary-grey border-b border-gray-200'>
                            <th className='py-3 px-2 w-10'>#</th>
                            <th className='py-3 px-2'>Law</th>
                            <th className='py-3 px-2'>Jurisdiction</th>
                            <th className='py-3 px-2'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewLawRow && (
                            <tr className='border-b border-gray-200'>
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
                                            <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
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
                                <tr className='border-b border-gray-200' key={row.id}>
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
                                                            <div className='cursor-pointer' onClick={() => handleDeleteLawRow(row.id)}>
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
                                                        <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
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
        </div>
    );
};

export default ContextOverview;
