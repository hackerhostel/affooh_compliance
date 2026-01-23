import React, { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInput.jsx';
import FormSelect from "../../../components/FormSelect.jsx";
import { PencilIcon, EllipsisVerticalIcon, CheckBadgeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getSelectOptions } from "../../../utils/commonUtils.js";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import useFetchStakeholders from "../../../hooks/custom-hooks/compliance/useFetchStakeholders.jsx";
import { createStakeholder, deleteStakeholder as deleteStakeholderApi, updateStakeholder } from "../../../utils/complianceApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";


const StakeholderOverview = () => {
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const projectId = selectedProject?.id;
    const { data: stakeholderData, refetch } = useFetchStakeholders(projectId);

    // Stakeholder Context section state
    const [stakeholderRows, setStakeholderRows] = useState([]);
    const [showNewStakeholderRow, setShowNewStakeholderRow] = useState(false);
    const [newStakeholderRow, setNewStakeholderRow] = useState({
        stakeholderName: '',
        stakeholderType: 'Internal',
        organization: '',
        position: '',
        contactInformation: '',
        influence: 'Medium',
        interest: 'Medium',
    });
    const [editingStakeholderId, setEditingStakeholderId] = useState(null);
    const [openStakeholderActionId, setOpenStakeholderActionId] = useState(null);
    const [stakeholderPage, setStakeholderPage] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [stakeholderToDelete, setStakeholderToDelete] = useState(null);
    useEffect(() => {
        setStakeholderRows(stakeholderData || []);
    }, [stakeholderData]);

    const stakeholderTypeOptions = getSelectOptions([
        { id: "Internal", name: "Internal" },
        { id: "External", name: "External" },
    ]);
    const levelOptions = getSelectOptions([
        { id: "High", name: "High" },
        { id: "Medium", name: "Medium" },
        { id: "Low", name: "Low" },
    ]);

  


    // Stakeholder handlers
    const addStakeholder = () => {
        setShowNewStakeholderRow(true);
        setNewStakeholderRow({
            stakeholderName: '',
            stakeholderType: 'Internal',
            organization: '',
            position: '',
            contactInformation: '',
            influence: 'Medium',
            interest: 'Medium',
        });
    };
    const cancelNewStakeholder = () => {
        setShowNewStakeholderRow(false);
        setNewStakeholderRow({
            stakeholderName: '',
            stakeholderType: 'Internal',
            organization: '',
            position: '',
            contactInformation: '',
            influence: 'Medium',
            interest: 'Medium',
        });
    };
    const changeNewStakeholder = ({ target: { name, value } }) => setNewStakeholderRow(prev => ({ ...prev, [name]: value }));
    const saveNewStakeholder = async () => {
        if (!projectId) {
            addToast("Project not found", { appearance: "error" });
            return;
        }
        if (!newStakeholderRow.stakeholderName) {
            addToast("Please fill in all required fields", { appearance: "error" });
            return;
        }
        try {
            await createStakeholder({
                projectID: projectId,
                stakeholderName: newStakeholderRow.stakeholderName,
                stakeholderType: newStakeholderRow.stakeholderType,
                organization: newStakeholderRow.organization,
                position: newStakeholderRow.position,
                contactInformation: newStakeholderRow.contactInformation,
                influence: newStakeholderRow.influence,
                interest: newStakeholderRow.interest,
            });
            setShowNewStakeholderRow(false);
            cancelNewStakeholder();
            refetch();
            addToast("Stakeholder created successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to create stakeholder", { appearance: "error" });
        }
    };
    const handleDeleteClick = (stakeholder) => {
        setStakeholderToDelete(stakeholder);
        setIsDeleteDialogOpen(true);
        setOpenStakeholderActionId(null);
    };

    const handleConfirmDelete = async () => {
        if (!stakeholderToDelete) return;
        try {
            await deleteStakeholderApi(stakeholderToDelete.id);
            refetch();
            if (editingStakeholderId === stakeholderToDelete.id) setEditingStakeholderId(null);
            addToast("Stakeholder deleted successfully", { appearance: "success" });
        } catch (error) {
            addToast("Failed to delete stakeholder", { appearance: "error" });
        }
        setIsDeleteDialogOpen(false);
        setStakeholderToDelete(null);
    };
    const startEditStakeholder = (id) => { setEditingStakeholderId(id); setOpenStakeholderActionId(null); };
    const closeEditStakeholder = () => setEditingStakeholderId(null);
    const doneEditStakeholder = async () => {
        const row = stakeholderRows.find((item) => item.id === editingStakeholderId);
        if (row) {
            if (!row.stakeholderName) {
                addToast("Please fill in all required fields", { appearance: "error" });
                return;
            }
            try {
                await updateStakeholder(row.id, {
                    stakeholderName: row.stakeholderName,
                    stakeholderType: row.stakeholderType,
                    organization: row.organization,
                    position: row.position,
                    contactInformation: row.contactInformation,
                    influence: row.influence,
                    interest: row.interest,
                });
                refetch();
                addToast("Stakeholder updated successfully", { appearance: "success" });
            } catch (error) {
                addToast("Failed to update stakeholder", { appearance: "error" });
            }
        }
        setEditingStakeholderId(null);
    };
    const changeEditStakeholder = (id, { target: { name, value } }) => setStakeholderRows(prev => prev.map(r => r.id === id ? { ...r, [name]: value } : r));
    const toggleStakeholderActions = (id) => setOpenStakeholderActionId(prev => prev === id ? null : id);
    const stakeholderRowsPerPage = 5;
    const stakeholderTotalPages = stakeholderRows.length ? Math.ceil(stakeholderRows.length / stakeholderRowsPerPage) : 1;
    const stakeholderIndexOfLast = stakeholderPage * stakeholderRowsPerPage;
    const stakeholderIndexOfFirst = stakeholderIndexOfLast - stakeholderRowsPerPage;
    const pagedStakeholders = stakeholderRows.slice(stakeholderIndexOfFirst, stakeholderIndexOfLast);
    const nextStakeholderPage = () => { if (stakeholderPage < stakeholderTotalPages) setStakeholderPage(stakeholderPage + 1); };
    const prevStakeholderPage = () => { if (stakeholderPage > 1) setStakeholderPage(stakeholderPage - 1); };

  


   

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
                <div className='bg-white rounded p-3 mt-2 overflow-x-auto'>
                    <table className='table-fixed w-full border-collapse min-w-max'>
                        <thead>
                            <tr className='text-left text-secondary-grey border-b border-gray-200'>
                                <th className='py-3 px-2' style={{width: '50px'}}>#</th>
                                <th className='py-3 px-2' style={{width: '150px'}}>Stakeholder</th>
                                <th className='py-3 px-2' style={{width: '100px'}}>Type</th>
                                <th className='py-3 px-2' style={{width: '150px'}}>Organization</th>
                                <th className='py-3 px-2' style={{width: '130px'}}>Position</th>
                                <th className='py-3 px-2' style={{width: '150px'}}>Contact</th>
                                <th className='py-3 px-2' style={{width: '100px'}}>Influence</th>
                                <th className='py-3 px-2' style={{width: '100px'}}>Interest</th>
                                <th className='py-3 px-2' style={{width: '80px'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showNewStakeholderRow && (
                                <tr className='border-b border-gray-200'>
                                    <td className='py-3 px-2'>-</td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="stakeholderName" formValues={{ stakeholderName: newStakeholderRow.stakeholderName }} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormSelect name="stakeholderType" formValues={{ stakeholderType: newStakeholderRow.stakeholderType }} options={stakeholderTypeOptions} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="organization" formValues={{ organization: newStakeholderRow.organization }} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="position" formValues={{ position: newStakeholderRow.position }} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormInput type="text" name="contactInformation" formValues={{ contactInformation: newStakeholderRow.contactInformation }} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormSelect name="influence" formValues={{ influence: newStakeholderRow.influence }} options={levelOptions} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <FormSelect name="interest" formValues={{ interest: newStakeholderRow.interest }} options={levelOptions} onChange={changeNewStakeholder} />
                                    </td>
                                    <td className='py-3 px-2'>
                                        <div className='flex gap-3 items-center'>
                                            <div className={'cursor-pointer'} onClick={saveNewStakeholder}><CheckBadgeIcon className={'w-5 h-5 text-text-color'} /></div>
                                            <div className={'cursor-pointer'} onClick={cancelNewStakeholder}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {stakeholderRows.length === 0 && !showNewStakeholderRow && (
                                <tr><td className='py-3 px-2 text-text-color text-center' colSpan={8}>No Stakeholders Available</td></tr>
                            )}
                            {pagedStakeholders.map((row, index) => {
                                const isEditing = editingStakeholderId === row.id;
                                return (
                                    <tr className='border-b border-gray-200' key={row.id}>
                                        <td className='py-3 px-2'>{stakeholderIndexOfFirst + index + 1}</td>
                                        {!isEditing ? (
                                            <>
                                                <td className='py-3 px-2'>{row.stakeholderName || '-'}</td>
                                                <td className='py-3 px-2'>{row.stakeholderType || '-'}</td>
                                                <td className='py-3 px-2'>{row.organization || '-'}</td>
                                                <td className='py-3 px-2'>{row.position || '-'}</td>
                                                <td className='py-3 px-2'>{row.contactInformation || '-'}</td>
                                                <td className='py-3 px-2'>{row.influence || '-'}</td>
                                                <td className='py-3 px-2'>{row.interest || '-'}</td>
                                                <td className='py-3 px-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {openStakeholderActionId !== row.id ? (
                                                            <div className='cursor-pointer inline-flex' onClick={() => toggleStakeholderActions(row.id)}>
                                                                <EllipsisVerticalIcon className={'w-5 h-5 text-secondary-grey'} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className='cursor-pointer' onClick={() => startEditStakeholder(row.id)}><PencilIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => handleDeleteClick(row)}><TrashIcon className={'w-5 h-5 text-text-color'} /></div>
                                                                <div className='cursor-pointer' onClick={() => toggleStakeholderActions(row.id)}><XMarkIcon className={'w-5 h-5 text-text-color'} /></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="stakeholderName" formValues={{ stakeholderName: row.stakeholderName }} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormSelect name="stakeholderType" formValues={{ stakeholderType: row.stakeholderType }} options={stakeholderTypeOptions} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="organization" formValues={{ organization: row.organization }} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="position" formValues={{ position: row.position }} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormInput type="text" name="contactInformation" formValues={{ contactInformation: row.contactInformation }} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormSelect name="influence" formValues={{ influence: row.influence }} options={levelOptions} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
                                                <td className='py-3 px-2'>
                                                    <FormSelect name="interest" formValues={{ interest: row.interest }} options={levelOptions} onChange={(e) => changeEditStakeholder(row.id, e)} />
                                                </td>
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

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                message={
                    stakeholderToDelete
                        ? `Do you want to delete "${stakeholderToDelete.stakeholderName}"?`
                        : ""
                }
            />
        </div>
    );
};

export default StakeholderOverview;
