import React, { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInput.jsx';
import FormTextArea from '../../../components/FormTextArea.jsx'
import { PencilIcon, EllipsisVerticalIcon, CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import useFetchSwot from "../../../hooks/custom-hooks/compliance/useFetchSwot.jsx";
import { createSwot, deleteSwot, updateSwot } from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const SWOTOverview = () => {
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const projectId = selectedProject?.id;
    const { data: swotRows, refetch } = useFetchSwot(projectId);

    // SWOT sections - Strengths, Weaknesses, Opportunities, Threats
    // Strengths
    const [strengthsRows, setStrengthsRows] = useState([]);
    const [showNewStrengthRow, setShowNewStrengthRow] = useState(false);
    const [newStrengthRow, setNewStrengthRow] = useState({ title: '', description: '' });
    const [editingStrengthId, setEditingStrengthId] = useState(null);
    const [openStrengthActionId, setOpenStrengthActionId] = useState(null);
    const [strengthsPage, setStrengthsPage] = useState(1);

    // Weaknesses
    const [weaknessesRows, setWeaknessesRows] = useState([]);
    const [showNewWeaknessRow, setShowNewWeaknessRow] = useState(false);
    const [newWeaknessRow, setNewWeaknessRow] = useState({ title: '', description: '' });
    const [editingWeaknessId, setEditingWeaknessId] = useState(null);
    const [openWeaknessActionId, setOpenWeaknessActionId] = useState(null);
    const [weaknessesPage, setWeaknessesPage] = useState(1);

    // Opportunities
    const [opportunitiesRows, setOpportunitiesRows] = useState([]);
    const [showNewOpportunityRow, setShowNewOpportunityRow] = useState(false);
    const [newOpportunityRow, setNewOpportunityRow] = useState({ title: '', description: '' });
    const [editingOpportunityId, setEditingOpportunityId] = useState(null);
    const [openOpportunityActionId, setOpenOpportunityActionId] = useState(null);
    const [opportunitiesPage, setOpportunitiesPage] = useState(1);

    // Threats
    const [threatsRows, setThreatsRows] = useState([]);
    const [showNewThreatRow, setShowNewThreatRow] = useState(false);
    const [newThreatRow, setNewThreatRow] = useState({ title: '', description: '' });
    const [editingThreatId, setEditingThreatId] = useState(null);
    const [openThreatActionId, setOpenThreatActionId] = useState(null);
    const [threatsPage, setThreatsPage] = useState(1);

    // Delete confirmation state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const rows = swotRows || [];
        setStrengthsRows(rows.filter((row) => row.category === "Strength"));
        setWeaknessesRows(rows.filter((row) => row.category === "Weakness"));
        setOpportunitiesRows(rows.filter((row) => row.category === "Opportunity"));
        setThreatsRows(rows.filter((row) => row.category === "Threat"));
    }, [swotRows]);

    // Shared helpers for building simple CRUD per section
    const pageSize = 5;

    // Strengths handlers
    const handleAddNewStrength = () => { setShowNewStrengthRow(true); setNewStrengthRow({ title: '', description: '' }); };
    const handleCancelNewStrength = () => { setShowNewStrengthRow(false); setNewStrengthRow({ title: '', description: '' }); };
    const handleNewStrengthChange = ({ target: { name, value } }) => setNewStrengthRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewStrength = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newStrengthRow.title || !newStrengthRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createSwot({
                projectID: projectId,
                category: "Strength",
                title: newStrengthRow.title,
                description: newStrengthRow.description,
                displayOrder: strengthsRows.length + 1,
            });
            setShowNewStrengthRow(false);
            setNewStrengthRow({ title: '', description: '' });
            refetch();
            addToast("Strength created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create strength", { appearance: "error" });
        }
    };
    const toggleStrengthActions = (id) => setOpenStrengthActionId(prev => prev === id ? null : id);
    const handleStartEditStrength = (id) => { setEditingStrengthId(id); setOpenStrengthActionId(null); };
    const handleEditStrengthChange = (id, { target: { name, value } }) => setStrengthsRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditStrength = async () => {
        const row = strengthsRows.find((item) => item.id === editingStrengthId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateSwot(row.id, {
                    category: "Strength",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Strength updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update strength", { appearance: "error" });
            }
        }
        setEditingStrengthId(null);
    };
    const handleCloseEditStrength = () => setEditingStrengthId(null);
    const handleDeleteStrength = (row) => {
        setItemToDelete({ ...row, category: "Strength" });
        setIsDeleteDialogOpen(true);
        setOpenStrengthActionId(null);
    };
    const strengthsTotalPages = strengthsRows.length ? Math.ceil(strengthsRows.length / pageSize) : 1;
    const strengthsIndexOfLast = strengthsPage * pageSize; const strengthsIndexOfFirst = strengthsIndexOfLast - pageSize; const pagedStrengths = strengthsRows.slice(strengthsIndexOfFirst, strengthsIndexOfLast);
    const handleNextStrengths = () => { if (strengthsPage < strengthsTotalPages) setStrengthsPage(strengthsPage + 1); };
    const handlePreviousStrengths = () => { if (strengthsPage > 1) setStrengthsPage(strengthsPage - 1); };

    // Weaknesses handlers
    const handleAddNewWeakness = () => { setShowNewWeaknessRow(true); setNewWeaknessRow({ title: '', description: '' }); };
    const handleCancelNewWeakness = () => { setShowNewWeaknessRow(false); setNewWeaknessRow({ title: '', description: '' }); };
    const handleNewWeaknessChange = ({ target: { name, value } }) => setNewWeaknessRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewWeakness = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newWeaknessRow.title || !newWeaknessRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createSwot({
                projectID: projectId,
                category: "Weakness",
                title: newWeaknessRow.title,
                description: newWeaknessRow.description,
                displayOrder: weaknessesRows.length + 1,
            });
            setShowNewWeaknessRow(false);
            setNewWeaknessRow({ title: '', description: '' });
            refetch();
            addToast("Weakness created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create weakness", { appearance: "error" });
        }
    };
    const toggleWeaknessActions = (id) => setOpenWeaknessActionId(prev => prev === id ? null : id);
    const handleStartEditWeakness = (id) => { setEditingWeaknessId(id); setOpenWeaknessActionId(null); };
    const handleEditWeaknessChange = (id, { target: { name, value } }) => setWeaknessesRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditWeakness = async () => {
        const row = weaknessesRows.find((item) => item.id === editingWeaknessId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateSwot(row.id, {
                    category: "Weakness",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Weakness updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update weakness", { appearance: "error" });
            }
        }
        setEditingWeaknessId(null);
    };
    const handleCloseEditWeakness = () => setEditingWeaknessId(null);
    const handleDeleteWeakness = (row) => {
        setItemToDelete({ ...row, category: "Weakness" });
        setIsDeleteDialogOpen(true);
        setOpenWeaknessActionId(null);
    };
    const weaknessesTotalPages = weaknessesRows.length ? Math.ceil(weaknessesRows.length / pageSize) : 1;
    const weaknessesIndexOfLast = weaknessesPage * pageSize; const weaknessesIndexOfFirst = weaknessesIndexOfLast - pageSize; const pagedWeaknesses = weaknessesRows.slice(weaknessesIndexOfFirst, weaknessesIndexOfLast);
    const handleNextWeaknesses = () => { if (weaknessesPage < weaknessesTotalPages) setWeaknessesPage(weaknessesPage + 1); };
    const handlePreviousWeaknesses = () => { if (weaknessesPage > 1) setWeaknessesPage(weaknessesPage - 1); };

    // Opportunities handlers
    const handleAddNewOpportunity = () => { setShowNewOpportunityRow(true); setNewOpportunityRow({ title: '', description: '' }); };
    const handleCancelNewOpportunity = () => { setShowNewOpportunityRow(false); setNewOpportunityRow({ title: '', description: '' }); };
    const handleNewOpportunityChange = ({ target: { name, value } }) => setNewOpportunityRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewOpportunity = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newOpportunityRow.title || !newOpportunityRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createSwot({
                projectID: projectId,
                category: "Opportunity",
                title: newOpportunityRow.title,
                description: newOpportunityRow.description,
                displayOrder: opportunitiesRows.length + 1,
            });
            setShowNewOpportunityRow(false);
            setNewOpportunityRow({ title: '', description: '' });
            refetch();
            addToast("Opportunity created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create opportunity", { appearance: "error" });
        }
    };
    const toggleOpportunityActions = (id) => setOpenOpportunityActionId(prev => prev === id ? null : id);
    const handleStartEditOpportunity = (id) => { setEditingOpportunityId(id); setOpenOpportunityActionId(null); };
    const handleEditOpportunityChange = (id, { target: { name, value } }) => setOpportunitiesRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditOpportunity = async () => {
        const row = opportunitiesRows.find((item) => item.id === editingOpportunityId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateSwot(row.id, {
                    category: "Opportunity",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Opportunity updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update opportunity", { appearance: "error" });
            }
        }
        setEditingOpportunityId(null);
    };
    const handleCloseEditOpportunity = () => setEditingOpportunityId(null);
    const handleDeleteOpportunity = (row) => {
        setItemToDelete({ ...row, category: "Opportunity" });
        setIsDeleteDialogOpen(true);
        setOpenOpportunityActionId(null);
    };
    const opportunitiesTotalPages = opportunitiesRows.length ? Math.ceil(opportunitiesRows.length / pageSize) : 1;
    const opportunitiesIndexOfLast = opportunitiesPage * pageSize; const opportunitiesIndexOfFirst = opportunitiesIndexOfLast - pageSize; const pagedOpportunities = opportunitiesRows.slice(opportunitiesIndexOfFirst, opportunitiesIndexOfLast);
    const handleNextOpportunities = () => { if (opportunitiesPage < opportunitiesTotalPages) setOpportunitiesPage(opportunitiesPage + 1); };
    const handlePreviousOpportunities = () => { if (opportunitiesPage > 1) setOpportunitiesPage(opportunitiesPage - 1); };

    // Threats handlers
    const handleAddNewThreat = () => { setShowNewThreatRow(true); setNewThreatRow({ title: '', description: '' }); };
    const handleCancelNewThreat = () => { setShowNewThreatRow(false); setNewThreatRow({ title: '', description: '' }); };
    const handleNewThreatChange = ({ target: { name, value } }) => setNewThreatRow(prev => ({ ...prev, [name]: value }));
    const handleSaveNewThreat = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newThreatRow.title || !newThreatRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createSwot({
                projectID: projectId,
                category: "Threat",
                title: newThreatRow.title,
                description: newThreatRow.description,
                displayOrder: threatsRows.length + 1,
            });
            setShowNewThreatRow(false);
            setNewThreatRow({ title: '', description: '' });
            refetch();
            addToast("Threat created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create threat", { appearance: "error" });
        }
    };
    const toggleThreatActions = (id) => setOpenThreatActionId(prev => prev === id ? null : id);
    const handleStartEditThreat = (id) => { setEditingThreatId(id); setOpenThreatActionId(null); };
    const handleEditThreatChange = (id, { target: { name, value } }) => setThreatsRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const handleDoneEditThreat = async () => {
        const row = threatsRows.find((item) => item.id === editingThreatId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateSwot(row.id, {
                    category: "Threat",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Threat updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update threat", { appearance: "error" });
            }
        }
        setEditingThreatId(null);
    };
    const handleCloseEditThreat = () => setEditingThreatId(null);
    const handleDeleteThreat = (row) => {
        setItemToDelete({ ...row, category: "Threat" });
        setIsDeleteDialogOpen(true);
        setOpenThreatActionId(null);
    };
    const threatsTotalPages = threatsRows.length ? Math.ceil(threatsRows.length / pageSize) : 1;
    const threatsIndexOfLast = threatsPage * pageSize; const threatsIndexOfFirst = threatsIndexOfLast - pageSize; const pagedThreats = threatsRows.slice(threatsIndexOfFirst, threatsIndexOfLast);
    const handleNextThreats = () => { if (threatsPage < threatsTotalPages) setThreatsPage(threatsPage + 1); };
    const handlePreviousThreats = () => { if (threatsPage > 1) setThreatsPage(threatsPage - 1); };

    // Unified delete confirmation handler
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteSwot(itemToDelete.id);
            refetch();
            // Clear editing and action states based on category
            if (itemToDelete.category === "Strength") {
                if (editingStrengthId === itemToDelete.id) setEditingStrengthId(null);
                if (openStrengthActionId === itemToDelete.id) setOpenStrengthActionId(null);
            } else if (itemToDelete.category === "Weakness") {
                if (editingWeaknessId === itemToDelete.id) setEditingWeaknessId(null);
                if (openWeaknessActionId === itemToDelete.id) setOpenWeaknessActionId(null);
            } else if (itemToDelete.category === "Opportunity") {
                if (editingOpportunityId === itemToDelete.id) setEditingOpportunityId(null);
                if (openOpportunityActionId === itemToDelete.id) setOpenOpportunityActionId(null);
            } else if (itemToDelete.category === "Threat") {
                if (editingThreatId === itemToDelete.id) setEditingThreatId(null);
                if (openThreatActionId === itemToDelete.id) setOpenThreatActionId(null);
            }
            addToast(`${itemToDelete.category} deleted successfully`, { appearance: "success" });
        } catch (error) {
            addToast(`Failed to delete ${itemToDelete.category.toLowerCase()}`, { appearance: "error" });
        }
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
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
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '200px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewStrengthRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="title" formValues={{ title: newStrengthRow.title }} onChange={handleNewStrengthChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormTextArea type="text" name="description" formValues={{ description: newStrengthRow.description }} onChange={handleNewStrengthChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNewStrength}>
                                                <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                                                                <div className='cursor-pointer' onClick={() => handleDeleteStrength(row)}>
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
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditStrengthChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditStrengthChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEditStrength}>
                                                            <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '200px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewWeaknessRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="title" formValues={{ title: newWeaknessRow.title }} onChange={handleNewWeaknessChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormTextArea type="text" name="description" formValues={{ description: newWeaknessRow.description }} onChange={handleNewWeaknessChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNewWeakness}>
                                                <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                                                                <div className='cursor-pointer' onClick={() => handleDeleteWeakness(row)}>
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
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditWeaknessChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditWeaknessChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEditWeakness}>
                                                            <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '200px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewOpportunityRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="title" formValues={{ title: newOpportunityRow.title }} onChange={handleNewOpportunityChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormTextArea type="text" name="description" formValues={{ description: newOpportunityRow.description }} onChange={handleNewOpportunityChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNewOpportunity}>
                                                <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                                                                <div className='cursor-pointer' onClick={() => handleDeleteOpportunity(row)}>
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
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditOpportunityChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditOpportunityChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEditOpportunity}>
                                                            <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '200px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewThreatRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="title" formValues={{ title: newThreatRow.title }} onChange={handleNewThreatChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormTextArea type="text" name="description" formValues={{ description: newThreatRow.description }} onChange={handleNewThreatChange} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={handleSaveNewThreat}>
                                                <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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
                                                                <div className='cursor-pointer' onClick={() => handleDeleteThreat(row)}>
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
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => handleEditThreatChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => handleEditThreatChange(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={handleDoneEditThreat}>
                                                            <CheckCircleIcon className={'w-5 h-5 text-primary-pink'} />
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

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                message={
                    itemToDelete
                        ? `Do you want to delete "${itemToDelete.title}"?`
                        : ""
                }
            />
        </div>
    );
};

export default SWOTOverview;
