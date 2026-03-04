import React, { useState, useEffect } from "react";
import FormTextArea from "../../../components/FormTextArea.jsx";
import FormSelect from "../../../components/FormSelect.jsx";
import { reviewAuditApi } from "../../../utils/reviewAuditApi.js";
import { useToasts } from "react-toast-notifications";
import UserSelect from "../../../components/UserSelect.jsx";
import { useSelector } from "react-redux";
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";

const complianceOptions = [
    { label: "Non-Compliance", value: "Non-Compliance" },
    { label: "Partial Compliance", value: "Partial Compliance" },
    { label: "Compliance", value: "Compliance" },
    { label: "Observation", value: "Observation" }
];

const severityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
];

const implementationStatusOptions = [
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Done", value: "Done" },
];

const GapAnalysisOverview = ({ selectedDocument }) => {
    const { addToast } = useToasts();
    const [rows, setRows] = useState([]);
    const [stats, setStats] = useState({
        Compliance: 0,
        "Non-Compliance": 0,
        "Partial Compliance": 0,
        Observation: 0
    });
    const [saving, setSaving] = useState(false);

    // Get project users from Redux
    const projectUserList = useSelector(selectProjectUserList) || [];

    // Filters state
    const [filters, setFilters] = useState({
        control: "",
        assignee: "",
        compliance: "",
        severity: "",
        status: ""
    });

    // We fetch details to get stats and controls.
    const fetchControls = async () => {
        try {
            const detailRes = await reviewAuditApi.getReviewAuditDetail(selectedDocument.id);
            setStats(detailRes.data?.body?.stats || stats);

            const controlsRes = await reviewAuditApi.getAuditControls(selectedDocument.id);
            const controlsData = controlsRes.data?.body || [];
            const mappedRows = controlsData.map(c => ({
                standardControlID: c.standardControlID,
                clauseReference: c.clauseReference,
                description: c.description,
                evaluationId: c.evaluationId || 'new',
                currentGap: c.currentGap || "",
                complianceStatus: c.complianceStatus || "",
                severity: c.severity || "",
                recommendedAction: c.recommendedAction || "",
                responsibility: c.responsibility || "",
                dueDate: c.dueDate ? new Date(c.dueDate).toISOString().split('T')[0] : "",
                implementationStatus: c.implementationStatus || ""
            }));
            setRows(mappedRows);
        } catch (error) {
            addToast("Failed to fetch data", { appearance: "error" });
        }
    };

    useEffect(() => {
        if (selectedDocument) {
            fetchControls();
        }
    }, [selectedDocument]);

    const handleRowChange = (id, field, value) => {
        setRows((prev) =>
            prev.map((row) =>
                row.standardControlID === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all(rows.map(async (row) => {
                const payload = {
                    reviewAuditID: selectedDocument.id,
                    standardControlID: row.standardControlID,
                    currentGap: row.currentGap,
                    complianceStatus: row.complianceStatus,
                    severity: row.severity,
                    recommendedAction: row.recommendedAction,
                    responsibility: row.responsibility,
                    dueDate: row.dueDate,
                    implementationStatus: row.implementationStatus
                };
                await reviewAuditApi.updateControlEvaluation(row.evaluationId, payload);
            }));

            addToast("Controls updated successfully", { appearance: "success" });
            fetchControls();
        } catch (e) {
            addToast("Failed to save controls", { appearance: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            control: "",
            assignee: "",
            compliance: "",
            severity: "",
            status: ""
        });
    };

    const handleApproved = async () => {
        addToast("Audit approved (stub)", { appearance: "success" });
    };

    const handleArchived = async () => {
        addToast("Audit archived (stub)", { appearance: "success" });
    };

    const controlOptions = Array.from(new Set(rows.map(r => r.standardControlID))).map(id => {
        const row = rows.find(r => r.standardControlID === id);
        return { label: row.clauseReference || id.toString(), value: id.toString() };
    });

    const assigneeOptions = projectUserList.map(u => ({
        label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
        value: u.id.toString()
    }));

    const filteredRows = rows.filter(row => {
        const matchesControl = !filters.control || row.standardControlID.toString() === filters.control;
        const matchesAssignee = !filters.assignee || (row.responsibility && row.responsibility.toString() === filters.assignee);
        const matchesCompliance = !filters.compliance || row.complianceStatus === filters.compliance;
        const matchesSeverity = !filters.severity || row.severity === filters.severity;
        const matchesStatus = !filters.status || row.implementationStatus === filters.status;
        return matchesControl && matchesAssignee && matchesCompliance && matchesSeverity && matchesStatus;
    });

    return (
        <div>
            <div className="flex items-center justify-between px-4 mt-4">
                <span className="text-3xl font-semibold text-gray-800">{selectedDocument?.name || "Gap Analysis"}</span>
                <div className="flex space-x-2">
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white hover:opacity-90 transition-all font-medium" onClick={handleArchived}>
                        Archived
                    </button>
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white hover:opacity-90 transition-all font-medium" onClick={handleApproved}>
                        Approved
                    </button>
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white hover:opacity-90 transition-all font-medium" disabled={saving} onClick={handleSave}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            <div className='bg-white p-4 mt-5 flex rounded-lg gap-4'>
                <div className="flex-1">
                    <div className='border rounded-md border-secondary-bcg w-full py-6 bg-white'>
                        <div className='flex flex-col items-center justify-center gap-1 text-gray-700 h-full'>
                            <span className='text-3xl font-medium'>{stats['Compliance'] || 0}</span>
                            <span className='text-sm text-center'>Compliant</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className='border rounded-md border-pass-border-color w-full py-6 bg-white'>
                        <div className='flex flex-col items-center justify-center gap-1 text-gray-700 h-full'>
                            <span className='text-3xl font-medium'>{stats['Partial Compliance'] || 0}</span>
                            <span className='text-sm text-center'>Partially Compliant</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className='border rounded-md border-priority-high w-full py-6 bg-white'>
                        <div className='flex flex-col items-center justify-center gap-1 text-gray-700 h-full'>
                            <span className='text-3xl font-medium'>{stats['Non-Compliance'] || 0}</span>
                            <span className='text-sm text-center'>Non-Compliant</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className='border rounded-md border-pending-border-color w-full py-6 bg-white'>
                        <div className='flex flex-col items-center justify-center gap-1 text-gray-700 h-full'>
                            <span className='text-3xl font-medium'>{stats['Observation'] || 0}</span>
                            <span className='text-sm text-center'>Observations</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 px-4 mt-4">
                <div className="w-40">
                    <FormSelect
                        name="control"
                        placeholder="Control"
                        value={filters.control}
                        onChange={(e) => setFilters({ ...filters, control: e.target.value })}
                        options={controlOptions}
                        showLabel={false}
                    />
                </div>
                <div className="w-40">
                    <FormSelect
                        name="assignee"
                        placeholder="Assignee"
                        value={filters.assignee}
                        onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                        options={assigneeOptions}
                        showLabel={false}
                    />
                </div>
                <div className="w-40">
                    <FormSelect
                        name="compliance"
                        placeholder="Compliance"
                        value={filters.compliance}
                        onChange={(e) => setFilters({ ...filters, compliance: e.target.value })}
                        options={complianceOptions}
                        showLabel={false}
                    />
                </div>
                <div className="w-40">
                    <FormSelect
                        name="severity"
                        placeholder="Severity"
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                        options={severityOptions}
                        showLabel={false}
                    />
                </div>
                <div className="w-40">
                    <FormSelect
                        name="status"
                        placeholder="Status"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        options={implementationStatusOptions}
                        showLabel={false}
                    />
                </div>
                <button className="text-primary-pink font-semibold hover:underline text-sm whitespace-nowrap ml-1" onClick={handleClearFilters}>Clear Filters</button>
                <div className="flex-grow flex justify-end items-center space-x-2">
                    <button className="bg-primary-pink px-8 py-2 rounded-md text-white hover:opacity-90 transition-all font-medium" disabled={saving} onClick={handleSave}>
                        {saving ? "Updating..." : "Update"}
                    </button>
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="px-4 mt-5 h-[1000px] bg-white overflow-auto pb-20">
                <table className="w-full border-collapse bg-white rounded-lg mb-10">
                    <thead className="text-left bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 min-w-[200px]">Control / Clause</th>
                            <th className="px-4 py-3 min-w-[200px]">Current Gap</th>
                            <th className="px-4 py-3 w-40">Compliance Status</th>
                            <th className="px-4 py-3 w-32">Severity</th>
                            <th className="px-4 py-3 min-w-[200px]">Recommended Action</th>
                            <th className="px-4 py-3 w-32">Responsibility</th>
                            <th className="px-4 py-3 w-36">Due Date</th>
                            <th className="px-4 py-3 w-40">Impl. Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row) => (
                            <tr key={row.standardControlID} className="border-b bg-white hover:bg-gray-50">
                                <td className="px-4 py-3 align-top">
                                    <div className="font-semibold">{row.clauseReference}</div>
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <FormTextArea
                                        name="currentGap"
                                        value={row.currentGap}
                                        onChange={(e) => handleRowChange(row.standardControlID, "currentGap", e.target.value)}
                                        showLabel={false}
                                        className="w-full text-sm h-20 border border-black rounded-md p-2"
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <FormSelect
                                        name="complianceStatus"
                                        value={row.complianceStatus}
                                        options={complianceOptions}
                                        onChange={(e) => handleRowChange(row.standardControlID, "complianceStatus", e.target.value)}
                                        showLabel={false}
                                        className="w-full text-sm"
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <FormSelect
                                        name="severity"
                                        value={row.severity}
                                        options={severityOptions}
                                        onChange={(e) => handleRowChange(row.standardControlID, "severity", e.target.value)}
                                        showLabel={false}
                                        className="w-full text-sm"
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <FormTextArea
                                        name="recommendedAction"
                                        value={row.recommendedAction}
                                        onChange={(e) => handleRowChange(row.standardControlID, "recommendedAction", e.target.value)}
                                        showLabel={false}
                                        className="w-full text-sm h-20 border border-black rounded-md p-2"
                                    />
                                </td>
                                <td className="px-4 py-3 align-top min-w-[200px]">
                                    <UserSelect
                                        name={`responsibility-${row.standardControlID}`}
                                        value={row.responsibility ? Number(row.responsibility) : ""}
                                        onChange={(e) => handleRowChange(row.standardControlID, "responsibility", String(e.target.value))}
                                        users={projectUserList}
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <input
                                        type="date"
                                        value={row.dueDate}
                                        onChange={(e) => handleRowChange(row.standardControlID, "dueDate", e.target.value)}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <FormSelect
                                        name="implementationStatus"
                                        value={row.implementationStatus}
                                        options={implementationStatusOptions}
                                        onChange={(e) => handleRowChange(row.standardControlID, "implementationStatus", e.target.value)}
                                        showLabel={false}
                                        className="w-full text-sm"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GapAnalysisOverview;
