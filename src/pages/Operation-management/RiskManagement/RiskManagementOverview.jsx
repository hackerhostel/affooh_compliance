import React, { useState, useEffect } from "react";
import FormSelect from "../../../components/FormSelect.jsx";
import {
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PlusIcon,
    CheckCircleIcon
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

const RiskManagementOverview = ({ hideTitle = false }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    // Redux selectors
    const organizationUsers = useSelector(selectOrganizationUsers);
    const user = useSelector(selectUser);
    const organizationID = user?.organization?.id;

    // Local state
    const [rows, setRows] = useState([]);
    const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [openActionMenuIndex, setOpenActionMenuIndex] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [editingRisk, setEditingRisk] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [riskToDeleteId, setRiskToDeleteId] = useState(null);
    const [viewMode, setViewMode] = useState('OVERVIEW'); // 'OVERVIEW' or 'EDIT'
    const [expandedRowIds, setExpandedRowIds] = useState(new Set());
    const [pendingRecommendedActionUpdates, setPendingRecommendedActionUpdates] = useState(new Set()); // Track which rows have unsaved recommendedAction changes
    const [filters, setFilters] = useState({
        controlFilter: "",
        ownerFilter: "",
        complianceFilter: "",
        riskLevelFilter: "",
        statusFilter: ""
    });

    // Form state
    const initialFormState = {
        title: "Untitled Risk", // Fallback for API requirements if any
        description: "",
        isoControl: "",
        currentGaps: "",
        interestedParties: "",
        threat: "",
        migrationReference: "",
        owner: "",
        mitigationPlan: "",
        probability: 1,
        impact: 1,
        residualProbability: 1,
        residualImpact: 1,
        status: "To Do",
        recommendedAction: "",
        response: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchData = async () => {
        if (!organizationID) return;
        setIsLoading(true);
        try {
            const [risksRes, statsRes] = await Promise.all([
                riskApi.listRisks(organizationID),
                riskApi.getStats(organizationID)
            ]);
            const risks = risksRes.data.body || [];
            setRows(risks);
            setStats(statsRes.data.body || { total: 0, todo: 0, inProgress: 0, done: 0 });
            // Clear pending updates when data is refreshed
            setPendingRecommendedActionUpdates(new Set());
        } catch (error) {
            console.error("Error fetching risks:", error);
            addToast("Failed to load risks", { appearance: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e, value) => {
        const { name } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            controlFilter: "",
            ownerFilter: "",
            complianceFilter: "",
            riskLevelFilter: "",
            statusFilter: ""
        });
    };

    const filteredRows = React.useMemo(() => {
        return rows.filter(row => {
            // ISO Control Filter
            const matchesControl = !filters.controlFilter || row.isoControl === filters.controlFilter;

            // Owner Filter - handle both string and number comparison
            const matchesOwner = !filters.ownerFilter || String(row.owner) === String(filters.ownerFilter);

            // Risk Level Filter
            const score = (row.probability ?? 1) * (row.impact ?? 1);
            let rowLevel = row.riskLevel;
            if (!rowLevel) {
                rowLevel = score >= 15 ? "High" : score >= 5 ? "Medium" : "Low";
            }
            const matchesLevel = !filters.riskLevelFilter || rowLevel === filters.riskLevelFilter;

            // Status Filter
            const matchesStatus = !filters.statusFilter || row.status === filters.statusFilter;

            return matchesControl && matchesOwner && matchesLevel && matchesStatus;
        });
    }, [rows, filters]);


    useEffect(() => {
        if (organizationID) {
            fetchData();
        }
        if (!organizationUsers) {
            dispatch(doGetOrganizationUsers());
        }
    }, [dispatch, organizationUsers, organizationID]);

    const handleCreateRisk = async () => {
        if (!organizationID) {
            addToast("Organization not found. Please refresh the page.", { appearance: "error" });
            return;
        }
        try {
            await riskApi.createRisk({
                ...formData,
                title: formData.isoControl || "Untitled Risk", // Use ISO Control as title
                organizationID,
                createdBy: user?.id
            });
            addToast("Risk created successfully", { appearance: "success" });
            setIsSidePanelOpen(false);
            setFormData(initialFormState);
            fetchData();
        } catch (error) {
            console.error("Error creating risk:", error);
            addToast("Failed to create risk", { appearance: "error" });
        }
    };

    const handleUpdateRisk = async () => {
        try {
            await riskApi.updateRisk(editingRisk.id, {
                ...formData,
                title: formData.isoControl || "Untitled Risk",
                updatedBy: user?.id
            });
            addToast("Risk updated successfully", { appearance: "success" });
            setIsSidePanelOpen(false);
            setEditingRisk(null);
            setFormData(initialFormState);
            fetchData();
        } catch (error) {
            console.error("Error updating risk:", error);
            addToast("Failed to update risk", { appearance: "error" });
        }
    };

    const handleUpdateField = async (id, field, value, showSuccessToast = false) => {
        try {
            await riskApi.updateRisk(id, {
                [field]: value,
                updatedBy: user?.id
            });
            setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
            if (field === 'status' || field === 'probability' || field === 'impact') {
                const statsRes = await riskApi.getStats(organizationID);
                setStats(statsRes.data.body || stats);
            }
            if (showSuccessToast) {
                addToast("Updated successfully", { appearance: "success" });
                // Remove from pending updates after successful save
                if (field === 'recommendedAction') {
                    setPendingRecommendedActionUpdates(prev => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                }
            }
        } catch (error) {
            console.error("Error updating risk:", error);
            addToast("Failed to update risk", { appearance: "error" });
        }
    };

    const handleDeleteRisk = (id) => {
        setRiskToDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await riskApi.deleteRisk(riskToDeleteId);
            addToast("Risk deleted successfully", { appearance: "success" });
            setIsDeleteDialogOpen(false);
            setRiskToDeleteId(null);
            fetchData();
        } catch (error) {
            console.error("Error deleting risk:", error);
            addToast("Failed to delete risk", { appearance: "error" });
        }
    };

    const toggleExpand = (rowId) => {
        setExpandedRowIds(prev => {
            const next = new Set(prev);
            if (next.has(rowId)) next.delete(rowId);
            else next.add(rowId);
            return next;
        });
    };

    const handleEditClick = (row) => {
        setEditingRisk(row);
        setViewMode('EDIT');
    };

    const userOptions = organizationUsers?.map(user => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName || ""}`.trim()
    })) || [];

    // Extract unique ISO Control values from rows for filter dropdown
    const isoControlOptions = React.useMemo(() => {
        const uniqueControls = new Set();
        rows.forEach(row => {
            if (row.isoControl && row.isoControl.trim() !== "") {
                uniqueControls.add(row.isoControl);
            }
        });
        return Array.from(uniqueControls)
            .sort()
            .map(control => ({
                value: control,
                label: control
            }));
    }, [rows]);

    return (
        <div className="relative min-h-screen">
            {viewMode === 'EDIT' && editingRisk ? (
                <RiskEditView
                    risk={editingRisk}
                    userOptions={userOptions}
                    onBack={() => setViewMode('OVERVIEW')}
                    onUpdate={async (id, updates) => {
                        await riskApi.updateRisk(id, {
                            ...updates,
                            updatedBy: user?.id
                        });
                        fetchData();
                        setViewMode('OVERVIEW');
                    }}
                />
            ) : (
                <>
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {!hideTitle && <h1 className="text-xl font-semibold text-gray-800">Risk Management Overview</h1>}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "All", value: stats.total || 0, color: "border-gray-300" },
                                { label: "To Do", value: stats.todo || 0, color: "border-status-todo" },
                                { label: "In Progress", value: stats.inProgress || 0, color: "border-status-in-progress" },
                                { label: "Done", value: stats.done || 0, color: "border-status-done" }
                            ].map((card, idx) => (
                                <div key={idx} className={`bg-white border-2 ${card.color} rounded-xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-default group`}>
                                    <span className="text-4xl font-bold text-gray-700 group-hover:scale-110 transition-transform">{card.value}</span>
                                    <span className="text-gray-500 mt-2 font-medium tracking-wide uppercase text-xs">{card.label} Risks</span>
                                </div>
                            ))}
                        </div>

                        {/* Filters and Add New Button */}
                        <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex flex-wrap gap-3 items-center">
                                <div className="w-36">
                                    <FormSelect
                                        name="controlFilter"
                                        placeholder="ISO Control"
                                        options={[{ value: "", label: "All Controls" }, ...isoControlOptions]}
                                        showLabel={false}
                                        formValues={filters}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="w-36">
                                    <FormSelect
                                        name="ownerFilter"
                                        placeholder="Owner"
                                        options={[{ value: "", label: "All Owners" }, ...userOptions]}
                                        showLabel={false}
                                        formValues={filters}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="w-36">
                                    <FormSelect
                                        name="complianceFilter"
                                        placeholder="Compliance"
                                        options={[{ value: "", label: "All Compliance" }]}
                                        showLabel={false}
                                        formValues={filters}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="w-36">
                                    <FormSelect
                                        name="riskLevelFilter"
                                        placeholder="Level"
                                        options={[
                                            { value: '', label: 'All Levels' },
                                            { value: 'Low', label: 'Low' },
                                            { value: 'Medium', label: 'Medium' },
                                            { value: 'High', label: 'High' }
                                        ]}
                                        showLabel={false}
                                        formValues={filters}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="w-36">
                                    <FormSelect
                                        name="statusFilter"
                                        placeholder="Status"
                                        options={[
                                            { value: '', label: 'All Status' },
                                            { value: 'To Do', label: 'To Do' },
                                            { value: 'In Progress', label: 'In Progress' },
                                            { value: 'Done', label: 'Done' }
                                        ]}
                                        showLabel={false}
                                        formValues={filters}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-primary-pink transition-colors flex items-center gap-1 group"
                                    title="Clear all filters"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    <span>RESET</span>
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setEditingRisk(null);
                                    setFormData(initialFormState);
                                    setIsSidePanelOpen(true);
                                }}
                                className="flex items-center gap-2 bg-primary-pink text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95 shadow-pink-100 uppercase tracking-widest text-xs"
                            >
                                <PlusIcon className="w-4 h-4 stroke-[3px]" />
                                New Risk
                            </button>
                        </div>

                        {/* Risk List - Table layout with single header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {rows.length === 0 ? (
                                <div className="px-6 py-20 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            <XMarkIcon className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <span className="text-sm font-medium">{isLoading ? "Loading risk data..." : "No risks added yet."}</span>
                                        {!isLoading && <button onClick={() => setIsSidePanelOpen(true)} className="text-primary-pink text-xs font-bold hover:underline mt-1">Identify First Risk</button>}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Single Header Row */}
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                                        <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</div>
                                        <div className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider">ISO Control - Clause/Annex A</div>
                                        <div className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Current Gaps</div>
                                        <div className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Interested Parties</div>
                                        <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Threat</div>
                                        <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Reference(s)</div>
                                        <div className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Owner</div>
                                        <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</div>
                                    </div>

                                    {/* Data Rows */}
                                    <div className="divide-y divide-gray-100">
                                        {filteredRows.map((row, idx) => (
                                            <div key={row.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                                {/* Main Data Row */}
                                                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                                    <div className="col-span-1 text-sm text-gray-600 font-mono">{(idx + 1).toString().padStart(2, '0')}.</div>
                                                    <div className="col-span-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpand(row.id ?? idx)}
                                                            className="text-left w-full text-sm text-gray-700 font-medium leading-snug hover:text-primary-pink transition-colors cursor-pointer"
                                                        >
                                                            {row.isoControl || '-'}
                                                        </button>
                                                    </div>
                                                    <div className="col-span-2 text-sm text-gray-600 leading-relaxed line-clamp-2">{row.currentGaps || '-'}</div>
                                                    <div className="col-span-2 text-sm text-gray-600 leading-relaxed line-clamp-2">{row.interestedParties || '-'}</div>
                                                    <div className="col-span-1 text-sm text-gray-600">{row.threat || '-'}</div>
                                                    <div className="col-span-1 text-sm text-gray-600 font-mono">{row.migrationReference || '-'}</div>
                                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                                        {row.ownerAvatar ? (
                                                            <img src={row.ownerAvatar} className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white shadow-sm text-primary-pink font-bold text-sm">
                                                                {row.firstName?.[0] || ''}
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-bold text-gray-700">{row.firstName || ''}</span>
                                                    </div>
                                                    <div className="col-span-1 flex items-center justify-end">
                                                        {openActionMenuIndex === idx ? (
                                                            <div className="flex gap-1 bg-gray-100/80 p-1 rounded-lg border border-gray-200 animate-in fade-in duration-200">
                                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(row); }} className="p-1.5 hover:bg-white hover:text-blue-500 text-gray-400 rounded transition-all" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteRisk(row.id); }} className="p-1.5 hover:bg-white hover:text-red-500 text-gray-400 rounded transition-all" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); setOpenActionMenuIndex(null); }} className="p-1.5 hover:bg-white text-gray-400 rounded transition-all" title="Close"><XMarkIcon className="w-4 h-4" /></button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={(e) => { e.stopPropagation(); setOpenActionMenuIndex(idx); }} className="p-2 hover:bg-gray-100 text-gray-400 hover:text-primary-pink rounded-lg transition-all" title="Actions"><EllipsisVerticalIcon className="w-5 h-5" /></button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expanded Section: Risk Level, Response, Action details - visible when ISO control is clicked */}
                                                {expandedRowIds.has(row.id ?? idx) && (
                                                    <div className="bg-gray-50/30 px-6 py-5 border-t border-gray-100">
                                                        <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-start">
                                                            {/* Risk Level */}
                                                            <div className="col-span-2">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Risk Level</div>
                                                                <div className="flex gap-2 mb-2">
                                                                    <div className="flex-1">
                                                                        <label className="text-xs text-gray-400 block mb-0.5">Probability</label>
                                                                        <select
                                                                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink outline-none"
                                                                            value={row.probability ?? 1}
                                                                            onChange={(e) => handleUpdateField(row.id, 'probability', parseInt(e.target.value))}
                                                                        >
                                                                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <label className="text-xs text-gray-400 block mb-0.5">Impact</label>
                                                                        <select
                                                                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink outline-none"
                                                                            value={row.impact ?? 1}
                                                                            onChange={(e) => handleUpdateField(row.id, 'impact', parseInt(e.target.value))}
                                                                        >
                                                                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className={`rounded-lg py-2 px-3 text-center font-bold text-sm text-white ${(row.probability ?? 1) * (row.impact ?? 1) >= 15 ? 'bg-primary-pink' : (row.probability ?? 1) * (row.impact ?? 1) >= 5 ? 'bg-rose-400' : 'bg-emerald-500'}`}>
                                                                    {(row.probability ?? 1) * (row.impact ?? 1) || 5}
                                                                </div>
                                                            </div>

                                                            {/* Response */}
                                                            <div className="col-span-1">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Response</div>
                                                                <select
                                                                    className="w-full max-w-[110px] bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink outline-none"
                                                                    value={row.response || ""}
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
                                                            <div className="col-span-3">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended Action</div>
                                                                <div className="relative">
                                                                    <textarea
                                                                        className={`w-full bg-white border border-gray-200 rounded-lg p-3 ${pendingRecommendedActionUpdates.has(row.id) ? 'pr-10' : 'pr-3'} text-sm h-24 focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink outline-none resize-none`}
                                                                        value={row.recommendedAction || ""}
                                                                        onChange={(e) => {
                                                                            // Update local state only, don't save to server yet
                                                                            setRows(prev => prev.map(r => r.id === row.id ? { ...r, recommendedAction: e.target.value } : r));
                                                                            // Mark as pending update
                                                                            setPendingRecommendedActionUpdates(prev => {
                                                                                const next = new Set(prev);
                                                                                next.add(row.id);
                                                                                return next;
                                                                            });
                                                                        }}
                                                                        placeholder="Enter actions..."
                                                                    />
                                                                    {pendingRecommendedActionUpdates.has(row.id) && row.recommendedAction && row.recommendedAction.trim() !== "" && (
                                                                        <button
                                                                            onClick={() => handleUpdateField(row.id, 'recommendedAction', row.recommendedAction, true)}
                                                                            className="absolute bottom-2 right-2 p-1.5 bg-primary-pink hover:bg-pink-600 text-white rounded transition-all shadow-sm hover:shadow-md"
                                                                            title="Update"
                                                                        >
                                                                            <CheckCircleIcon className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Responsible */}
                                                            <div className="col-span-2">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Responsible</div>
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {row.ownerAvatar ? (
                                                                        <img src={row.ownerAvatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" alt="" />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white shadow-sm text-primary-pink font-bold text-sm">
                                                                            {row.firstName?.[0] || ''}
                                                                        </div>
                                                                    )}
                                                                    <span className="text-sm font-bold text-gray-700 truncate">{row.firstName || ''}</span>
                                                                </div>
                                                            </div>

                                                            {/* Due Date */}
                                                            <div className="col-span-2">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</div>
                                                                <input
                                                                    type="date"
                                                                    className="w-full min-w-[165px] bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70"
                                                                    value={row.dueDate ? row.dueDate.split('T')[0] : ""}
                                                                    onChange={(e) => handleUpdateField(row.id, 'dueDate', e.target.value)}
                                                                />
                                                            </div>

                                                            {/* Status */}
                                                            <div className="col-span-1">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</div>
                                                                <select
                                                                    className="w-full min-w-[120px] bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink outline-none"
                                                                    value={row.status || "To Do"}
                                                                    onChange={(e) => handleUpdateField(row.id, 'status', e.target.value)}
                                                                >
                                                                    <option value="To Do">To Do</option>
                                                                    <option value="In Progress">In Progress</option>
                                                                    <option value="Done">Done</option>
                                                                </select>
                                                            </div>

                                                            {/* Task */}
                                                            <div className="col-span-1">
                                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task</div>
                                                                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-600">
                                                                    AFF-{String(row.id || '').slice(-3) || '123'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Slide-over Panel */}
                    {isSidePanelOpen && (
                        <>
                            <div
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] animate-in fade-in duration-300"
                                onClick={() => setIsSidePanelOpen(false)}
                            />
                            <div className="fixed top-0 right-0 w-full max-w-lg h-full bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-500 overflow-y-auto">
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-2xl font-semibold text-gray-800">
                                            {editingRisk ? "Edit Risk" : "Create New Risk"}
                                        </h4>
                                        <button
                                            onClick={() => setIsSidePanelOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <XMarkIcon className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-500">ISO Control</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:bg-white outline-none appearance-none transition-all"
                                                    value={formData.isoControl}
                                                    onChange={(e) => setFormData({ ...formData, isoControl: e.target.value })}
                                                >
                                                    <option value="">Select Control</option>
                                                    <option value="ISO 27001 A.5.1">ISO 27001 A.5.1</option>
                                                    <option value="ISO 27001 A.8.1">ISO 27001 A.8.1</option>
                                                    <option value="ISO 27001 A.9.1">ISO 27001 A.9.1</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-500">Current Gaps</label>
                                            <textarea
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm h-32 focus:bg-white outline-none transition-all resize-none"
                                                placeholder="Describe current security gaps..."
                                                value={formData.currentGaps}
                                                onChange={(e) => setFormData({ ...formData, currentGaps: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-500">Interested Parties</label>
                                            <textarea
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm h-24 focus:bg-white outline-none transition-all resize-none"
                                                placeholder="List interested parties..."
                                                value={formData.interestedParties}
                                                onChange={(e) => setFormData({ ...formData, interestedParties: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-500">Threat</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:bg-white outline-none transition-all"
                                                placeholder="Describe the threat..."
                                                value={formData.threat}
                                                onChange={(e) => setFormData({ ...formData, threat: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-500">Reference(s)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:bg-white outline-none transition-all"
                                                placeholder="Enter references..."
                                                value={formData.migrationReference}
                                                onChange={(e) => setFormData({ ...formData, migrationReference: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-500">Owner</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:bg-white outline-none appearance-none transition-all text-gray-600"
                                                    value={formData.owner}
                                                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                                >
                                                    <option value="">Select Owner</option>
                                                    {userOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-6">
                                            <button
                                                onClick={() => setIsSidePanelOpen(false)}
                                                className="flex-1 py-4 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={editingRisk ? handleUpdateRisk : handleCreateRisk}
                                                className="flex-1 py-4 bg-primary-pink text-white rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs"
                                            >
                                                {editingRisk ? "Save Changes" : "Create"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Risk"
                message="Are you sure you want to delete this risk? This action cannot be undone."
            />
        </div>
    );
};

export default RiskManagementOverview;
