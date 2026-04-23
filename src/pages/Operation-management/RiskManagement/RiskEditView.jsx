import React, { useState, useEffect } from "react";
import FormSelect from "../../../components/FormSelect.jsx";
import {
    PlusIcon,
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import riskApi from "../../../utils/riskApi.js";
import { useToasts } from "react-toast-notifications";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";
import { useSelector } from "react-redux";
import { selectUser } from "../../../state/slice/authSlice.js";
import AddTaskModal from "./AddTaskModal.jsx";

const RiskEditView = ({ risk, userOptions, onBack, onUpdate }) => {
    const user = useSelector(selectUser);
    const organizationID = user?.organization?.id;
    const userId = user?.id;
    const { addToast } = useToasts();
    const [formData, setFormData] = useState({
        isoControl: risk.isoControl || "",
        currentGaps: risk.currentGaps || "",
        interestedParties: risk.interestedParties || "",
        threat: risk.threat || "",
        migrationReference: risk.migrationReference || "",
        owner: risk.owner || "",
        probability: risk.probability || 1,
        impact: risk.impact || 1,
        response: risk.response || "",
        recommendedAction: risk.recommendedAction || "",
        dueDate: risk.dueDate || "",
        status: risk.status || "To Do",
        ...risk
    });

    // Get created by user name from userOptions
    const getCreatedByUserName = () => {
        if (risk.createdByUserName) {
            return risk.createdByUserName;
        }
        if (risk.createdByFirstName && risk.createdByLastName) {
            return `${risk.createdByFirstName} ${risk.createdByLastName}`;
        }
        if (risk.createdBy && userOptions && userOptions.length > 0) {
            const createdByUser = userOptions.find(user => user.value === risk.createdBy || user.value === parseInt(risk.createdBy));
            if (createdByUser) {
                return createdByUser.label;
            }
        }
        return '-';
    };

    const [reassessments, setReassessments] = useState([]);
    const [isAddingReassessment, setIsAddingReassessment] = useState(false);
    const [editingReassessmentId, setEditingReassessmentId] = useState(null);
    const [originalReassessment, setOriginalReassessment] = useState(null); // Store original reassessment when editing
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [reassessmentToDeleteId, setReassessmentToDeleteId] = useState(null);
    const [isLoadingReassessments, setIsLoadingReassessments] = useState(false);
    const [newReassessment, setNewReassessment] = useState({
        reassessmentDate: new Date().toISOString().split('T')[0],
        comments: "",
        newProbability: 1,
        newImpact: 1
    });
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // Load reassessments on component mount
    useEffect(() => {
        const loadReassessments = async () => {
            if (risk?.id) {
                try {
                    setIsLoadingReassessments(true);
                    const response = await riskApi.listReassessments(risk.id);
                    if (response?.data?.body) {
                        // Map backend response to frontend format
                        const mappedReassessments = response.data.body.map(ra => ({
                            id: ra.id,
                            reassessmentDate: ra.reassessmentDate || ra.createdAt,
                            comments: ra.comments || "",
                            newProbability: ra.newProbability,
                            newImpact: ra.newImpact
                        }));
                        setReassessments(mappedReassessments);
                    }
                } catch (error) {
                    console.error("Error loading reassessments:", error);
                    // If endpoint doesn't exist, just set empty array
                    setReassessments([]);
                } finally {
                    setIsLoadingReassessments(false);
                }
            }
        };
        loadReassessments();
    }, [risk?.id]);

    // ISO control options
    const isoControlOptions = [
        { value: "ISO 27001 A.5.1", label: "ISO 27001 A.5.1" },
        { value: "ISO 27001 A.8.1", label: "ISO 27001 A.8.1" },
        { value: "ISO 27001 A.9.1", label: "ISO 27001 A.9.1" },
    ];

    const scoreOptions = [1, 2, 3, 4, 5].map(v => ({ value: v, label: v }));

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            // Only send updatable fields to backend
            const updateData = {
                isoControl: formData.isoControl || "",
                currentGaps: formData.currentGaps || "",
                interestedParties: formData.interestedParties || "",
                threat: formData.threat || "",
                migrationReference: formData.migrationReference || "",
                owner: formData.owner || "",
                probability: formData.probability || 1,
                impact: formData.impact || 1,
                response: formData.response || "",
                recommendedAction: formData.recommendedAction || "",
                dueDate: formData.dueDate || "",
                status: formData.status || "To Do",
                title: formData.isoControl || "Untitled Risk"
            };

            await onUpdate(risk.id, updateData);
            addToast("Risk updated successfully", { appearance: "success" });
        } catch (error) {
            console.error("Error updating risk:", error);
            addToast("Failed to update risk", { appearance: "error" });
        }
    };

    const handleAddReassessment = async () => {
        if (!risk?.id || !organizationID || !userId) {
            addToast("Missing required information to save reassessment", { appearance: "error" });
            return;
        }

        try {
            const previousProbability = risk.probability || 1;
            const previousImpact = risk.impact || 1;
            const previousRiskLevel = risk.riskLevel || "Low";

            const reassessmentData = {
                riskID: risk.id,
                previousProbability,
                previousImpact,
                previousRiskLevel,
                newProbability: newReassessment.newProbability,
                newImpact: newReassessment.newImpact,
                comments: newReassessment.comments || null,
                reassessedBy: userId,
                organizationID: organizationID,
                createdBy: userId,
                updatedBy: userId
            };

            const response = await riskApi.createReassessment(reassessmentData);
            addToast("Reassessment saved successfully", { appearance: "success" });

            const savedReassessmentId = response?.data?.body?.id || response?.data?.id || Date.now();

            // Add the new reassessment to local state immediately
            const newReassessmentItem = {
                id: savedReassessmentId,
                reassessmentDate: newReassessment.reassessmentDate || new Date().toISOString().split('T')[0],
                comments: newReassessment.comments || "",
                newProbability: newReassessment.newProbability,
                newImpact: newReassessment.newImpact
            };

            setReassessments(prev => {
                // Check if already exists to avoid duplicates
                if (prev.some(r => r.id === savedReassessmentId)) return prev;
                return [...prev, newReassessmentItem].sort((a, b) => {
                    const dateA = new Date(a.reassessmentDate);
                    const dateB = new Date(b.reassessmentDate);
                    return dateB - dateA;
                });
            });

            setIsAddingReassessment(false);
            setNewReassessment({
                reassessmentDate: new Date().toISOString().split('T')[0],
                comments: "",
                newProbability: 1,
                newImpact: 1
            });

            try {
                const listResponse = await riskApi.listReassessments(risk.id);
                if (listResponse?.data?.body && Array.isArray(listResponse.data.body)) {
                    const mappedReassessments = listResponse.data.body.map(ra => ({
                        id: ra.id,
                        reassessmentDate: ra.reassessmentDate || ra.createdAt,
                        comments: ra.comments || "",
                        newProbability: ra.newProbability,
                        newImpact: ra.newImpact
                    })).sort((a, b) => new Date(b.reassessmentDate) - new Date(a.reassessmentDate));

                    setReassessments(prev => {
                        // Merge server items with local items to avoid deleting recently added rows during server lag
                        const merged = [...mappedReassessments];
                        prev.forEach(localItem => {
                            if (!mappedReassessments.some(s => s.id === localItem.id)) {
                                merged.push(localItem);
                            }
                        });
                        return merged.sort((a, b) => new Date(b.reassessmentDate) - new Date(a.reassessmentDate));
                    });
                }
            } catch (error) {
                console.error("Error reloading reassessments:", error);
            }


        } catch (error) {
            console.error("Error saving reassessment:", error);
            addToast("Failed to save reassessment", { appearance: "error" });
        }
    };

    const handleEditReassessment = (id) => {
        const reassessment = reassessments.find(r => r.id === id);
        if (reassessment) {
            setOriginalReassessment({ ...reassessment });
            setEditingReassessmentId(id);
            setNewReassessment({ ...reassessment });
            setIsAddingReassessment(false); // Make sure we're not in "adding" mode
        }
    };

    const handleDeleteReassessment = (id) => {
        setReassessmentToDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDeleteReassessment = async () => {
        if (!reassessmentToDeleteId) return;

        const idToDelete = reassessmentToDeleteId;

        // Close dialog first
        setIsDeleteDialogOpen(false);
        setReassessmentToDeleteId(null);

        try {
            // Remove from local state immediately (optimistic update)
            setReassessments(prev => prev.filter(r => r.id !== idToDelete));

            // Delete from server
            await riskApi.deleteReassessment(idToDelete);

            // Show success notification only once
            addToast("Reassessment deleted successfully", { appearance: "success" });

            // Reload reassessments from server to ensure sync
            try {
                const response = await riskApi.listReassessments(risk.id);
                if (response?.data?.body && Array.isArray(response.data.body)) {
                    const mappedReassessments = response.data.body.map(ra => ({
                        id: ra.id,
                        reassessmentDate: ra.reassessmentDate || ra.createdAt,
                        comments: ra.comments || "",
                        newProbability: ra.newProbability,
                        newImpact: ra.newImpact
                    }));
                    setReassessments(mappedReassessments);
                }
            } catch (error) {
                console.error("Error reloading reassessments:", error);
                // If reload fails, the optimistic update above will keep the item removed
            }
        } catch (error) {
            console.error("Error deleting reassessment:", error);
            addToast("Failed to delete reassessment", { appearance: "error" });

            // Reload to restore the item if delete failed
            try {
                const response = await riskApi.listReassessments(risk.id);
                if (response?.data?.body && Array.isArray(response.data.body)) {
                    const mappedReassessments = response.data.body.map(ra => ({
                        id: ra.id,
                        reassessmentDate: ra.reassessmentDate || ra.createdAt,
                        comments: ra.comments || "",
                        newProbability: ra.newProbability,
                        newImpact: ra.newImpact
                    }));
                    setReassessments(mappedReassessments);
                }
            } catch (reloadError) {
                console.error("Error reloading reassessments after delete failure:", reloadError);
            }
        }
    };

    const handleCancelReassessment = () => {
        setIsAddingReassessment(false);
        setEditingReassessmentId(null);
        setOriginalReassessment(null);
        setNewReassessment({
            reassessmentDate: new Date().toISOString().split('T')[0],
            comments: "",
            newProbability: 1,
            newImpact: 1
        });
    };

    const handleSaveReassessment = async () => {
        if (editingReassessmentId) {
            if (!risk?.id || !organizationID || !userId) {
                addToast("Missing required information to update reassessment", { appearance: "error" });
                return;
            }

            try {
                const updateData = {
                    newProbability: newReassessment.newProbability,
                    newImpact: newReassessment.newImpact,
                    comments: newReassessment.comments || null,
                    reassessmentDate: newReassessment.reassessmentDate,
                    updatedBy: userId
                };

                await riskApi.updateReassessment(editingReassessmentId, updateData);
                addToast("Reassessment updated successfully", { appearance: "success" });

                try {
                    const response = await riskApi.listReassessments(risk.id);
                    if (response?.data?.body && Array.isArray(response.data.body)) {
                        const mappedReassessments = response.data.body.map(ra => ({
                            id: ra.id,
                            reassessmentDate: ra.reassessmentDate || ra.createdAt,
                            comments: ra.comments || "",
                            newProbability: ra.newProbability,
                            newImpact: ra.newImpact
                        })).sort((a, b) => new Date(b.reassessmentDate) - new Date(a.reassessmentDate));

                        setReassessments(prev => {
                            const merged = [...mappedReassessments];
                            prev.forEach(localItem => {
                                if (!mappedReassessments.some(s => s.id === localItem.id)) {
                                    merged.push(localItem);
                                }
                            });
                            return merged.sort((a, b) => new Date(b.reassessmentDate) - new Date(a.reassessmentDate));
                        });
                    }
                } catch (error) {
                    console.error("Error reloading reassessments:", error);
                    setReassessments(prev => prev.map(r =>
                        r.id === editingReassessmentId ? { ...r, ...newReassessment } : r
                    ));
                }

                setIsAddingReassessment(false);
                setEditingReassessmentId(null);
                setOriginalReassessment(null);
                setNewReassessment({
                    reassessmentDate: new Date().toISOString().split('T')[0],
                    comments: "",
                    newProbability: 1,
                    newImpact: 1
                });
            } catch (error) {
                console.error("Error updating reassessment:", error);
                addToast("Failed to update reassessment", { appearance: "error" });
            }
        } else {
            await handleAddReassessment();
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30 rounded-t-3xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-600 shadow-sm"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                            <span>Risk Management</span>
                            <span>/</span>
                            <span className="text-gray-900 font-bold"># {risk.id}</span>
                        </div>
                        <div className="flex gap-6 mt-1 text-[11px] font-bold uppercase tracking-wider">
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-400">Created Date :</span>
                                <span className="text-gray-600">{risk.createdAt ? new Date(risk.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-400">Created By :</span>
                                <span className="text-gray-600">{getCreatedByUserName()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Linked Task</span>
                        <span className="text-xs font-bold text-primary-pink">{risk.task || "None"}</span>
                    </div>
                    <button
                        onClick={() => setIsAddTaskModalOpen(true)}
                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-primary-pink hover:bg-gray-50 transition-all shadow-sm"
                        title="Link Task"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-primary-pink text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95 shadow-pink-100 uppercase tracking-widest text-xs"
                    >
                        Update
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="p-10 space-y-8 max-w-7xl">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">ISO Control</label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all appearance-none cursor-pointer"
                        value={formData.isoControl}
                        onChange={(e) => handleInputChange('isoControl', e.target.value)}
                    >
                        <option value="">Select Control</option>
                        {isoControlOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Current Gaps</label>
                    <textarea
                        className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-base h-32 focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm resize-none transition-all leading-relaxed"
                        value={formData.currentGaps}
                        onChange={(e) => handleInputChange('currentGaps', e.target.value)}
                        placeholder="Describe current gaps..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Interested Parties</label>
                    <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                        value={formData.interestedParties}
                        onChange={(e) => handleInputChange('interestedParties', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Threat</label>
                        <input
                            type="text"
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.threat}
                            onChange={(e) => handleInputChange('threat', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Reference(s)</label>
                        <input
                            type="text"
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.migrationReference}
                            onChange={(e) => handleInputChange('migrationReference', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Owner</label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all appearance-none cursor-pointer"
                        value={formData.owner}
                        onChange={(e) => handleInputChange('owner', e.target.value)}
                    >
                        <option value="">Select Owner</option>
                        {userOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                {/* New Fields Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Initial Probability</label>
                        <select
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.probability}
                            onChange={(e) => handleInputChange('probability', e.target.value)}
                        >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Initial Impact</label>
                        <select
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.impact}
                            onChange={(e) => handleInputChange('impact', e.target.value)}
                        >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Response</label>
                        <select
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.response}
                            onChange={(e) => handleInputChange('response', e.target.value)}
                        >
                            <option value="">Select Response</option>
                            <option value="Mitigate">Mitigate</option>
                            <option value="Accept">Accept</option>
                            <option value="Avoid">Avoid</option>
                            <option value="Transfer">Transfer</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Status</label>
                        <select
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Due Date</label>
                        <input
                            type="date"
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all"
                            value={formData.dueDate ? formData.dueDate.split('T')[0] : ""}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Recommended Action</label>
                        <textarea
                            className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-base h-32 focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm resize-none transition-all"
                            value={formData.recommendedAction}
                            onChange={(e) => handleInputChange('recommendedAction', e.target.value)}
                            placeholder="Describe recommended actions..."
                        />
                    </div>
                </div>
            </div>

            {/* Residual Risk Section */}
            <div className="p-10 border-t border-gray-100 mt-10">
                <div className="flex items-center gap-4 mb-8">
                    <h4 className="text-2xl font-bold text-gray-800">Residual Risk</h4>
                    <button
                        onClick={() => setIsAddingReassessment(true)}
                        className="flex items-center gap-1.5 text-primary-pink hover:text-pink-600 transition-colors group"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-primary-pink flex items-center justify-center group-hover:bg-primary-pink group-hover:text-white transition-all">
                            <PlusIcon className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-wider">Add New</span>
                    </button>
                </div>

                <div className="overflow-hidden border border-gray-100 rounded-3xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-5 w-20">#</th>
                                <th className="px-6 py-5">Re-Assessment Date</th>
                                <th className="px-6 py-5">Re-Assessment Comment(s)</th>
                                <th className="px-6 py-5 w-32">Probability</th>
                                <th className="px-6 py-5 w-32">Impact</th>
                                <th className="px-6 py-5 w-32">Score</th>
                                <th className="px-6 py-5 w-32 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reassessments.map((ra, idx) => {
                                const isEditing = editingReassessmentId === ra.id;
                                if (isEditing) {
                                    return (
                                        <tr key={ra.id} className="bg-gray-50/20">
                                            <td className="px-6 py-6 font-bold text-gray-300 text-sm">{(idx + 1).toString().padStart(2, '0')}</td>
                                            <td className="px-6 py-6">
                                                <input
                                                    type="date"
                                                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                                    value={newReassessment.reassessmentDate}
                                                    onChange={(e) => setNewReassessment(prev => ({ ...prev, reassessmentDate: e.target.value }))}
                                                />
                                            </td>
                                            <td className="px-6 py-6">
                                                <input
                                                    type="text"
                                                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                                    value={newReassessment.comments}
                                                    onChange={(e) => setNewReassessment(prev => ({ ...prev, comments: e.target.value }))}
                                                />
                                            </td>
                                            <td className="px-6 py-6">
                                                <select
                                                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                                    value={newReassessment.newProbability}
                                                    onChange={(e) => setNewReassessment(prev => ({ ...prev, newProbability: parseInt(e.target.value) }))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-6 py-6">
                                                <select
                                                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                                    value={newReassessment.newImpact}
                                                    onChange={(e) => setNewReassessment(prev => ({ ...prev, newImpact: parseInt(e.target.value) }))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-sm font-bold text-gray-400">{newReassessment.newProbability * newReassessment.newImpact}</span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={handleSaveReassessment} className="p-1 text-primary-pink hover:bg-pink-50 rounded shadow-sm"><CheckCircleIcon className="w-5 h-5" /></button>
                                                    <button onClick={handleCancelReassessment} className="p-1 text-gray-400 hover:bg-gray-50 rounded shadow-sm"><XMarkIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                                return (
                                    <tr key={ra.id || idx} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-6 font-bold text-gray-400 text-sm">{(idx + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-6 py-6 text-sm text-gray-600 font-medium whitespace-nowrap">
                                            {ra.reassessmentDate ? new Date(ra.reassessmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                                        </td>
                                        <td className="px-6 py-6 text-sm text-gray-500 leading-relaxed max-w-md truncate" title={ra.comments}>{ra.comments}</td>
                                        <td className="px-6 py-6 text-sm font-bold text-gray-700">{ra.newProbability}</td>
                                        <td className="px-6 py-6 text-sm font-bold text-gray-700">{ra.newImpact}</td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-bold text-white shadow-sm ${ra.newProbability * ra.newImpact >= 15 ? 'bg-primary-pink' :
                                                ra.newProbability * ra.newImpact >= 5 ? 'bg-orange-400' : 'bg-emerald-500'
                                                }`}>
                                                {ra.newProbability * ra.newImpact}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditReassessment(ra.id)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReassessment(ra.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* Inline Add Row */}
                            {isAddingReassessment && (
                                <tr className="bg-gray-50/20">
                                    <td className="px-6 py-6 font-bold text-gray-300 text-sm">{(reassessments.length + 1).toString().padStart(2, '0')}</td>
                                    <td className="px-6 py-6">
                                        <input
                                            type="date"
                                            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                            value={newReassessment.reassessmentDate}
                                            onChange={(e) => setNewReassessment(prev => ({ ...prev, reassessmentDate: e.target.value }))}
                                        />
                                    </td>
                                    <td className="px-6 py-6">
                                        <input
                                            type="text"
                                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                            placeholder="Add comments..."
                                            value={newReassessment.comments}
                                            onChange={(e) => setNewReassessment(prev => ({ ...prev, comments: e.target.value }))}
                                        />
                                    </td>
                                    <td className="px-6 py-6">
                                        <select
                                            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                            value={newReassessment.newProbability}
                                            onChange={(e) => setNewReassessment(prev => ({ ...prev, newProbability: parseInt(e.target.value) }))}
                                        >
                                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-6">
                                        <select
                                            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-pink/20 outline-none w-full"
                                            value={newReassessment.newImpact}
                                            onChange={(e) => setNewReassessment(prev => ({ ...prev, newImpact: parseInt(e.target.value) }))}
                                        >
                                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-sm font-bold text-gray-400">{newReassessment.newProbability * newReassessment.newImpact}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={handleSaveReassessment}
                                                className="p-1.5 text-white bg-primary-pink hover:bg-pink-600 rounded transition-all"
                                                title="Save"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleCancelReassessment}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                title="Cancel"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setReassessmentToDeleteId(null);
                }}
                onConfirm={handleConfirmDeleteReassessment}
                title="Delete Reassessment"
                message="Are you sure you want to delete this reassessment? This action cannot be undone."
            />
            <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                riskId={risk.id}
                existingTasks={risk.tasks || []}
                onTasksUpdated={() => {
                    // Ideally reload the risk data or update local state
                    addToast("Tasks updated", { appearance: "info" });
                }}
            />
        </div>
    );
};

export default RiskEditView;
