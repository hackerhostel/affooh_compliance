import React, { useState } from 'react';
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from '../../../components/FormSelect.jsx';
import WYSIWYGInput from "../../../components/WYSIWYGInput.jsx";
import { PencilIcon, EllipsisVerticalIcon, CheckBadgeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";

const PESTOverview = () => {
    // Initial purpose text
    const initialText = `This document defines the purpose of LifeServ's Quality Management System (QMS) in accordance with the requirements of ISO 9001:2015. It aims to establish a clear understanding of what the QMS covers, ensuring that all relevant activities and processes are managed to consistently meet customer and applicable statutory and regulatory requirements, and to enhance customer satisfaction through the effective application of the system, including processes for improvement.`;

    const [formValues, setFormValues] = useState({
        purpose: initialText,
        name: "",
        contactInformation: "",
        address: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // PEST sections - Political, Economic, Social, Technological
    // Political
    const [politicalRows, setPoliticalRows] = useState([
        { id: 1, title: 'Regulatory Changes', description: 'New government policies affecting industry' },
        { id: 2, title: 'Trade Tariffs', description: 'Increased tariffs on imported components' },
    ]);
    const [showNewPolitical, setShowNewPolitical] = useState(false);
    const [newPoliticalRow, setNewPoliticalRow] = useState({ title: '', description: '' });
    const [editingPoliticalId, setEditingPoliticalId] = useState(null);
    const [openPoliticalActionId, setOpenPoliticalActionId] = useState(null);
    const [politicalPage, setPoliticalPage] = useState(1);

    // Economic
    const [economicRows, setEconomicRows] = useState([
        { id: 11, title: 'Inflation', description: 'Rising costs impacting margins' },
        { id: 12, title: 'Exchange Rates', description: 'Currency volatility affecting imports' },
    ]);
    const [showNewEconomic, setShowNewEconomic] = useState(false);
    const [newEconomicRow, setNewEconomicRow] = useState({ title: '', description: '' });
    const [editingEconomicId, setEditingEconomicId] = useState(null);
    const [openEconomicActionId, setOpenEconomicActionId] = useState(null);
    const [economicPage, setEconomicPage] = useState(1);

    // Social
    const [socialRows, setSocialRows] = useState([
        { id: 21, title: 'Demographic Shift', description: 'Aging population increasing service demand' },
        { id: 22, title: 'Lifestyle Changes', description: 'Preference for eco-friendly products' },
    ]);
    const [showNewSocial, setShowNewSocial] = useState(false);
    const [newSocialRow, setNewSocialRow] = useState({ title: '', description: '' });
    const [editingSocialId, setEditingSocialId] = useState(null);
    const [openSocialActionId, setOpenSocialActionId] = useState(null);
    const [socialPage, setSocialPage] = useState(1);

    // Technological
    const [techRows, setTechRows] = useState([
        { id: 31, title: 'Automation', description: 'Adoption of AI to streamline operations' },
        { id: 32, title: 'Cybersecurity', description: 'Increasing need for robust security' },
    ]);
    const [showNewTech, setShowNewTech] = useState(false);
    const [newTechRow, setNewTechRow] = useState({ title: '', description: '' });
    const [editingTechId, setEditingTechId] = useState(null);
    const [openTechActionId, setOpenTechActionId] = useState(null);
    const [techPage, setTechPage] = useState(1);

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

    // Shared helpers
    const pageSize = 5;

    // Political handlers
    const addPolitical = () => { setShowNewPolitical(true); setNewPoliticalRow({ title: '', description: '' }); };
    const cancelPolitical = () => { setShowNewPolitical(false); setNewPoliticalRow({ title: '', description: '' }); };
    const changeNewPolitical = ({ target: { name, value } }) => setNewPoliticalRow(prev => ({ ...prev, [name]: value }));
    const savePolitical = () => { if (!newPoliticalRow.title || !newPoliticalRow.description) return; setPoliticalRows(prev => [...prev, { id: Date.now(), ...newPoliticalRow }]); setShowNewPolitical(false); setNewPoliticalRow({ title: '', description: '' }); };
    const togglePolitical = (id) => setOpenPoliticalActionId(prev => prev === id ? null : id);
    const startEditPolitical = (id) => { setEditingPoliticalId(id); setOpenPoliticalActionId(null); };
    const changeEditPolitical = (id, { target: { name, value } }) => setPoliticalRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditPolitical = () => setEditingPoliticalId(null);
    const closeEditPolitical = () => setEditingPoliticalId(null);
    const deletePolitical = (id) => { setPoliticalRows(prev => prev.filter(r => r.id !== id)); if (editingPoliticalId === id) setEditingPoliticalId(null); if (openPoliticalActionId === id) setOpenPoliticalActionId(null); };
    const politicalTotalPages = politicalRows.length ? Math.ceil(politicalRows.length / pageSize) : 1;
    const politicalIndexOfLast = politicalPage * pageSize; const politicalIndexOfFirst = politicalIndexOfLast - pageSize; const pagedPolitical = politicalRows.slice(politicalIndexOfFirst, politicalIndexOfLast);
    const nextPolitical = () => { if (politicalPage < politicalTotalPages) setPoliticalPage(politicalPage + 1); };
    const prevPolitical = () => { if (politicalPage > 1) setPoliticalPage(politicalPage - 1); };

    // Economic handlers
    const addEconomic = () => { setShowNewEconomic(true); setNewEconomicRow({ title: '', description: '' }); };
    const cancelEconomic = () => { setShowNewEconomic(false); setNewEconomicRow({ title: '', description: '' }); };
    const changeNewEconomic = ({ target: { name, value } }) => setNewEconomicRow(prev => ({ ...prev, [name]: value }));
    const saveEconomic = () => { if (!newEconomicRow.title || !newEconomicRow.description) return; setEconomicRows(prev => [...prev, { id: Date.now(), ...newEconomicRow }]); setShowNewEconomic(false); setNewEconomicRow({ title: '', description: '' }); };
    const toggleEconomic = (id) => setOpenEconomicActionId(prev => prev === id ? null : id);
    const startEditEconomic = (id) => { setEditingEconomicId(id); setOpenEconomicActionId(null); };
    const changeEditEconomic = (id, { target: { name, value } }) => setEconomicRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditEconomic = () => setEditingEconomicId(null);
    const closeEditEconomic = () => setEditingEconomicId(null);
    const deleteEconomic = (id) => { setEconomicRows(prev => prev.filter(r => r.id !== id)); if (editingEconomicId === id) setEditingEconomicId(null); if (openEconomicActionId === id) setOpenEconomicActionId(null); };
    const economicTotalPages = economicRows.length ? Math.ceil(economicRows.length / pageSize) : 1;
    const economicIndexOfLast = economicPage * pageSize; const economicIndexOfFirst = economicIndexOfLast - pageSize; const pagedEconomic = economicRows.slice(economicIndexOfFirst, economicIndexOfLast);
    const nextEconomic = () => { if (economicPage < economicTotalPages) setEconomicPage(economicPage + 1); };
    const prevEconomic = () => { if (economicPage > 1) setEconomicPage(economicPage - 1); };

    // Social handlers
    const addSocial = () => { setShowNewSocial(true); setNewSocialRow({ title: '', description: '' }); };
    const cancelSocial = () => { setShowNewSocial(false); setNewSocialRow({ title: '', description: '' }); };
    const changeNewSocial = ({ target: { name, value } }) => setNewSocialRow(prev => ({ ...prev, [name]: value }));
    const saveSocial = () => { if (!newSocialRow.title || !newSocialRow.description) return; setSocialRows(prev => [...prev, { id: Date.now(), ...newSocialRow }]); setShowNewSocial(false); setNewSocialRow({ title: '', description: '' }); };
    const toggleSocial = (id) => setOpenSocialActionId(prev => prev === id ? null : id);
    const startEditSocial = (id) => { setEditingSocialId(id); setOpenSocialActionId(null); };
    const changeEditSocial = (id, { target: { name, value } }) => setSocialRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditSocial = () => setEditingSocialId(null);
    const closeEditSocial = () => setEditingSocialId(null);
    const deleteSocial = (id) => { setSocialRows(prev => prev.filter(r => r.id !== id)); if (editingSocialId === id) setEditingSocialId(null); if (openSocialActionId === id) setOpenSocialActionId(null); };
    const socialTotalPages = socialRows.length ? Math.ceil(socialRows.length / pageSize) : 1;
    const socialIndexOfLast = socialPage * pageSize; const socialIndexOfFirst = socialIndexOfLast - pageSize; const pagedSocial = socialRows.slice(socialIndexOfFirst, socialIndexOfLast);
    const nextSocial = () => { if (socialPage < socialTotalPages) setSocialPage(socialPage + 1); };
    const prevSocial = () => { if (socialPage > 1) setSocialPage(socialPage - 1); };

    // Technological handlers
    const addTech = () => { setShowNewTech(true); setNewTechRow({ title: '', description: '' }); };
    const cancelTech = () => { setShowNewTech(false); setNewTechRow({ title: '', description: '' }); };
    const changeNewTech = ({ target: { name, value } }) => setNewTechRow(prev => ({ ...prev, [name]: value }));
    const saveTech = () => { if (!newTechRow.title || !newTechRow.description) return; setTechRows(prev => [...prev, { id: Date.now(), ...newTechRow }]); setShowNewTech(false); setNewTechRow({ title: '', description: '' }); };
    const toggleTech = (id) => setOpenTechActionId(prev => prev === id ? null : id);
    const startEditTech = (id) => { setEditingTechId(id); setOpenTechActionId(null); };
    const changeEditTech = (id, { target: { name, value } }) => setTechRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const doneEditTech = () => setEditingTechId(null);
    const closeEditTech = () => setEditingTechId(null);
    const deleteTech = (id) => { setTechRows(prev => prev.filter(r => r.id !== id)); if (editingTechId === id) setEditingTechId(null); if (openTechActionId === id) setOpenTechActionId(null); };
    const techTotalPages = techRows.length ? Math.ceil(techRows.length / pageSize) : 1;
    const techIndexOfLast = techPage * pageSize; const techIndexOfFirst = techIndexOfLast - pageSize; const pagedTech = techRows.slice(techIndexOfFirst, techIndexOfLast);
    const nextTech = () => { if (techPage < techTotalPages) setTechPage(techPage + 1); };
    const prevTech = () => { if (techPage > 1) setTechPage(techPage - 1); };

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

           


            {/* Political */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Political</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addPolitical} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addPolitical}>Add New</button>
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
                        {showNewPolitical && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: newPoliticalRow.title }} onChange={changeNewPolitical} /></td>
                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newPoliticalRow.description }} onChange={changeNewPolitical} /></td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={savePolitical}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                                                            <div className='cursor-pointer' onClick={() => deletePolitical(row.id)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            <div className='cursor-pointer' onClick={() => togglePolitical(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditPolitical(row.id, e)} /></td>
                                            <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditPolitical(row.id, e)} /></td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={doneEditPolitical}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                    <span className='text-lg font-semibold'>Economic</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addEconomic} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addEconomic}>Add New</button>
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
                        {showNewEconomic && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: newEconomicRow.title }} onChange={changeNewEconomic} /></td>
                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newEconomicRow.description }} onChange={changeNewEconomic} /></td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={saveEconomic}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                                                            <div className='cursor-pointer' onClick={() => deleteEconomic(row.id)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            <div className='cursor-pointer' onClick={() => toggleEconomic(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditEconomic(row.id, e)} /></td>
                                            <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditEconomic(row.id, e)} /></td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={doneEditEconomic}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                    <span className='text-lg font-semibold'>Social</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addSocial} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addSocial}>Add New</button>
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
                        {showNewSocial && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: newSocialRow.title }} onChange={changeNewSocial} /></td>
                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newSocialRow.description }} onChange={changeNewSocial} /></td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={saveSocial}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                                                            <div className='cursor-pointer' onClick={() => deleteSocial(row.id)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            <div className='cursor-pointer' onClick={() => toggleSocial(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditSocial(row.id, e)} /></td>
                                            <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditSocial(row.id, e)} /></td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={doneEditSocial}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                    <span className='text-lg font-semibold'>Technological</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addTech} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addTech}>Add New</button>
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
                        {showNewTech && (
                            <tr className='border-b border-gray-200'>
                                <td className='py-3 px-2'>-</td>
                                <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: newTechRow.title }} onChange={changeNewTech} /></td>
                                <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: newTechRow.description }} onChange={changeNewTech} /></td>
                                <td className='py-3 px-2'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={'cursor-pointer'} onClick={saveTech}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
                                                            <div className='cursor-pointer' onClick={() => deleteTech(row.id)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            <div className='cursor-pointer' onClick={() => toggleTech(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className='py-3 px-2 w-48'><FormInput type="text" name="title" formValues={{ title: row.title }} onChange={(e) => changeEditTech(row.id, e)} /></td>
                                            <td className='py-3 px-2'><FormTextArea type="text" name="description" formValues={{ description: row.description }} onChange={(e) => changeEditTech(row.id, e)} /></td>
                                            <td className='py-3 px-2'>
                                                <div className={'flex gap-3 items-center'}>
                                                    <div className={'cursor-pointer'} onClick={doneEditTech}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
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
        </div>
    );
};

export default PESTOverview;
