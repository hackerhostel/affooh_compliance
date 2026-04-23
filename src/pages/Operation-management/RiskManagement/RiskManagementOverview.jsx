import React, { useState, useEffect } from "react";
import FormSelect from "../../../components/FormSelect.jsx";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormInput from "../../../components/FormInput.jsx";
import {
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import {
    selectOrganizationUsers,
    doGetOrganizationUsers,
} from "../../../state/slice/appSlice.js";
import { selectUser } from "../../../state/slice/authSlice.js";
import riskApi from "../../../utils/riskApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import RiskEditView from "./RiskEditView.jsx";
import AddTaskModal from "./AddTaskModal.jsx";

const initialData = [
    {
        id: "01",
        isoControl: "4.1 - Understanding the organization and its context",
        currentGaps: "Verify that the system Update new version...",
        interestedParties: "Customer, Senior Leadership, Parent Company",
        threat: "Compliance gaps",
        migrationReference: "ISMS Manual",
        impact: 1,
        probability: 1,
        owner: "Nilanga",
        firstName: "Nilanga",
        lastName: "",
        response: "Mitigate",
        recommendedAction: "",
        dueDate: "",
        status: "In Progress",
        task: "AFF-123"
    },
    {
        id: "02",
        isoControl: "4.1 - Understanding the organization and its context",
        currentGaps: "Verify that the system Update new version...",
        interestedParties: "Customer, Senior Leadership, Parent Company",
        threat: "Compliance gaps",
        migrationReference: "ISMS Manual",
        impact: 1,
        probability: 1,
        owner: "Nilanga",
        firstName: "Nilanga",
        lastName: "",
        response: "",
        recommendedAction: "",
        dueDate: "",
        status: "In Progress",
        task: "AFF-123"
    }
];

const RiskManagementOverview = ({ hideTitle = false }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const organizationUsers = useSelector(selectOrganizationUsers);
    const user = useSelector(selectUser);
    const organizationID = user?.organization?.id;

    const [rows, setRows] = useState(initialData);
    const [stats, setStats] = useState({ total: 25, todo: 10, inProgress: 5, done: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [editingRisk, setEditingRisk] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [riskToDeleteId, setRiskToDeleteId] = useState(null);
    const [viewMode, setViewMode] = useState('OVERVIEW');
    const [filters, setFilters] = useState({
        controlFilter: "",
        ownerFilter: "",
        complianceFilter: "",
        riskLevelFilter: "",
        statusFilter: ""
    });

    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedRiskForTask, setSelectedRiskForTask] = useState(null);

    const [newRiskData, setNewRiskData] = useState({
        isoControl: "",
        currentGaps: "",
        interestedParties: "",
        threat: "",
        migrationReference: "",
        owner: "",
        probability: 1,
        impact: 1,
        response: "",
        recommendedAction: "",
        dueDate: "",
        status: "In Progress"
    });

    const handleCreateRisk = async () => {
        if (!organizationID) return;
        try {
            await riskApi.createRisk({
                ...newRiskData,
                organizationID,
                createdBy: user?.id,
                updatedBy: user?.id,
                title: newRiskData.isoControl || "New Risk"
            });
            addToast("Risk created successfully", { appearance: "success" });
            setIsSidePanelOpen(false);
            fetchData();
            setNewRiskData({
                isoControl: "",
                currentGaps: "",
                interestedParties: "",
                threat: "",
                migrationReference: "",
                owner: "",
                probability: 1,
                impact: 1,
                response: "",
                recommendedAction: "",
                dueDate: "",
                status: "In Progress"
            });
        } catch (error) {
            console.error("Error creating risk:", error);
            addToast("Failed to create risk", { appearance: "error" });
        }
    };

    const fetchData = async () => {
        if (!organizationID) return;
        setIsLoading(true);
        try {
            const [risksRes, statsRes] = await Promise.all([
                riskApi.listRisks(organizationID),
                riskApi.getStats(organizationID)
            ]);
            const risks = risksRes.data.body || [];
            if (risks.length > 0) {
                // Map API data to our UI structure if needed
                setRows(risks.map((r, i) => ({
                    ...r,
                    id: String(i + 1).padStart(2, '0'),
                    task: `AFF-${String(r.id).slice(-3)}`
                })));
            }
            if (statsRes.data.body) setStats(statsRes.data.body);
        } catch (error) {
            console.error("Error fetching risks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (organizationID) fetchData();
        if (!organizationUsers) dispatch(doGetOrganizationUsers());
    }, [dispatch, organizationID]);

    const handleUpdateField = async (id, field, value) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
        try {
            const actualId = rows.find(r => r.id === id)?.databaseId || id;
            await riskApi.updateRisk(actualId, { [field]: value, updatedBy: user?.id });
            addToast(`Updated ${field} successfully`, { appearance: "success" });
        } catch (error) {
            console.error("Update failed:", error);
            addToast(`Failed to update ${field}`, { appearance: "error" });
        }
    };

    const handleOpenAddTask = (risk) => {
        setSelectedRiskForTask(risk);
        setIsAddTaskModalOpen(true);
    };

    const userOptions = organizationUsers?.map(u => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName || ""}`.trim()
    })) || [];

    if (viewMode === 'EDIT' && editingRisk) {
        return <RiskEditView risk={editingRisk} userOptions={userOptions} onBack={() => setViewMode('OVERVIEW')} onUpdate={() => { fetchData(); setViewMode('OVERVIEW'); }} />;
    }

    return (
        <div className="bg-[#F8F9FD] p-6 font-sans min-h-screen">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header Section */}
                {!hideTitle && (
                    <div className="flex justify-between items-center">
                        <h4 className="text-2xl font-bold text-[#1E293B]">Risk Management</h4>
                        <div className="bg-gray-200/50 p-1 rounded-xl flex gap-1">
                            <button 
                                onClick={() => setViewMode('OVERVIEW')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'OVERVIEW' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Overview
                            </button>
                            <button 
                                onClick={() => setViewMode('HISTORY')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'HISTORY' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                History
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center group hover:shadow-md transition-all">
                        <span className="text-5xl font-light text-gray-700 mb-2">{stats.total}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">All</span>
                    </div>
                    <div className="bg-white rounded-2xl p-8 border-2 border-red-100 shadow-sm flex flex-col items-center justify-center group hover:border-red-400 transition-all">
                        <span className="text-5xl font-light text-gray-700 mb-2">{stats.todo}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">To Do</span>
                    </div>
                    <div className="bg-white rounded-2xl p-8 border-2 border-yellow-100 shadow-sm flex flex-col items-center justify-center group hover:border-yellow-400 transition-all">
                        <span className="text-5xl font-light text-gray-700 mb-2">{stats.inProgress}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">In Progress</span>
                    </div>
                    <div className="bg-white rounded-2xl p-8 border-2 border-green-100 shadow-sm flex flex-col items-center justify-center group hover:border-green-400 transition-all">
                        <span className="text-5xl font-light text-gray-700 mb-2">{stats.done}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Done</span>
                    </div>
                </div>

                {/* Filter & Action Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-32"><FormSelect placeholder="Control" options={[]} showLabel={false} /></div>
                        <div className="w-32"><FormSelect placeholder="Assignee" options={userOptions} showLabel={false} /></div>
                        <div className="w-32"><FormSelect placeholder="Compliance" options={[]} showLabel={false} /></div>
                        <div className="w-32"><FormSelect placeholder="Risk Level" options={[]} showLabel={false} /></div>
                        <div className="w-32"><FormSelect placeholder="Status" options={[]} showLabel={false} /></div>
                    </div>
                    <button
                        onClick={() => { setEditingRisk(null); setIsSidePanelOpen(true); }}
                        className="bg-primary-pink text-white px-8 py-2.5 rounded-lg font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                    >
                        New Risk
                    </button>
                </div>

                {/* Risk Cards List */}
                <div className="space-y-4">
                    {/* Header for the cards (Alignment only) */}
                    <div className="grid grid-cols-12 gap-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest mb-[-10px]">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-3">ISO Control - Clause/Annex A</div>
                        <div className="col-span-2">Current Gaps</div>
                        <div className="col-span-2">Interested Parties</div>
                        <div className="col-span-1">Threat</div>
                        <div className="col-span-2">Reference(s)</div>
                        <div className="col-span-1 text-right pr-4">Owner</div>
                    </div>

                    {rows.map((row) => (
                        <div key={row.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Top Section */}
                            <div className="grid grid-cols-12 gap-4 px-8 py-7 items-start">
                                <div className="col-span-1 text-base text-gray-500 font-medium pt-0.5">{row.id}.</div>
                                <div 
                                    className="col-span-3 text-sm text-gray-700 font-semibold leading-relaxed pr-4 cursor-pointer hover:text-primary-pink transition-colors"
                                    onClick={() => { setEditingRisk(row); setViewMode('EDIT'); }}
                                >
                                    {row.isoControl}
                                </div>
                                <div className="col-span-2 text-sm text-gray-500 leading-relaxed pr-4">{row.currentGaps}</div>
                                <div className="col-span-2 text-sm text-gray-500 leading-relaxed pr-4">{row.interestedParties}</div>
                                <div className="col-span-1 text-sm text-gray-500">{row.threat}</div>
                                <div className="col-span-2 text-sm text-gray-500">{row.migrationReference}</div>
                                <div className="col-span-1 flex flex-col items-center gap-1.5">
                                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                                        <div className="bg-gray-100 w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">NA</div>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{row.owner}</span>
                                </div>
                            </div>

                            {/* Bottom Detail Section */}
                            <div className="bg-[#FBFBFC] px-8 py-7 border-t border-gray-50 grid grid-cols-12 gap-6 items-start">
                                {/* Risk Level Controls */}
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Level</div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <span className="text-[10px] text-gray-400 block mb-1 font-bold">Prob.</span>
                                            <select
                                                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary-pink transition-all"
                                                value={row.probability}
                                                onChange={(e) => handleUpdateField(row.id, 'probability', e.target.value)}
                                            >
                                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[10px] text-gray-400 block mb-1 font-bold">Impact</span>
                                            <select
                                                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary-pink transition-all"
                                                value={row.impact}
                                                onChange={(e) => handleUpdateField(row.id, 'impact', e.target.value)}
                                            >
                                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="h-8 w-full bg-primary-pink rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-pink-100 mt-2">
                                        {parseInt(row.probability || 1) * parseInt(row.impact || 1)}
                                    </div>
                                </div>

                                {/* Response Select */}
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Response</div>
                                    <select
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-pink transition-all h-10 mt-5"
                                        value={row.response}
                                        onChange={(e) => handleUpdateField(row.id, 'response', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Mitigate">Mitigate</option>
                                        <option value="Accept">Accept</option>
                                        <option value="Avoid">Avoid</option>
                                        <option value="Transfer">Transfer</option>
                                    </select>
                                </div>

                                {/* Recommended Action */}
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Action</div>
                                    <textarea
                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm h-24 outline-none focus:border-primary-pink transition-all resize-none shadow-sm"
                                        value={row.recommendedAction}
                                        onChange={(e) => handleUpdateField(row.id, 'recommendedAction', e.target.value)}
                                        placeholder="Enter actions..."
                                    />
                                </div>

                                {/* Responsible */}
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Responsible</div>
                                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                        {(() => {
                                            const responsibleUser = organizationUsers?.find(u => String(u.id) === String(row.owner));
                                            const displayName = responsibleUser ? `${responsibleUser.firstName} ${responsibleUser.lastName || ""}` : row.owner;
                                            return (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-primary-pink/10 border-2 border-primary-pink/20 flex items-center justify-center text-primary-pink font-bold text-sm overflow-hidden shrink-0">
                                                        {responsibleUser?.avatar ? (
                                                            <img src={responsibleUser.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{displayName?.[0] || "U"}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs text-gray-800 font-bold truncate leading-tight">{responsibleUser?.firstName || row.owner}</span>
                                                        <span className="text-[10px] text-gray-400 font-semibold truncate leading-tight">{responsibleUser?.lastName || ""}</span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</div>
                                    <div className="relative group">
                                        <input
                                            type="date"
                                            value={row.dueDate ? row.dueDate.split('T')[0] : ""}
                                            onChange={(e) => handleUpdateField(row.id, 'dueDate', e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-pink transition-all appearance-none"
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</div>
                                    <select
                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs outline-none font-bold text-gray-600 focus:border-primary-pink transition-all"
                                        value={row.status}
                                        onChange={(e) => handleUpdateField(row.id, 'status', e.target.value)}
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>

                                {/* Task */}
                                <div className="col-span-1 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Task</div>
                                    <div className="flex flex-col items-end gap-1.5 pt-1">
                                        <div className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {row.task || "N/A"}
                                        </div>
                                        <button 
                                            onClick={() => handleOpenAddTask(row)}
                                            className="text-primary-pink hover:text-pink-600 transition-colors"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide-over Panel for New Risk */}
            {isSidePanelOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998]" onClick={() => setIsSidePanelOpen(false)} />
                    <div className="fixed top-0 right-0 w-full max-w-lg h-full bg-white shadow-2xl z-[999] p-8 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-2xl font-semibold text-gray-800">Create New Risk</h4>
                            <button onClick={() => setIsSidePanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XMarkIcon className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <div className="space-y-6 pb-24">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ISO Control</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                    value={newRiskData.isoControl}
                                    onChange={(e) => setNewRiskData(prev => ({ ...prev, isoControl: e.target.value }))}
                                >
                                    <option value="">Select Control</option>
                                    <option value="ISO 27001 A.5.1">ISO 27001 A.5.1</option>
                                    <option value="ISO 27001 A.8.1">ISO 27001 A.8.1</option>
                                    <option value="ISO 27001 A.9.1">ISO 27001 A.9.1</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Current Gaps</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm h-32 focus:ring-2 focus:ring-primary-pink/20 outline-none resize-none transition-all"
                                    placeholder="Describe current gaps..."
                                    value={newRiskData.currentGaps}
                                    onChange={(e) => setNewRiskData(prev => ({ ...prev, currentGaps: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Interested Parties</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                    value={newRiskData.interestedParties}
                                    onChange={(e) => setNewRiskData(prev => ({ ...prev, interestedParties: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Threat</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                        value={newRiskData.threat}
                                        onChange={(e) => setNewRiskData(prev => ({ ...prev, threat: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Reference(s)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                        value={newRiskData.migrationReference}
                                        onChange={(e) => setNewRiskData(prev => ({ ...prev, migrationReference: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                    value={newRiskData.owner}
                                    onChange={(e) => setNewRiskData(prev => ({ ...prev, owner: e.target.value }))}
                                >
                                    <option value="">Select Owner</option>
                                    {userOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Probability</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                        value={newRiskData.probability}
                                        onChange={(e) => setNewRiskData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Impact</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all"
                                        value={newRiskData.impact}
                                        onChange={(e) => setNewRiskData(prev => ({ ...prev, impact: parseInt(e.target.value) }))}
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-100 mt-8">
                                <button
                                    onClick={() => setIsSidePanelOpen(false)}
                                    className="flex-1 max-w-[160px] py-3.5 rounded-lg border border-[#475569] text-[#475569] font-medium hover:bg-gray-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateRisk}
                                    className="flex-[4] bg-primary-pink text-white py-3.5 rounded-lg font-medium shadow-sm hover:bg-pink-600 transition-all active:scale-[0.99] text-sm"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Add Task Modal */}
            <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                riskId={selectedRiskForTask?.databaseId || selectedRiskForTask?.id}
                existingTasks={selectedRiskForTask?.tasks || []}
                onTasksUpdated={() => {
                    fetchData();
                    setIsAddTaskModalOpen(false);
                }}
            />
        </div>
    );
};

export default RiskManagementOverview;
