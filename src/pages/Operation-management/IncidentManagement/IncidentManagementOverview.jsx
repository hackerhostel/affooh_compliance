import { useState } from "react";
import { XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import IncidentEditView from "./IncidentEditView.jsx";

const ownerOptions = ["Nilanga", "Kamal", "Saman", "Priya", "Ruwan"];
const severityOptions = ["Low", "Medium", "High", "Critical"];
const statusOptions = ["To Do", "In Progress", "Closed"];

const mockData = [
    {
        id: "01",
        description: "Laptop Fan issue, wifi connectivity and Keyboard issue",
        owner: "Nilanga",
        date: "12-Jan-2026",
        severity: "High",
        natureOfIncidents: "Operational",
        scopeAndAffectedAssets: "Hardware",
        potentialImpact: "Operational",
        status: "To Do",
    },
    {
        id: "02",
        description: "Unauthorized access attempt detected on production server",
        owner: "Kamal",
        date: "15-Jan-2026",
        severity: "Critical",
        natureOfIncidents: "Security",
        scopeAndAffectedAssets: "Server Infrastructure",
        potentialImpact: "Data Breach",
        status: "In Progress",
    },
    {
        id: "03",
        description: "Scheduled data backup process failed overnight",
        owner: "Saman",
        date: "20-Jan-2026",
        severity: "Medium",
        natureOfIncidents: "Operational",
        scopeAndAffectedAssets: "Backup System",
        potentialImpact: "Data Loss Risk",
        status: "Closed",
    },
    {
        id: "04",
        description: "Email phishing attack targeting finance department",
        owner: "Priya",
        date: "22-Jan-2026",
        severity: "High",
        natureOfIncidents: "Security",
        scopeAndAffectedAssets: "Email System",
        potentialImpact: "Financial Loss",
        status: "Closed",
    },
    {
        id: "05",
        description: "Network switch failure causing partial outage",
        owner: "Ruwan",
        date: "28-Jan-2026",
        severity: "High",
        natureOfIncidents: "Infrastructure",
        scopeAndAffectedAssets: "Network",
        potentialImpact: "Service Disruption",
        status: "In Progress",
    },
];

const emptyForm = {
    description: "",
    owner: "",
    date: "",
    severity: "",
    personalDataInvolved: "YES",
    natureOfIncidents: "",
    scopeAndAffectedAssets: "",
    potentialImpact: "",
};

const statusBadge = (status) => {
    const map = {
        "To Do": "bg-yellow-100 text-yellow-700",
        "In Progress": "bg-blue-100 text-blue-700",
        "Closed": "bg-green-100 text-green-700",
    };
    return (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
};

const IncidentManagementOverview = () => {
    const [rows, setRows] = useState(mockData);
    const [filters, setFilters] = useState({ owner: "", severity: "", status: "" });
    const [showCreatePanel, setShowCreatePanel] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState("OVERVIEW");
    const [editingIncident, setEditingIncident] = useState(null);

    const filteredRows = rows.filter((r) => {
        if (filters.owner && r.owner !== filters.owner) return false;
        if (filters.severity && r.severity !== filters.severity) return false;
        if (filters.status && r.status !== filters.status) return false;
        return true;
    });

    const counts = {
        all: rows.length,
        closed: rows.filter((r) => r.status === "Closed").length,
        open: rows.filter((r) => r.status === "To Do").length,
        inProgress: rows.filter((r) => r.status === "In Progress").length,
    };

    const handleEdit = (row) => {
        setEditingIncident(row);
        setViewMode("EDIT");
    };

    const handleDelete = (id) => {
        setRows((prev) => prev.filter((r) => r.id !== id));
    };

    const handleCancel = (id) => {
        if (editingId === id) {
            setEditingId(null);
            setForm(emptyForm);
            setShowCreatePanel(false);
        }
    };

    const handleClosePanel = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowCreatePanel(false);
    };

    const handleCreate = () => {
        if (editingId) {
            setRows((prev) =>
                prev.map((r) => (r.id === editingId ? { ...r, ...form } : r))
            );
        } else {
            setRows((prev) => [
                ...prev,
                { id: String(prev.length + 1).padStart(2, "0"), ...form },
            ]);
        }
        setEditingId(null);
        setForm(emptyForm);
        setShowCreatePanel(false);
    };

    const handleUpdate = (id, data) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
        setViewMode("OVERVIEW");
        setEditingIncident(null);
    };

    if (viewMode === "EDIT" && editingIncident) {
        return (
            <IncidentEditView
                incident={editingIncident}
                onBack={() => { setViewMode("OVERVIEW"); setEditingIncident(null); }}
                onUpdate={handleUpdate}
            />
        );
    }

    return (
        <div className="relative">
            {/* Header */}
            <div className="items-center justify-between flex px-4">
                <span className="text-xl font-semibold">Incident Management</span>
                <div className="flex justify-end items-center mt-4 space-x-2">
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Approved</button>
                    <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Save</button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-white p-4 mt-5 flex gap-4 rounded-lg">
                <div className="border-2 border-secondary-bcg rounded-lg flex-1 py-8 flex flex-col items-center gap-1 text-text-color">
                    <span className="text-3xl font-medium">{counts.all}</span>
                    <span className="text-lg font-medium">All</span>
                </div>
                <div className="border-2 border-pass-border-color rounded-lg flex-1 py-8 flex flex-col items-center gap-1 text-text-color">
                    <span className="text-3xl font-medium">{counts.closed}</span>
                    <span className="text-lg font-medium">Closed</span>
                </div>
                <div className="border-2 border-priority-high rounded-lg flex-1 py-8 flex flex-col items-center gap-1 text-text-color">
                    <span className="text-3xl font-medium">{counts.open}</span>
                    <span className="text-lg font-medium">Open</span>
                </div>
                <div className="border-2 border-pending-border-color rounded-lg flex-1 py-8 flex flex-col items-center gap-1 text-text-color">
                    <span className="text-3xl font-medium">{counts.inProgress}</span>
                    <span className="text-lg font-medium">In Progress</span>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center justify-between px-4 mt-4">
                <div className="flex space-x-3">
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.owner}
                        onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                    >
                        <option value="">Owner</option>
                        {ownerOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>

                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    >
                        <option value="">Severity</option>
                        {severityOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">Status</option>
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => setShowCreatePanel(true)}
                    className="bg-primary-pink text-white px-8 py-2 rounded-md text-sm font-medium"
                >
                    New
                </button>
            </div>

            {/* Table */}
            <div className="px-4 mt-4 bg-white rounded-lg overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="text-left border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-gray-700 w-12">ID</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Owner</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Severity</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Nature of incidents</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Scope and affected assets.</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Potential impact</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-gray-400">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            filteredRows.map((row) => (
                                <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${editingId === row.id ? "bg-pink-50/40" : ""}`}>
                                    <td className="px-4 py-4 text-gray-600">{row.id}.</td>
                                    <td className="px-4 py-4 text-gray-800 max-w-[200px]">{row.description}</td>
                                    <td className="px-4 py-4 text-gray-700">{row.owner}</td>
                                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{row.date}</td>
                                    <td className="px-4 py-4 text-gray-700">{row.severity}</td>
                                    <td className="px-4 py-4 text-gray-700">{row.natureOfIncidents}</td>
                                    <td className="px-4 py-4 text-gray-700">{row.scopeAndAffectedAssets}</td>
                                    <td className="px-4 py-4 text-gray-700">{row.potentialImpact}</td>
                                    <td className="px-4 py-4">{statusBadge(row.status)}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className="p-2 text-gray-400 hover:text-primary-pink hover:bg-pink-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleCancel(row.id)}
                                                className={`p-2 rounded-lg transition-all ${editingId === row.id ? "bg-primary-pink text-white shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                                                title="Cancel"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Slide-in Create Panel Overlay */}
            {showCreatePanel && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="flex-1 bg-black/30"
                        onClick={() => setShowCreatePanel(false)}
                    />

                    {/* Panel */}
                    <div className="w-[560px] bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-800">
                                {editingId ? "Edit Incident" : "Create New Incident"}
                            </h4>
                            <button
                                onClick={handleClosePanel}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="flex-1 px-6 py-5 flex flex-col gap-5">
                            {/* Description */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            {/* Owner */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Owner</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.owner}
                                        onChange={(e) => setForm({ ...form, owner: e.target.value })}
                                    >
                                        <option value=""></option>
                                        {ownerOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                                </div>
                            </div>

                            {/* Date / Severity / Personal data row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Severity</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.severity}
                                            onChange={(e) => setForm({ ...form, severity: e.target.value })}
                                        >
                                            <option value=""></option>
                                            {severityOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Personal data is involved.</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.personalDataInvolved}
                                            onChange={(e) => setForm({ ...form, personalDataInvolved: e.target.value })}
                                        >
                                            <option value="YES">YES</option>
                                            <option value="NO">NO</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nature of incidents */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Nature of incidents</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.natureOfIncidents}
                                    onChange={(e) => setForm({ ...form, natureOfIncidents: e.target.value })}
                                />
                            </div>

                            {/* Scope and affected assets */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Scope and affected assets.</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.scopeAndAffectedAssets}
                                    onChange={(e) => setForm({ ...form, scopeAndAffectedAssets: e.target.value })}
                                />
                            </div>

                            {/* Potential impact */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Potential impact</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.potentialImpact}
                                    onChange={(e) => setForm({ ...form, potentialImpact: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 py-5 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={handleClosePanel}
                                className="flex-1 border border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex-1 bg-primary-pink text-white rounded-lg py-3 text-sm font-medium hover:opacity-90"
                            >
                                {editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentManagementOverview;
