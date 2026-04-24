import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ownerOptions = ["Nilanga", "Kamal", "Saman", "Priya", "Ruwan"];
const severityOptions = ["Low", "Medium", "High", "Critical"];

const field = "w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm transition-all";
const fieldTextarea = "w-full bg-white border border-gray-200 rounded-2xl p-5 text-base focus:ring-4 focus:ring-primary-pink/10 focus:border-primary-pink outline-none shadow-sm resize-none transition-all leading-relaxed";
const label = "block text-xs font-bold text-gray-500 uppercase tracking-wider text-left";

const IncidentEditView = ({ incident, onBack, onUpdate }) => {
    const [formData, setFormData] = useState({
        description: incident.description || "",
        owner: incident.owner || "",
        date: incident.date || "",
        severity: incident.severity || "",
        personalDataInvolved: incident.personalDataInvolved ?? "YES",
        natureOfIncidents: incident.natureOfIncidents || "",
        scopeAndAffectedAssets: incident.scopeAndAffectedAssets || "",
        potentialImpact: incident.potentialImpact || "",
        status: incident.status || "To Do",
        containment: incident.containment || "",
        investigationEradication: incident.investigationEradication || "",
        recovery: incident.recovery || "",
        closureLessonsLearned: incident.closureLessonsLearned || "",
    });

    const set = (f, v) => setFormData(prev => ({ ...prev, [f]: v }));

    const handleUpdate = () => {
        onUpdate(incident.id, formData);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
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
                            <span>Incident Management</span>
                            <span>/</span>
                            <span className="text-gray-900 font-bold"># {incident.id}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400 font-medium line-clamp-1 max-w-md">
                            {incident.description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleUpdate}
                    className="bg-primary-pink text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95 shadow-pink-100 uppercase tracking-widest text-xs"
                >
                    Update
                </button>
            </div>

            {/* Form */}
            <div className="p-10 space-y-8 max-w-7xl">

                {/* Description */}
                <div className="space-y-2">
                    <label className={label}>Description</label>
                    <textarea
                        rows={4}
                        className={`${fieldTextarea} h-28`}
                        value={formData.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Describe the incident..."
                    />
                </div>

                {/* Owner */}
                <div className="space-y-2">
                    <label className={label}>Owner</label>
                    <select
                        className={`${field} appearance-none cursor-pointer`}
                        value={formData.owner}
                        onChange={(e) => set("owner", e.target.value)}
                    >
                        <option value="">Select Owner</option>
                        {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>

                {/* Date / Severity / Personal data */}
                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className={label}>Date</label>
                        <input
                            type="date"
                            className={field}
                            value={formData.date}
                            onChange={(e) => set("date", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={label}>Severity</label>
                        <select
                            className={`${field} appearance-none cursor-pointer`}
                            value={formData.severity}
                            onChange={(e) => set("severity", e.target.value)}
                        >
                            <option value="">Select Severity</option>
                            {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={label}>Personal Data Is Involved</label>
                        <select
                            className={`${field} appearance-none cursor-pointer`}
                            value={formData.personalDataInvolved}
                            onChange={(e) => set("personalDataInvolved", e.target.value)}
                        >
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>

                {/* Nature / Scope / Potential impact */}
                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className={label}>Nature of Incidents</label>
                        <input
                            type="text"
                            className={field}
                            value={formData.natureOfIncidents}
                            onChange={(e) => set("natureOfIncidents", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={label}>Scope and Affected Assets</label>
                        <input
                            type="text"
                            className={field}
                            value={formData.scopeAndAffectedAssets}
                            onChange={(e) => set("scopeAndAffectedAssets", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={label}>Potential Impact</label>
                        <input
                            type="text"
                            className={field}
                            value={formData.potentialImpact}
                            onChange={(e) => set("potentialImpact", e.target.value)}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className={label}>Status</label>
                    <select
                        className={`${field} appearance-none cursor-pointer`}
                        value={formData.status}
                        onChange={(e) => set("status", e.target.value)}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-lg font-bold text-gray-700 mb-6">Incident Details</h4>
                </div>

                {/* Containment */}
                <div className="space-y-2">
                    <label className={label}>Containment</label>
                    <textarea
                        rows={4}
                        className={`${fieldTextarea} h-28`}
                        value={formData.containment}
                        onChange={(e) => set("containment", e.target.value)}
                        placeholder="Describe containment actions taken..."
                    />
                </div>

                {/* Investigation & Eradication */}
                <div className="space-y-2">
                    <label className={label}>Investigation &amp; Eradication</label>
                    <textarea
                        rows={4}
                        className={`${fieldTextarea} h-28`}
                        value={formData.investigationEradication}
                        onChange={(e) => set("investigationEradication", e.target.value)}
                        placeholder="Describe investigation findings and eradication steps..."
                    />
                </div>

                {/* Recovery */}
                <div className="space-y-2">
                    <label className={label}>Recovery</label>
                    <textarea
                        rows={4}
                        className={`${fieldTextarea} h-28`}
                        value={formData.recovery}
                        onChange={(e) => set("recovery", e.target.value)}
                        placeholder="Describe recovery actions..."
                    />
                </div>

                {/* Closure & Lessons Learned */}
                <div className="space-y-2 pb-10">
                    <label className={label}>Closure &amp; Lessons Learned</label>
                    <textarea
                        rows={4}
                        className={`${fieldTextarea} h-28`}
                        value={formData.closureLessonsLearned}
                        onChange={(e) => set("closureLessonsLearned", e.target.value)}
                        placeholder="Summarize closure steps and lessons learned..."
                    />
                </div>

            </div>
        </div>
    );
};

export default IncidentEditView;
