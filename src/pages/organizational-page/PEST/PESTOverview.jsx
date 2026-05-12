import React, { useEffect, useState } from 'react';
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import WYSIWYGInput from "../../../components/WYSIWYGInput.jsx";
import { PencilIcon, EllipsisVerticalIcon, CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { selectUser } from "../../../state/slice/authSlice.js";
import useFetchPest from "../../../hooks/custom-hooks/compliance/useFetchPest.jsx";
import { createPest, deletePest, updatePest, createRevisionHistory, createApproval } from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import SaveVersionPopup from "../../../components/SaveVersionPopup.jsx";

const DOCUMENT_TYPE = "PEST";

const PESTOverview = ({ onHistoryRefresh }) => {
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const currentUser = useSelector(selectUser);
    const projectId = selectedProject?.id;
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const handleSaveConfirm = async ({ version, summary }) => {
        if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
        setIsSaving(true);
        try {
            await createRevisionHistory({
                projectId,
                documentType: DOCUMENT_TYPE,
                version,
                summaryOfChanges: summary,
                revisionDate: new Date().toISOString().split("T")[0],
                name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
                status: "draft",
            });
            addToast("Document saved as draft", { appearance: "success" });
            setShowSavePopup(false);
            if (onHistoryRefresh) onHistoryRefresh();
        } catch {
            addToast("Failed to save document", { appearance: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleApprove = async () => {
        if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
        setIsApproving(true);
        try {
            await createApproval({
                projectId,
                documentType: DOCUMENT_TYPE,
                approvalDate: new Date().toISOString().split("T")[0],
                status: "approved",
                approver: {
                    id: currentUser?.id,
                    name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
                    position: currentUser?.position || null,
                },
            });
            addToast("Document approved successfully", { appearance: "success" });
            if (onHistoryRefresh) onHistoryRefresh();
        } catch {
            addToast("Failed to approve document", { appearance: "error" });
        } finally {
            setIsApproving(false);
        }
    };
    const { data: pestRows, refetch } = useFetchPest(projectId);

    // PEST sections - Political, Economic, Social, Technological
    // Political
    const [politicalRows, setPoliticalRows] = useState([]);
    const [showNewPolitical, setShowNewPolitical] = useState(false);
    const [newPoliticalRow, setNewPoliticalRow] = useState({ title: '', description: '' });
    const [editingPoliticalId, setEditingPoliticalId] = useState(null);
    const [openPoliticalActionId, setOpenPoliticalActionId] = useState(null);
    const [politicalPage, setPoliticalPage] = useState(1);

    // Economic
    const [economicRows, setEconomicRows] = useState([]);
    const [showNewEconomic, setShowNewEconomic] = useState(false);
    const [newEconomicRow, setNewEconomicRow] = useState({ title: '', description: '' });
    const [editingEconomicId, setEditingEconomicId] = useState(null);
    const [openEconomicActionId, setOpenEconomicActionId] = useState(null);
    const [economicPage, setEconomicPage] = useState(1);

    // Social
    const [socialRows, setSocialRows] = useState([]);
    const [showNewSocial, setShowNewSocial] = useState(false);
    const [newSocialRow, setNewSocialRow] = useState({ title: '', description: '' });
    const [editingSocialId, setEditingSocialId] = useState(null);
    const [openSocialActionId, setOpenSocialActionId] = useState(null);
    const [socialPage, setSocialPage] = useState(1);

    // Technological
    const [techRows, setTechRows] = useState([]);
    const [showNewTech, setShowNewTech] = useState(false);
    const [newTechRow, setNewTechRow] = useState({ title: '', description: '' });
    const [editingTechId, setEditingTechId] = useState(null);
    const [openTechActionId, setOpenTechActionId] = useState(null);
    const [techPage, setTechPage] = useState(1);

    // Delete confirmation state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const rows = pestRows || [];
        setPoliticalRows(rows.filter((row) => row.category === "Political"));
        setEconomicRows(rows.filter((row) => row.category === "Economic"));
        setSocialRows(rows.filter((row) => row.category === "Social"));
        setTechRows(rows.filter((row) => row.category === "Technological"));
    }, [pestRows]);

    // Shared helpers
    const pageSize = 5;

    // Political handlers
    const addPolitical = () => { setShowNewPolitical(true); setNewPoliticalRow({ title: '', description: '' }); };
    const cancelPolitical = () => { setShowNewPolitical(false); setNewPoliticalRow({ title: '', description: '' }); };
    const changeNewPolitical = ({ target: { name, value } }) => setNewPoliticalRow(prev => ({ ...prev, [name]: value }));
    const savePolitical = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newPoliticalRow.title || !newPoliticalRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createPest({
                projectID: projectId,
                category: "Political",
                title: newPoliticalRow.title,
                description: newPoliticalRow.description,
                displayOrder: politicalRows.length + 1,
            });
            setShowNewPolitical(false);
            setNewPoliticalRow({ title: '', description: '' });
            refetch();
            addToast("Political item created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create political item", { appearance: "error" });
        }
    };
    const togglePolitical = (id) => setOpenPoliticalActionId(prev => prev === id ? null : id);
    const startEditPolitical = (id) => { setEditingPoliticalId(id); setOpenPoliticalActionId(null); };
    const changeEditPolitical = (id, { target: { name, value } }) => setPoliticalRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditPolitical = async () => {
        const row = politicalRows.find((item) => item.id === editingPoliticalId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updatePest(row.id, {
                    category: "Political",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Political item updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update political item", { appearance: "error" });
            }
        }
        setEditingPoliticalId(null);
    };
    const closeEditPolitical = () => setEditingPoliticalId(null);
    const deletePoliticalHandler = (row) => {
        setItemToDelete({ ...row, category: "Political" });
        setIsDeleteDialogOpen(true);
        setOpenPoliticalActionId(null);
    };
    const politicalTotalPages = politicalRows.length ? Math.ceil(politicalRows.length / pageSize) : 1;
    const politicalIndexOfLast = politicalPage * pageSize; const politicalIndexOfFirst = politicalIndexOfLast - pageSize; const pagedPolitical = politicalRows.slice(politicalIndexOfFirst, politicalIndexOfLast);
    const nextPolitical = () => { if (politicalPage < politicalTotalPages) setPoliticalPage(politicalPage + 1); };
    const prevPolitical = () => { if (politicalPage > 1) setPoliticalPage(politicalPage - 1); };

    // Economic handlers
    const addEconomic = () => { setShowNewEconomic(true); setNewEconomicRow({ title: '', description: '' }); };
    const cancelEconomic = () => { setShowNewEconomic(false); setNewEconomicRow({ title: '', description: '' }); };
    const changeNewEconomic = ({ target: { name, value } }) => setNewEconomicRow(prev => ({ ...prev, [name]: value }));
    const saveEconomic = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newEconomicRow.title || !newEconomicRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createPest({
                projectID: projectId,
                category: "Economic",
                title: newEconomicRow.title,
                description: newEconomicRow.description,
                displayOrder: economicRows.length + 1,
            });
            setShowNewEconomic(false);
            setNewEconomicRow({ title: '', description: '' });
            refetch();
            addToast("Economic item created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create economic item", { appearance: "error" });
        }
    };
    const toggleEconomic = (id) => setOpenEconomicActionId(prev => prev === id ? null : id);
    const startEditEconomic = (id) => { setEditingEconomicId(id); setOpenEconomicActionId(null); };
    const changeEditEconomic = (id, { target: { name, value } }) => setEconomicRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditEconomic = async () => {
        const row = economicRows.find((item) => item.id === editingEconomicId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updatePest(row.id, {
                    category: "Economic",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Economic item updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update economic item", { appearance: "error" });
            }
        }
        setEditingEconomicId(null);
    };
    const closeEditEconomic = () => setEditingEconomicId(null);
    const deleteEconomicHandler = (row) => {
        setItemToDelete({ ...row, category: "Economic" });
        setIsDeleteDialogOpen(true);
        setOpenEconomicActionId(null);
    };
    const economicTotalPages = economicRows.length ? Math.ceil(economicRows.length / pageSize) : 1;
    const economicIndexOfLast = economicPage * pageSize; const economicIndexOfFirst = economicIndexOfLast - pageSize; const pagedEconomic = economicRows.slice(economicIndexOfFirst, economicIndexOfLast);
    const nextEconomic = () => { if (economicPage < economicTotalPages) setEconomicPage(economicPage + 1); };
    const prevEconomic = () => { if (economicPage > 1) setEconomicPage(economicPage - 1); };

    // Social handlers
    const addSocial = () => { setShowNewSocial(true); setNewSocialRow({ title: '', description: '' }); };
    const cancelSocial = () => { setShowNewSocial(false); setNewSocialRow({ title: '', description: '' }); };
    const changeNewSocial = ({ target: { name, value } }) => setNewSocialRow(prev => ({ ...prev, [name]: value }));
    const saveSocial = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newSocialRow.title || !newSocialRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createPest({
                projectID: projectId,
                category: "Social",
                title: newSocialRow.title,
                description: newSocialRow.description,
                displayOrder: socialRows.length + 1,
            });
            setShowNewSocial(false);
            setNewSocialRow({ title: '', description: '' });
            refetch();
            addToast("Social item created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create social item", { appearance: "error" });
        }
    };
    const toggleSocial = (id) => setOpenSocialActionId(prev => prev === id ? null : id);
    const startEditSocial = (id) => { setEditingSocialId(id); setOpenSocialActionId(null); };
    const changeEditSocial = (id, { target: { name, value } }) => setSocialRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditSocial = async () => {
        const row = socialRows.find((item) => item.id === editingSocialId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updatePest(row.id, {
                    category: "Social",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Social item updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update social item", { appearance: "error" });
            }
        }
        setEditingSocialId(null);
    };
    const closeEditSocial = () => setEditingSocialId(null);
    const deleteSocialHandler = (row) => {
        setItemToDelete({ ...row, category: "Social" });
        setIsDeleteDialogOpen(true);
        setOpenSocialActionId(null);
    };
    const socialTotalPages = socialRows.length ? Math.ceil(socialRows.length / pageSize) : 1;
    const socialIndexOfLast = socialPage * pageSize; const socialIndexOfFirst = socialIndexOfLast - pageSize; const pagedSocial = socialRows.slice(socialIndexOfFirst, socialIndexOfLast);
    const nextSocial = () => { if (socialPage < socialTotalPages) setSocialPage(socialPage + 1); };
    const prevSocial = () => { if (socialPage > 1) setSocialPage(socialPage - 1); };

    // Technological handlers
    const addTech = () => { setShowNewTech(true); setNewTechRow({ title: '', description: '' }); };
    const cancelTech = () => { setShowNewTech(false); setNewTechRow({ title: '', description: '' }); };
    const changeNewTech = ({ target: { name, value } }) => setNewTechRow(prev => ({ ...prev, [name]: value }));
    const saveTech = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newTechRow.title || !newTechRow.description) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createPest({
                projectID: projectId,
                category: "Technological",
                title: newTechRow.title,
                description: newTechRow.description,
                displayOrder: techRows.length + 1,
            });
            setShowNewTech(false);
            setNewTechRow({ title: '', description: '' });
            refetch();
            addToast("Technological item created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create technological item", { appearance: "error" });
        }
    };
    const toggleTech = (id) => setOpenTechActionId(prev => prev === id ? null : id);
    const startEditTech = (id) => { setEditingTechId(id); setOpenTechActionId(null); };
    const changeEditTech = (id, { target: { name, value } }) => setTechRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditTech = async () => {
        const row = techRows.find((item) => item.id === editingTechId);
        if (row) {
            if (!row.title || !row.description) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updatePest(row.id, {
                    category: "Technological",
                    title: row.title,
                    description: row.description,
                    displayOrder: row.displayOrder || 0,
                });
                refetch();
                addToast("Technological item updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update technological item", { appearance: "error" });
            }
        }
        setEditingTechId(null);
    };
    const closeEditTech = () => setEditingTechId(null);
    const deleteTechHandler = (row) => {
        setItemToDelete({ ...row, category: "Technological" });
        setIsDeleteDialogOpen(true);
        setOpenTechActionId(null);
    };
    const techTotalPages = techRows.length ? Math.ceil(techRows.length / pageSize) : 1;
    const techIndexOfLast = techPage * pageSize; const techIndexOfFirst = techIndexOfLast - pageSize; const pagedTech = techRows.slice(techIndexOfFirst, techIndexOfLast);
    const nextTech = () => { if (techPage < techTotalPages) setTechPage(techPage + 1); };
    const prevTech = () => { if (techPage > 1) setTechPage(techPage - 1); };

    // Unified delete confirmation handler
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deletePest(itemToDelete.id);
            refetch();
            // Clear editing and action states based on category
            if (itemToDelete.category === "Political") {
                if (editingPoliticalId === itemToDelete.id) setEditingPoliticalId(null);
                if (openPoliticalActionId === itemToDelete.id) setOpenPoliticalActionId(null);
            } else if (itemToDelete.category === "Economic") {
                if (editingEconomicId === itemToDelete.id) setEditingEconomicId(null);
                if (openEconomicActionId === itemToDelete.id) setOpenEconomicActionId(null);
            } else if (itemToDelete.category === "Social") {
                if (editingSocialId === itemToDelete.id) setEditingSocialId(null);
                if (openSocialActionId === itemToDelete.id) setOpenSocialActionId(null);
            } else if (itemToDelete.category === "Technological") {
                if (editingTechId === itemToDelete.id) setEditingTechId(null);
                if (openTechActionId === itemToDelete.id) setOpenTechActionId(null);
            }
            addToast(`${itemToDelete.category} item deleted successfully`, { appearance: "success" });
        } catch (error) {
            addToast(`Failed to delete ${itemToDelete.category.toLowerCase()} item`, { appearance: "error" });
        }
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    return (
        <div>
            {/* Top Buttons */}
            <div className='flex justify-end items-center mt-4 space-x-2'>
                <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
                <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
            </div>




            {/* Political */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-xl font-semibold'>Political</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addPolitical} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addPolitical}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '350px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewPolitical && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: newPoliticalRow.title }} onChange={changeNewPolitical} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newPoliticalRow.description }} onChange={changeNewPolitical} /></td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={savePolitical}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                            <div className={'cursor-pointer'} onClick={cancelPolitical}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {politicalRows.length === 0 && !showNewPolitical && (<tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Political Items</td></tr>)}
                            {politicalRows.slice(politicalIndexOfFirst, politicalIndexOfLast).map((row, idx) => {
                                const isEditing = editingPoliticalId === row.id;
                                return (
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{politicalIndexOfFirst + idx + 1}</td>
                                        {!isEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.title || '-'}</td>
                                                <td className='py-3 px-2'>{row.description || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openPoliticalActionId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => togglePolitical(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => startEditPolitical(row.id)}><PencilIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => deletePoliticalHandler(row)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => togglePolitical(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditPolitical(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditPolitical(row.id, e)} /></td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={doneEditPolitical}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                                        <div className={'cursor-pointer'} onClick={closeEditPolitical}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {politicalRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={prevPolitical} className={`p-2 rounded-full bg-gray-200 ${politicalPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={politicalPage === 1}><ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                            <span className='text-gray-500 text-center'>Page {politicalPage} of {politicalTotalPages}</span>
                            <button onClick={nextPolitical} className={`p-2 rounded-full bg-gray-200 ${politicalPage === politicalTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={politicalPage === politicalTotalPages}><ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Economic */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-xl font-semibold'>Economic</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addEconomic} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addEconomic}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '350px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewEconomic && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: newEconomicRow.title }} onChange={changeNewEconomic} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newEconomicRow.description }} onChange={changeNewEconomic} /></td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={saveEconomic}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                            <div className={'cursor-pointer'} onClick={cancelEconomic}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {economicRows.length === 0 && !showNewEconomic && (<tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Economic Items</td></tr>)}
                            {economicRows.slice(economicIndexOfFirst, economicIndexOfLast).map((row, idx) => {
                                const isEditing = editingEconomicId === row.id;
                                return (
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{economicIndexOfFirst + idx + 1}</td>
                                        {!isEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.title || '-'}</td>
                                                <td className='py-3 px-2'>{row.description || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openEconomicActionId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleEconomic(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => startEditEconomic(row.id)}><PencilIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => deleteEconomicHandler(row)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => toggleEconomic(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditEconomic(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditEconomic(row.id, e)} /></td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={doneEditEconomic}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                                        <div className={'cursor-pointer'} onClick={closeEditEconomic}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {economicRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={prevEconomic} className={`p-2 rounded-full bg-gray-200 ${economicPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={economicPage === 1}><ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                            <span className='text-gray-500 text-center'>Page {economicPage} of {economicTotalPages}</span>
                            <button onClick={nextEconomic} className={`p-2 rounded-full bg-gray-200 ${economicPage === economicTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={economicPage === economicTotalPages}><ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Social */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-xl font-semibold'>Social</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addSocial} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addSocial}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{ width: '50px' }}>#</th>
                                <th className='py-3 px-2' style={{ width: '350px' }}>Title</th>
                                <th className='py-3 px-2'>Description</th>
                                <th className='py-3 px-2' style={{ width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewSocial && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: newSocialRow.title }} onChange={changeNewSocial} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newSocialRow.description }} onChange={changeNewSocial} /></td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={saveSocial}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                            <div className={'cursor-pointer'} onClick={cancelSocial}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {socialRows.length === 0 && !showNewSocial && (<tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Social Items</td></tr>)}
                            {socialRows.slice(socialIndexOfFirst, socialIndexOfLast).map((row, idx) => {
                                const isEditing = editingSocialId === row.id;
                                return (
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{socialIndexOfFirst + idx + 1}</td>
                                        {!isEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.title || '-'}</td>
                                                <td className='py-3 px-2'>{row.description || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openSocialActionId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleSocial(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => startEditSocial(row.id)}><PencilIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => deleteSocialHandler(row)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => toggleSocial(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditSocial(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditSocial(row.id, e)} /></td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={doneEditSocial}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                                        <div className={'cursor-pointer'} onClick={closeEditSocial}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {socialRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={prevSocial} className={`p-2 rounded-full bg-gray-200 ${socialPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={socialPage === 1}><ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                            <span className='text-gray-500 text-center'>Page {socialPage} of {socialTotalPages}</span>
                            <button onClick={nextSocial} className={`p-2 rounded-full bg-gray-200 ${socialPage === socialTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={socialPage === socialTotalPages}><ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Technological */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-xl font-semibold'>Technological</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addTech} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addTech}>Add New</button>
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
                            {showNewTech && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: newTechRow.title }} onChange={changeNewTech} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newTechRow.description }} onChange={changeNewTech} /></td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={saveTech}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                            <div className={'cursor-pointer'} onClick={cancelTech}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {techRows.length === 0 && !showNewTech && (<tr><td className='py-3 px-2 text-text-color text-center' colSpan={4}>No Technological Items</td></tr>)}
                            {techRows.slice(techIndexOfFirst, techIndexOfLast).map((row, idx) => {
                                const isEditing = editingTechId === row.id;
                                return (
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{techIndexOfFirst + idx + 1}</td>
                                        {!isEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.title || '-'}</td>
                                                <td className='py-3 px-2'>{row.description || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openTechActionId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleTech(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => startEditTech(row.id)}><PencilIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => deleteTechHandler(row)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => toggleTech(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditTech(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditTech(row.id, e)} /></td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={doneEditTech}><CheckCircleIcon className={'w-5 h-5 text-primary-pink'} /></div>
                                                        <div className={'cursor-pointer'} onClick={closeEditTech}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {techRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={prevTech} className={`p-2 rounded-full bg-gray-200 ${techPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={techPage === 1}><ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} /></button>
                            <span className='text-gray-500 text-center'>Page {techPage} of {techTotalPages}</span>
                            <button onClick={nextTech} className={`p-2 rounded-full bg-gray-200 ${techPage === techTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={techPage === techTotalPages}><ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} /></button>
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
            <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
        </div>
    );
};

export default PESTOverview;
