import React, { useState } from 'react';
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormInput from '../../../components/FormInput.jsx';
import { PencilIcon, EllipsisVerticalIcon, CheckBadgeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";


const StakeholderOverview = () => {
    // Initial purpose text
    const initialText = `This document defines the purpose of LifeServ's Quality Management System (QMS) in accordance with the requirements of ISO 9001:2015. It aims to establish a clear understanding of what the QMS covers, ensuring that all relevant activities and processes are managed to consistently meet customer and applicable statutory and regulatory requirements, and to enhance customer satisfaction through the effective application of the system, including processes for improvement.`;

    const [formValues, setFormValues] = useState({
        purpose: initialText,
        name: "",
        contactInformation: "",
        address: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // Stakeholder Context section state
    const [stakeholderRows, setStakeholderRows] = useState([
        { id: 1, party: 'Customers', needs: 'High quality products', expectations: 'On-time delivery', risks: 'Dissatisfaction' },
        { id: 2, party: 'Suppliers', needs: 'Clear specs', expectations: 'Prompt payments', risks: 'Supply delays' },
        { id: 3, party: 'Regulators', needs: 'Compliance', expectations: 'Accurate reporting', risks: 'Fines' },
    ]);
    const [showNewStakeholderRow, setShowNewStakeholderRow] = useState(false);
    const [newStakeholderRow, setNewStakeholderRow] = useState({ party: '', needs: '', expectations: '', risks: '' });
    const [editingStakeholderId, setEditingStakeholderId] = useState(null);
    const [openStakeholderActionId, setOpenStakeholderActionId] = useState(null);
    const [stakeholderPage, setStakeholderPage] = useState(1);

  


    // Stakeholder handlers
    const addStakeholder = () => { setShowNewStakeholderRow(true); setNewStakeholderRow({ party: '', needs: '', expectations: '', risks: '' }); };
    const cancelNewStakeholder = () => { setShowNewStakeholderRow(false); setNewStakeholderRow({ party: '', needs: '', expectations: '', risks: '' }); };
    const changeNewStakeholder = ({ target: { name, value } }) => setNewStakeholderRow(prev => ({ ...prev, [name]: value }));
    const saveNewStakeholder = () => {
        if (!newStakeholderRow.party || !newStakeholderRow.needs || !newStakeholderRow.expectations || !newStakeholderRow.risks) return;
        setStakeholderRows(prev => [...prev, { id: Date.now(), ...newStakeholderRow }]);
        setShowNewStakeholderRow(false);
        setNewStakeholderRow({ party: '', needs: '', expectations: '', risks: '' });
    };
    const deleteStakeholder = (id) => { setStakeholderRows(prev => prev.filter(r => r.id !== id)); if (editingStakeholderId === id) setEditingStakeholderId(null); if (openStakeholderActionId === id) setOpenStakeholderActionId(null); };
    const startEditStakeholder = (id) => { setEditingStakeholderId(id); setOpenStakeholderActionId(null); };
    const closeEditStakeholder = () => setEditingStakeholderId(null);
    const doneEditStakeholder = () => setEditingStakeholderId(null);
    const changeEditStakeholder = (id, { target: { name, value } }) => setStakeholderRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const toggleStakeholderActions = (id) => setOpenStakeholderActionId(prev => prev === id ? null : id);
    const stakeholderRowsPerPage = 5;
    const stakeholderTotalPages = stakeholderRows.length ? Math.ceil(stakeholderRows.length / stakeholderRowsPerPage) : 1;
    const stakeholderIndexOfLast = stakeholderPage * stakeholderRowsPerPage;
    const stakeholderIndexOfFirst = stakeholderIndexOfLast - stakeholderRowsPerPage;
    const pagedStakeholders = stakeholderRows.slice(stakeholderIndexOfFirst, stakeholderIndexOfLast);
    const nextStakeholderPage = () => { if (stakeholderPage < stakeholderTotalPages) setStakeholderPage(stakeholderPage + 1); };
    const prevStakeholderPage = () => { if (stakeholderPage > 1) setStakeholderPage(stakeholderPage - 1); };

  


   

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



            {/* Stakeholder Context */}
            <div className='mt-6'>
                <div className='flex items-center gap-5'>
                    <span className='text-lg font-semibold'>Stakeholder Context</span>
                    <div className='flex items-center gap-1'>
                        <PlusCircleIcon onClick={addStakeholder} className={'w-6 h-6 text-pink-500'} />
                        <button className='text-text-color' onClick={addStakeholder}>Add New</button>
                    </div>
                </div>
                <div className='bg-white rounded p-3 mt-2'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2 w-10'>#</th>
                                <th className='py-3 px-2'>Interested Party</th>
                                <th className='py-3 px-2'>Need(s)</th>
                                <th className='py-3 px-2'>Expectation(s)</th>
                                <th className='py-3 px-2'>Risk(s)</th>
                                <th className='py-3 px-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewStakeholderRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2 w-48'><FormTextArea type="text" name="party" formValues={{ party: newStakeholderRow.party }} onChange={changeNewStakeholder} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="needs" formValues={{ needs: newStakeholderRow.needs }} onChange={changeNewStakeholder} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="expectations" formValues={{ expectations: newStakeholderRow.expectations }} onChange={changeNewStakeholder} /></td>
                                    <td className='py-3 px-2'><FormTextArea type="text" name="risks" formValues={{ risks: newStakeholderRow.risks }} onChange={changeNewStakeholder} /></td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={saveNewStakeholder}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
                                            <div className={'cursor-pointer'} onClick={cancelNewStakeholder}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {stakeholderRows.length === 0 && !showNewStakeholderRow && (
                                <tr><td className='py-3 px-2 text-text-color text-center' colSpan={6}>No Stakeholders Available</td></tr>
                            )}
                            {pagedStakeholders.map((row, index) => {
                                const isEditing = editingStakeholderId === row.id;
                                return (
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{stakeholderIndexOfFirst + index + 1}</td>
                                        {!isEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.party || '-'}</td>
                                                <td className='py-3 px-2'>{row.needs || '-'}</td>
                                                <td className='py-3 px-2'>{row.expectations || '-'}</td>
                                                <td className='py-3 px-2'>{row.risks || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openStakeholderActionId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleStakeholderActions(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => startEditStakeholder(row.id)}><PencilIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => deleteStakeholder(row.id)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => toggleStakeholderActions(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2 w-48'><FormTextArea type="text" name="party" formValues={{ party: row.party }} onChange={(e) => changeEditStakeholder(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="needs" formValues={{ needs: row.needs }} onChange={(e) => changeEditStakeholder(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="expectations" formValues={{ expectations: row.expectations }} onChange={(e) => changeEditStakeholder(row.id, e)} /></td>
                                                <td className='py-3 px-2'><FormTextArea type="text" name="risks" formValues={{ risks: row.risks }} onChange={(e) => changeEditStakeholder(row.id, e)} /></td>
                                                <td className='py-3 px-2'>
                                                    <div className={'flex gap-3 items-center'}>
                                                        <div className={'cursor-pointer'} onClick={doneEditStakeholder}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
                                                        <div className={'cursor-pointer'} onClick={closeEditStakeholder}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {stakeholderRows.length > 0 && (
                        <div className='w-full flex gap-5 items-center justify-end mt-4'>
                            <button onClick={prevStakeholderPage} className={`p-2 rounded-full bg-gray-200 ${stakeholderPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={stakeholderPage === 1}>
                                <ChevronLeftIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                            <span className='text-gray-500 text-center'>Page {stakeholderPage} of {stakeholderTotalPages}</span>
                            <button onClick={nextStakeholderPage} className={`p-2 rounded-full bg-gray-200 ${stakeholderPage === stakeholderTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`} disabled={stakeholderPage === stakeholderTotalPages}>
                                <ChevronRightIcon className={'w-4 h-4 text-secondary-grey'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            
        </div>
    );
};

export default StakeholderOverview;
