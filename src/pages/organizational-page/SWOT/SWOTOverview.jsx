import React, { useState } from 'react';
import FormInput from '../../../components/FormInput.jsx';
import FormTextArea from '../../../components/FormTextArea.jsx'
import { PencilIcon, EllipsisVerticalIcon, CheckBadgeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";

const SWOTOverview = () => {
    // Initial purpose text
    const initialText = `This document defines the purpose of LifeServ's Quality Management System (QMS) in accordance with the requirements of ISO 9001:2015. It aims to establish a clear understanding of what the QMS covers, ensuring that all relevant activities and processes are managed to consistently meet customer and applicable statutory and regulatory requirements, and to enhance customer satisfaction through the effective application of the system, including processes for improvement.`;

    const [formValues, setFormValues] = useState({
        purpose: initialText,
        name: "",
        contactInformation: "",
        address: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // SWOT sections - Strengths, Weaknesses, Opportunities, Threats
    // Strengths
    const [strengthsRows, setStrengthsRows] = useState([
        { id: 1, title: 'Skilled Workforce', description: 'Highly trained and motivated employees' },
        { id: 2, title: 'Strong Brand', description: 'Well-recognized brand with loyal customers' },
        { id: 3, title: 'Efficient Processes', description: 'Lean operations and continuous improvement' },
    ]);
    const [showNewStrengthRow, setShowNewStrengthRow] = useState(false);
    const [newStrengthRow, setNewStrengthRow] = useState({ title: '', description: '' });
    const [editingStrengthId, setEditingStrengthId] = useState(null);
    const [openStrengthActionId, setOpenStrengthActionId] = useState(null);
    const [strengthsPage, setStrengthsPage] = useState(1);

    // Weaknesses
    const [weaknessesRows, setWeaknessesRows] = useState([
        { id: 11, title: 'Legacy Systems', description: 'Outdated tools slow development' },
        { id: 12, title: 'Limited Budget', description: 'Resource constraints for new initiatives' },
    ]);
    const [showNewWeaknessRow, setShowNewWeaknessRow] = useState(false);
    const [newWeaknessRow, setNewWeaknessRow] = useState({ title: '', description: '' });
    const [editingWeaknessId, setEditingWeaknessId] = useState(null);
    const [openWeaknessActionId, setOpenWeaknessActionId] = useState(null);
    const [weaknessesPage, setWeaknessesPage] = useState(1);

    // Opportunities
    const [opportunitiesRows, setOpportunitiesRows] = useState([
        { id: 21, title: 'New Markets', description: 'Expand into emerging regions' },
        { id: 22, title: 'Partnerships', description: 'Collaborate with strategic partners' },
    ]);
    const [showNewOpportunityRow, setShowNewOpportunityRow] = useState(false);
    const [newOpportunityRow, setNewOpportunityRow] = useState({ title: '', description: '' });
    const [editingOpportunityId, setEditingOpportunityId] = useState(null);
    const [openOpportunityActionId, setOpenOpportunityActionId] = useState(null);
    const [opportunitiesPage, setOpportunitiesPage] = useState(1);

    // Threats
    const [threatsRows, setThreatsRows] = useState([
        { id: 31, title: 'Competition', description: 'Aggressive competitors in key segments' },
        { id: 32, title: 'Regulatory Changes', description: 'New laws may increase costs' },
    ]);
    const [showNewThreatRow, setShowNewThreatRow] = useState(false);
    const [newThreatRow, setNewThreatRow] = useState({ title: '', description: '' });
    const [editingThreatId, setEditingThreatId] = useState(null);
    const [openThreatActionId, setOpenThreatActionId] = useState(null);
    const [threatsPage, setThreatsPage] = useState(1);

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

    // Shared helpers for building simple CRUD per section
    const pageSize = 5;

    // Strengths handlers
    const handleAddNewStrength = () => { setShowNewStrengthRow(true); setNewStrengthRow({ title: '', description: '' }); };
    const handleCancelNewStrength = () => { setShowNewStrengthRow(false); setNewStrengthRow({ title: '', description: '' }); };
    const handleNewStrengthChange = ({ target: { name, value } }) => setNewStrengthRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewStrength = () => {
        if (!newStrengthRow.title || !newStrengthRow.description) return;
        setStrengthsRows(prev => [...prev, { id: Date.now(), ...newStrengthRow }]);
        setShowNewStrengthRow(false);
        setNewStrengthRow({ title: '', description: '' });
    };
    const toggleStrengthActions = (id) => setOpenStrengthActionId(prev => prev === id ? null : id);
    const handleStartEditStrength = (id) => { setEditingStrengthId(id); setOpenStrengthActionId(null); };
    const handleEditStrengthChange = (id, { target: { name, value } }) => setStrengthsRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditStrength = () => setEditingStrengthId(null);
    const handleCloseEditStrength = () => setEditingStrengthId(null);
    const handleDeleteStrength = (id) => { setStrengthsRows(prev => prev.filter(r => r.id !== id)); if (editingStrengthId === id) setEditingStrengthId(null); if (openStrengthActionId === id) setOpenStrengthActionId(null); };
    const strengthsTotalPages = strengthsRows.length ? Math.ceil(strengthsRows.length / pageSize) : 1;
    const strengthsIndexOfLast = strengthsPage * pageSize; const strengthsIndexOfFirst = strengthsIndexOfLast - pageSize; const pagedStrengths = strengthsRows.slice(strengthsIndexOfFirst, strengthsIndexOfLast);
    const handleNextStrengths = () => { if (strengthsPage < strengthsTotalPages) setStrengthsPage(strengthsPage + 1); };
    const handlePreviousStrengths = () => { if (strengthsPage > 1) setStrengthsPage(strengthsPage - 1); };

    // Weaknesses handlers
    const handleAddNewWeakness = () => { setShowNewWeaknessRow(true); setNewWeaknessRow({ title: '', description: '' }); };
    const handleCancelNewWeakness = () => { setShowNewWeaknessRow(false); setNewWeaknessRow({ title: '', description: '' }); };
    const handleNewWeaknessChange = ({ target: { name, value } }) => setNewWeaknessRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewWeakness = () => {
        if (!newWeaknessRow.title || !newWeaknessRow.description) return;
        setWeaknessesRows(prev => [...prev, { id: Date.now(), ...newWeaknessRow }]);
        setShowNewWeaknessRow(false);
        setNewWeaknessRow({ title: '', description: '' });
    };
    const toggleWeaknessActions = (id) => setOpenWeaknessActionId(prev => prev === id ? null : id);
    const handleStartEditWeakness = (id) => { setEditingWeaknessId(id); setOpenWeaknessActionId(null); };
    const handleEditWeaknessChange = (id, { target: { name, value } }) => setWeaknessesRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditWeakness = () => setEditingWeaknessId(null);
    const handleCloseEditWeakness = () => setEditingWeaknessId(null);
    const handleDeleteWeakness = (id) => { setWeaknessesRows(prev => prev.filter(r => r.id !== id)); if (editingWeaknessId === id) setEditingWeaknessId(null); if (openWeaknessActionId === id) setOpenWeaknessActionId(null); };
    const weaknessesTotalPages = weaknessesRows.length ? Math.ceil(weaknessesRows.length / pageSize) : 1;
    const weaknessesIndexOfLast = weaknessesPage * pageSize; const weaknessesIndexOfFirst = weaknessesIndexOfLast - pageSize; const pagedWeaknesses = weaknessesRows.slice(weaknessesIndexOfFirst, weaknessesIndexOfLast);
    const handleNextWeaknesses = () => { if (weaknessesPage < weaknessesTotalPages) setWeaknessesPage(weaknessesPage + 1); };
    const handlePreviousWeaknesses = () => { if (weaknessesPage > 1) setWeaknessesPage(weaknessesPage - 1); };

    // Opportunities handlers
    const handleAddNewOpportunity = () => { setShowNewOpportunityRow(true); setNewOpportunityRow({ title: '', description: '' }); };
    const handleCancelNewOpportunity = () => { setShowNewOpportunityRow(false); setNewOpportunityRow({ title: '', description: '' }); };
    const handleNewOpportunityChange = ({ target: { name, value } }) => setNewOpportunityRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewOpportunity = () => {
        if (!newOpportunityRow.title || !newOpportunityRow.description) return;
        setOpportunitiesRows(prev => [...prev, { id: Date.now(), ...newOpportunityRow }]);
        setShowNewOpportunityRow(false);
        setNewOpportunityRow({ title: '', description: '' });
    };
    const toggleOpportunityActions = (id) => setOpenOpportunityActionId(prev => prev === id ? null : id);
    const handleStartEditOpportunity = (id) => { setEditingOpportunityId(id); setOpenOpportunityActionId(null); };
    const handleEditOpportunityChange = (id, { target: { name, value } }) => setOpportunitiesRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditOpportunity = () => setEditingOpportunityId(null);
    const handleCloseEditOpportunity = () => setEditingOpportunityId(null);
    const handleDeleteOpportunity = (id) => { setOpportunitiesRows(prev => prev.filter(r => r.id !== id)); if (editingOpportunityId === id) setEditingOpportunityId(null); if (openOpportunityActionId === id) setOpenOpportunityActionId(null); };
    const opportunitiesTotalPages = opportunitiesRows.length ? Math.ceil(opportunitiesRows.length / pageSize) : 1;
    const opportunitiesIndexOfLast = opportunitiesPage * pageSize; const opportunitiesIndexOfFirst = opportunitiesIndexOfLast - pageSize; const pagedOpportunities = opportunitiesRows.slice(opportunitiesIndexOfFirst, opportunitiesIndexOfLast);
    const handleNextOpportunities = () => { if (opportunitiesPage < opportunitiesTotalPages) setOpportunitiesPage(opportunitiesPage + 1); };
    const handlePreviousOpportunities = () => { if (opportunitiesPage > 1) setOpportunitiesPage(opportunitiesPage - 1); };

    // Threats handlers
    const handleAddNewThreat = () => { setShowNewThreatRow(true); setNewThreatRow({ title: '', description: '' }); };
    const handleCancelNewThreat = () => { setShowNewThreatRow(false); setNewThreatRow({ title: '', description: '' }); };
    const handleNewThreatChange = ({ target: { name, value } }) => setNewThreatRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewThreat = () => {
        if (!newThreatRow.title || !newThreatRow.description) return;
        setThreatsRows(prev => [...prev, { id: Date.now(), ...newThreatRow }]);
        setShowNewThreatRow(false);
        setNewThreatRow({ title: '', description: '' });
    };
    const toggleThreatActions = (id) => setOpenThreatActionId(prev => prev === id ? null : id);
    const handleStartEditThreat = (id) => { setEditingThreatId(id); setOpenThreatActionId(null); };
    const handleEditThreatChange = (id, { target: { name, value } }) => setThreatsRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditThreat = () => setEditingThreatId(null);
    const handleCloseEditThreat = () => setEditingThreatId(null);
    const handleDeleteThreat = (id) => { setThreatsRows(prev => prev.filter(r => r.id !== id)); if (editingThreatId === id) setEditingThreatId(null); if (openThreatActionId === id) setOpenThreatActionId(null); };
    const threatsTotalPages = threatsRows.length ? Math.ceil(threatsRows.length / pageSize) : 1;
    const threatsIndexOfLast = threatsPage * pageSize; const threatsIndexOfFirst = threatsIndexOfLast - pageSize; const pagedThreats = threatsRows.slice(threatsIndexOfFirst, threatsIndexOfLast);
    const handleNextThreats = () => { if (threatsPage < threatsTotalPages) setThreatsPage(threatsPage + 1); };
    const handlePreviousThreats = () => { if (threatsPage > 1) setThreatsPage(threatsPage - 1); };

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

            

            {/* Strengths */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Strengths</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={handleAddNewStrength} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={handleAddNewStrength}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                        <tr className='text-left text-secondary-grey border-b border-gray-200'>
                            <th className='py-3 px-2 w-10'>#</th>
                            <th className='py-3 px-2'>Title</th>
                            <th className='py-3 px-2'>Description</th>
                            <th className='py-3 px-2'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewStrengthRow && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'>
                                    <FormInput type="text" name="title" formValues={{ title: newStrengthRow.title }} onChange={handleNewStrengthChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <FormTextArea type="text" name="description" formValues={{ description: newStrengthRow.description }} onChange={handleNewStrengthChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={handleSaveNewStrength}>
                                            <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                        <div className={'cursor-pointer'} onClick={handleCancelNewStrength}>
                                            <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {strengthsRows.length === 0 && !showNewStrengthRow && (
                            <tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Strengths Available</td></tr>
                        )}
                        {pagedStrengths.map((row, index) => {
                            const isEditing = editingStrengthId === row.id;
                            return (
                                <tr className='border-b border-gray-200' key={row.id}>
                                    <td className='py-3 px-2'>{strengthsIndexOfFirst + index + 1}</td>
                                    {!isEditing ? (
                                        <>
                                            <td className='py-3 px-2'>{row.title || '-'}</td>
                                            <td className='py-3 px-2'>{row.description || '-'}</td>
                                            <td className='py-3 px-2'>
                                                <div className='flex items-center gap-3'>
                                                    {openStrengthActionId !== row.id ? (
                                                        <div className='cursor-pointer inline-flex' onClick={() => toggleStrengthActions(row.id)}>
                                                            <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className='cursor-pointer' onClick={() => handleStartEditStrength(row.id)}>
                                                                <PencilIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => handleDeleteStrength(row.id)}>
                                                                <TrashIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => setOpenStrengthActionId(null)}>
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
                                                <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditStrengthChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditStrengthChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={handleDoneEditStrength}>
                                                        <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                                    </div>
                                                    <div className={'cursor-pointer'} onClick={handleCloseEditStrength}>
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
                    {strengthsRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={handlePreviousStrengths} className={`p-2 rounded-full bg-gray-200 ${strengthsPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={strengthsPage === 1}>
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {strengthsPage} of {strengthsTotalPages}</span>
                            <button onClick={handleNextStrengths} className={`p-2 rounded-full bg-gray-200 ${strengthsPage === strengthsTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={strengthsPage === strengthsTotalPages}>
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Weaknesses */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Weaknesses</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={handleAddNewWeakness} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={handleAddNewWeakness}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                        <tr className='text-left text-secondary-grey border-b border-gray-200'>
                            <th className='py-3 px-2 w-10'>#</th>
                            <th className='py-3 px-2'>Title</th>
                            <th className='py-3 px-2'>Description</th>
                            <th className='py-3 px-2'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewWeaknessRow && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'>
                                    <FormInput type="text" name="title" formValues={{ title: newWeaknessRow.title }} onChange={handleNewWeaknessChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <FormTextArea type="text" name="description" formValues={{ description: newWeaknessRow.description }} onChange={handleNewWeaknessChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={handleSaveNewWeakness}>
                                            <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                        <div className={'cursor-pointer'} onClick={handleCancelNewWeakness}>
                                            <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {weaknessesRows.length === 0 && !showNewWeaknessRow && (
                            <tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Weaknesses Available</td></tr>
                        )}
                        {pagedWeaknesses.map((row, index) => {
                            const isEditing = editingWeaknessId === row.id;
                            return (
                                <tr className='border-b border-gray-200' key={row.id}>
                                    <td className='py-3 px-2'>{weaknessesIndexOfFirst + index + 1}</td>
                                    {!isEditing ? (
                                        <>
                                            <td className='py-3 px-2'>{row.title || '-'}</td>
                                            <td className='py-3 px-2'>{row.description || '-'}</td>
                                            <td className='py-3 px-2'>
                                                <div className='flex items-center gap-3'>
                                                    {openWeaknessActionId !== row.id ? (
                                                        <div className='cursor-pointer inline-flex' onClick={() => toggleWeaknessActions(row.id)}>
                                                            <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className='cursor-pointer' onClick={() => handleStartEditWeakness(row.id)}>
                                                                <PencilIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => handleDeleteWeakness(row.id)}>
                                                                <TrashIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => setOpenWeaknessActionId(null)}>
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
                                                <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditWeaknessChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditWeaknessChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={handleDoneEditWeakness}>
                                                        <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                                    </div>
                                                    <div className={'cursor-pointer'} onClick={handleCloseEditWeakness}>
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
                    {weaknessesRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={handlePreviousWeaknesses} className={`p-2 rounded-full bg-gray-200 ${weaknessesPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={weaknessesPage === 1}>
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {weaknessesPage} of {weaknessesTotalPages}</span>
                            <button onClick={handleNextWeaknesses} className={`p-2 rounded-full bg-gray-200 ${weaknessesPage === weaknessesTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={weaknessesPage === weaknessesTotalPages}>
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Opportunities */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Opportunities</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={handleAddNewOpportunity} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={handleAddNewOpportunity}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                        <tr className='text-left text-secondary-grey border-b border-gray-200'>
                            <th className='py-3 px-2 w-10'>#</th>
                            <th className='py-3 px-2'>Title</th>
                            <th className='py-3 px-2'>Description</th>
                            <th className='py-3 px-2'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewOpportunityRow && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'>
                                    <FormInput type="text" name="title" formValues={{ title: newOpportunityRow.title }} onChange={handleNewOpportunityChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <FormTextArea type="text" name="description" formValues={{ description: newOpportunityRow.description }} onChange={handleNewOpportunityChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={handleSaveNewOpportunity}>
                                            <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                        <div className={'cursor-pointer'} onClick={handleCancelNewOpportunity}>
                                            <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {opportunitiesRows.length === 0 && !showNewOpportunityRow && (
                            <tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Opportunities Available</td></tr>
                        )}
                        {pagedOpportunities.map((row, index) => {
                            const isEditing = editingOpportunityId === row.id;
                            return (
                                <tr className='border-b border-gray-200' key={row.id}>
                                    <td className='py-3 px-2'>{opportunitiesIndexOfFirst + index + 1}</td>
                                    {!isEditing ? (
                                        <>
                                            <td className='py-3 px-2'>{row.title || '-'}</td>
                                            <td className='py-3 px-2'>{row.description || '-'}</td>
                                            <td className='py-3 px-2'>
                                                <div className='flex items-center gap-3'>
                                                    {openOpportunityActionId !== row.id ? (
                                                        <div className='cursor-pointer inline-flex' onClick={() => toggleOpportunityActions(row.id)}>
                                                            <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className='cursor-pointer' onClick={() => handleStartEditOpportunity(row.id)}>
                                                                <PencilIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => handleDeleteOpportunity(row.id)}>
                                                                <TrashIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => setOpenOpportunityActionId(null)}>
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
                                                <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditOpportunityChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditOpportunityChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={handleDoneEditOpportunity}>
                                                        <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                                    </div>
                                                    <div className={'cursor-pointer'} onClick={handleCloseEditOpportunity}>
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
                    {opportunitiesRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={handlePreviousOpportunities} className={`p-2 rounded-full bg-gray-200 ${opportunitiesPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={opportunitiesPage === 1}>
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {opportunitiesPage} of {opportunitiesTotalPages}</span>
                            <button onClick={handleNextOpportunities} className={`p-2 rounded-full bg-gray-200 ${opportunitiesPage === opportunitiesTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={opportunitiesPage === opportunitiesTotalPages}>
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Threats */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Threats</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={handleAddNewThreat} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={handleAddNewThreat}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                        <tr className='text-left text-secondary-grey border-b border-gray-200'>
                            <th className='py-3 px-2 w-10'>#</th>
                            <th className='py-3 px-2'>Title</th>
                            <th className='py-3 px-2'>Description</th>
                            <th className='py-3 px-2'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewThreatRow && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'>
                                    <FormInput type="text" name="title" formValues={{ title: newThreatRow.title }} onChange={handleNewThreatChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <FormTextArea type="text" name="description" formValues={{ description: newThreatRow.description }} onChange={handleNewThreatChange} />
                                </td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={handleSaveNewThreat}>
                                            <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                        <div className={'cursor-pointer'} onClick={handleCancelNewThreat}>
                                            <XMarkIcon className={'w-5 h-5 text-text-color'} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {threatsRows.length === 0 && !showNewThreatRow && (
                            <tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Threats Available</td></tr>
                        )}
                        {pagedThreats.map((row, index) => {
                            const isEditing = editingThreatId === row.id;
                            return (
                                <tr className='border-b border-gray-200' key={row.id}>
                                    <td className='py-3 px-2'>{threatsIndexOfFirst + index + 1}</td>
                                    {!isEditing ? (
                                        <>
                                            <td className='py-3 px-2'>{row.title || '-'}</td>
                                            <td className='py-3 px-2'>{row.description || '-'}</td>
                                            <td className='py-3 px-2'>
                                                <div className='flex items-center gap-3'>
                                                    {openThreatActionId !== row.id ? (
                                                        <div className='cursor-pointer inline-flex' onClick={() => toggleThreatActions(row.id)}>
                                                            <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className='cursor-pointer' onClick={() => handleStartEditThreat(row.id)}>
                                                                <PencilIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => handleDeleteThreat(row.id)}>
                                                                <TrashIcon className={'w-5 h-5 text-text-color'} />
                                                            </div>
                                                            <div className='cursor-pointer' onClick={() => setOpenThreatActionId(null)}>
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
                                                <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditThreatChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditThreatChange(row.id, e)} />
                                            </td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={handleDoneEditThreat}>
                                                        <CheckBadgeIcon className={'w-5 h-5 text-text-color'} />
                                                    </div>
                                                    <div className={'cursor-pointer'} onClick={handleCloseEditThreat}>
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
                    {threatsRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={handlePreviousThreats} className={`p-2 rounded-full bg-gray-200 ${threatsPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={threatsPage === 1}>
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {threatsPage} of {threatsTotalPages}</span>
                            <button onClick={handleNextThreats} className={`p-2 rounded-full bg-gray-200 ${threatsPage === threatsTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={threatsPage === threatsTotalPages}>
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SWOTOverview;
