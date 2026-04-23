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
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const userOptions = organizationUsers?.map(u => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName || ""}`.trim()
    })) || [];

    if (viewMode === 'EDIT' && editingRisk) {
        return <RiskEditView risk={editingRisk} userOptions={userOptions} onBack={() => setViewMode('OVERVIEW')} onUpdate={() => { fetchData(); setViewMode('OVERVIEW'); }} />;
    }

    return (
        <div className="bg-[#F8F9FD] min-h-screen p-6 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-8">
                


                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <span className="text-4xl font-normal text-gray-500 mb-1">{stats.total}</span>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">All</span>
                    </div>
                    <div className="bg-white rounded-xl p-8 border-2 border-red-400 shadow-sm flex flex-col items-center justify-center">
                        <span className="text-4xl font-normal text-gray-500 mb-1">{stats.todo}</span>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">To Do</span>
                    </div>
                    <div className="bg-white rounded-xl p-8 border-2 border-yellow-400 shadow-sm flex flex-col items-center justify-center">
                        <span className="text-4xl font-normal text-gray-500 mb-1">{stats.inProgress}</span>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">In Progress</span>
                    </div>
                    <div className="bg-white rounded-xl p-8 border-2 border-green-400 shadow-sm flex flex-col items-center justify-center">
                        <span className="text-4xl font-normal text-gray-500 mb-1">{stats.done}</span>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Done</span>
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
                        onClick={() => { setEditingRisk(null); setFormData(initialFormState); setIsSidePanelOpen(true); }}
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
                                <div className="col-span-3 text-sm text-gray-700 font-semibold leading-relaxed pr-4">{row.isoControl}</div>
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
                                            <span className="text-[11px] text-gray-400 block mb-1">Probability</span>
                                            <select 
                                                className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm outline-none"
                                                value={row.probability}
                                                onChange={(e) => handleUpdateField(row.id, 'probability', e.target.value)}
                                            >
                                                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[11px] text-gray-400 block mb-1">Impact</span>
                                            <select 
                                                className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm outline-none"
                                                value={row.impact}
                                                onChange={(e) => handleUpdateField(row.id, 'impact', e.target.value)}
                                            >
                                                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="h-7 w-full bg-primary-pink rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-pink-100">
                                        {parseInt(row.probability || 1) * parseInt(row.impact || 1)}
                                    </div>
                                </div>

                                {/* Response Select */}
                                <div className="col-span-1.5 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Response</div>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm outline-none"
                                        value={row.response}
                                        onChange={(e) => handleUpdateField(row.id, 'response', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Mitigate">Mitigate</option>
                                        <option value="Accept">Accept</option>
                                    </select>
                                </div>

                                {/* Recommended Action */}
                                <div className="col-span-4 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Action</div>
                                    <textarea 
                                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm h-24 outline-none focus:border-primary-pink transition-colors resize-none"
                                        value={row.recommendedAction}
                                        onChange={(e) => handleUpdateField(row.id, 'recommendedAction', e.target.value)}
                                    />
                                </div>

                                {/* Responsible */}
                                <div className="col-span-1.5 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-2">Responsible</div>
                                    <div className="flex items-center gap-2 justify-end">
                                        {(() => {
                                            const responsibleUser = organizationUsers?.find(u => String(u.id) === String(row.owner));
                                            const displayName = responsibleUser ? `${responsibleUser.firstName} ${responsibleUser.lastName || ""}` : row.owner;
                                            return (
                                                <>
                                                    <div className="w-9 h-9 rounded-full bg-primary-pink/10 border border-primary-pink/20 flex items-center justify-center text-primary-pink font-bold text-xs overflow-hidden">
                                                        {responsibleUser?.avatar ? (
                                                            <img src={responsibleUser.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{displayName?.[0] || "U"}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-600 font-semibold">{displayName}</span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="col-span-1.5 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Due Date</div>
                                    <FormInput
                                        name="dueDate"
                                        type="date"
                                        value={row.dueDate ? row.dueDate.split('T')[0] : ""}
                                        onChange={(e) => handleUpdateField(row.id, 'dueDate', e.target.value)}
                                        showLabel={false}
                                        className="w-full bg-white text-sm"
                                    />
                                </div>

                                {/* Status */}
                                <div className="col-span-1.5 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Status</div>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-2 text-xs outline-none font-bold text-gray-600"
                                        value={row.status}
                                        onChange={(e) => handleUpdateField(row.id, 'status', e.target.value)}
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>

                                {/* Task */}
                                <div className="col-span-1 space-y-2">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Task</div>
                                    <div className="text-right text-xs font-bold text-gray-400 pt-2">{row.task}</div>
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
                        {/* Form fields here */}
                    </div>
                </>
            )}
        </div>
    );
};

export default RiskManagementOverview;
