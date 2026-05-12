import React, { useState, useEffect, useRef } from "react";
import {
    ChevronDownIcon,
    XMarkIcon,
    PlusIcon,
    LinkIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/slice/authSlice.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import soaApi from "../../utils/soaApi.js";
import { getProcessFrameworkDocuments } from "../../utils/processFrameworkApi.js";
import { useToasts } from "react-toast-notifications";
import { ISO27001_CONTROLS, CATEGORY_COLORS } from "../../constants/iso27001Controls.js";
import { createRevisionHistory, createApproval } from "../../utils/complianceApi.js";
import SaveVersionPopup from "../../components/SaveVersionPopup.jsx";

const parseDocs = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
};

const buildRows = (soaEntries) =>
    ISO27001_CONTROLS.map((ctrl, idx) => {
        const entry = soaEntries.find((e) => e.controlId === ctrl.id);
        return {
            rowNum: String(idx + 1).padStart(2, "0"),
            controlId: ctrl.id,
            controlName: ctrl.name,
            category: ctrl.category,
            databaseId: entry?.id || null,
            description: entry?.description || "",
            applicability: entry?.applicability || "YES",
            justification: entry?.justification || "",
            status: entry?.status || "To Do",
            documentation: parseDocs(entry?.documentation),
            record: entry?.record || "",
            comments: entry?.comments || "",
        };
    });

const statusStyle = (s) => {
    if (s === "Done") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (s === "In Progress") return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-rose-100 text-rose-700 border border-rose-200";
};

const applicabilityStyle = (v) =>
    v === "YES" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200";

const BadgeDropdown = ({ value, options, onChange, styleFn }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-all hover:shadow-md active:scale-95 ${styleFn(value)}`}
                style={{ minWidth: "90px" }}
            >
                <span className="truncate uppercase tracking-wider">{value}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-1.5 min-w-[120px] animate-in fade-in zoom-in duration-150 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`w-full text-center px-4 py-2.5 text-[11px] font-bold transition-all ${opt === value ? "text-primary-pink bg-pink-50/50" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterDropdown = ({ value, options, placeholder, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-pink/20 shadow-sm min-w-[140px] justify-between transition-all hover:border-gray-300"
            >
                <span className={value ? "text-gray-700 font-medium" : "text-gray-400"}>
                    {value || placeholder}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-1.5 min-w-full animate-in fade-in zoom-in duration-150 overflow-hidden">
                    <button
                        onClick={() => {
                            onChange("");
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        {placeholder}
                    </button>
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-all ${opt === value ? "text-primary-pink bg-pink-50/50 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const DOCUMENT_TYPE = "SOA";

const SOAOverview = () => {
    const { addToast } = useToasts();
    const user = useSelector(selectUser);
    const selectedProject = useSelector(selectSelectedProject);
    const projectId = selectedProject?.id;
    const organizationID = user?.organization?.id;

    const [rows, setRows] = useState([]);
    const [frameworkDocs, setFrameworkDocs] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);
    const [docPickerOpen, setDocPickerOpen] = useState(null);
    const [filters, setFilters] = useState({ control: "", applicability: "", status: "" });
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const handleSaveConfirm = async ({ version, summary }) => {
        if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
        setIsSaving(true);
        try {
            await createRevisionHistory({
                projectId,
                documentType: DOCUMENT_TYPE,
                version,
                summaryOfChanges: summary,
                revisionDate: new Date().toISOString().split("T")[0],
                name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
                status: "draft",
            });
            addToast("Document saved as draft", { appearance: "success" });
            setShowSavePopup(false);
        } catch {
            addToast("Failed to save document", { appearance: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleApprove = async () => {
        if (!projectId) { addToast("No project selected", { appearance: "error" }); return; }
        setIsApproving(true);
        try {
            await createApproval({
                projectId,
                documentType: DOCUMENT_TYPE,
                approvalDate: new Date().toISOString().split("T")[0],
                status: "approved",
                approver: {
                    id: user?.id,
                    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
                    position: user?.position || null,
                },
            });
            addToast("Document approved successfully", { appearance: "success" });
        } catch {
            addToast("Failed to approve document", { appearance: "error" });
        } finally {
            setIsApproving(false);
        }
    };

    // Always-fresh rows reference to avoid stale closures in async handlers
    const rowsRef = useRef([]);
    useEffect(() => { rowsRef.current = rows; }, [rows]);

    // Fetch all framework doc types and merge into one flat list
    const fetchAllFrameworkDocs = async (orgId) => {
        const types = ["POLICY", "DOCUMENT", "PROCESS", "STANDARD", "TEMPLATE"];
        const results = await Promise.allSettled(
            types.map((type) => getProcessFrameworkDocuments(orgId, type))
        );
        return results
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value || []);
    };

    useEffect(() => {
        if (!organizationID) return;
        setIsLoading(true);

        // Use independent fetches so a docs failure doesn't block controls loading
        const soaFetch = soaApi.listSOA(organizationID)
            .then((r) => r?.data?.body || [])
            .catch(() => []);

        const docsFetch = fetchAllFrameworkDocs(organizationID).catch(() => []);

        Promise.all([soaFetch, docsFetch])
            .then(([soaEntries, docs]) => {
                setRows(buildRows(soaEntries));
                setFrameworkDocs(docs);
            })
            .finally(() => setIsLoading(false));
    }, [organizationID]);

    const saveField = async (controlId, field, value) => {
        const current = rowsRef.current.find((r) => r.controlId === controlId);
        if (!current) return;

        // Optimistic update
        setRows((prev) =>
            prev.map((r) => (r.controlId === controlId ? { ...r, [field]: value } : r))
        );

        try {
            if (current.databaseId) {
                await soaApi.updateSOA(current.databaseId, { [field]: value, updatedBy: user?.id });
            } else {
                const result = await soaApi.createSOA({
                    organizationID,
                    controlId,
                    controlName: current.controlName,
                    controlCategory: current.category,
                    applicability: current.applicability,
                    status: current.status,
                    [field]: value,
                    createdBy: user?.id,
                    updatedBy: user?.id,
                });
                const newId = result?.data?.body?.id;
                if (newId) {
                    setRows((prev) =>
                        prev.map((r) =>
                            r.controlId === controlId ? { ...r, databaseId: newId } : r
                        )
                    );
                }
            }
            const fieldLabel = field === "applicability" ? "Applicability" : "Status";
            addToast(`${fieldLabel} updated successfully`, { appearance: "success" });
        } catch {
            addToast("Failed to save", { appearance: "error" });
        }
    };

    const saveAllTextFields = async (controlId) => {
        const row = rowsRef.current.find((r) => r.controlId === controlId);
        if (!row) return;
        setSavingId(controlId);
        const payload = {
            description: row.description,
            justification: row.justification,
            record: row.record,
            comments: row.comments,
            updatedBy: user?.id,
        };
        try {
            if (row.databaseId) {
                await soaApi.updateSOA(row.databaseId, payload);
            } else {
                const result = await soaApi.createSOA({
                    organizationID,
                    controlId,
                    controlName: row.controlName,
                    controlCategory: row.category,
                    applicability: row.applicability,
                    status: row.status,
                    ...payload,
                    createdBy: user?.id,
                });
                const newId = result?.data?.body?.id;
                if (newId) {
                    setRows((prev) =>
                        prev.map((r) => r.controlId === controlId ? { ...r, databaseId: newId } : r)
                    );
                }
            }
            addToast("Saved successfully", { appearance: "success" });
        } catch {
            addToast("Failed to save", { appearance: "error" });
        } finally {
            setSavingId(null);
        }
    };

    const addDoc = async (controlId, doc) => {
        const row = rowsRef.current.find((r) => r.controlId === controlId);
        if (!row || row.documentation.find((d) => d.id === doc.id)) return;
        const updated = [...row.documentation, { id: doc.id, title: doc.title }];
        await saveField(controlId, "documentation", updated);
        setDocPickerOpen(null);
    };

    const removeDoc = async (controlId, docId) => {
        const row = rowsRef.current.find((r) => r.controlId === controlId);
        if (!row) return;
        const updated = row.documentation.filter((d) => d.id !== docId);
        await saveField(controlId, "documentation", updated);
    };

    const filteredRows = rows.filter((row) => {
        if (
            filters.control &&
            !`${row.controlId} ${row.controlName}`
                .toLowerCase()
                .includes(filters.control.toLowerCase())
        )
            return false;
        if (filters.applicability && row.applicability !== filters.applicability)
            return false;
        if (filters.status && row.status !== filters.status) return false;
        return true;
    });

    const hasFilters = filters.control || filters.applicability || filters.status;

    const totalPages = Math.ceil(filteredRows.length / pageSize);
    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="bg-[#F8F9FD] p-6 font-sans min-h-screen">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="text-2xl font-bold text-[#1E293B]">
                            Statement of Applicability
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">ISO/IEC 27001:2022 — Annex A Controls</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowSavePopup(true)} className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
                        <button onClick={handleApprove} disabled={isApproving} className='bg-primary-pink px-8 py-3 rounded-md text-white disabled:opacity-60'>{isApproving ? "Approving..." : "Approve"}</button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search control..."
                        value={filters.control}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, control: e.target.value }))
                        }
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary-pink/20 shadow-sm"
                    />
                    <FilterDropdown
                        value={filters.applicability}
                        options={["YES", "NO"]}
                        placeholder="Applicability"
                        onChange={(val) => setFilters((f) => ({ ...f, applicability: val }))}
                    />
                    <FilterDropdown
                        value={filters.status}
                        options={["To Do", "In Progress", "Done"]}
                        placeholder="Status"
                        onChange={(val) => setFilters((f) => ({ ...f, status: val }))}
                    />
                    <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm ml-auto">
                        {filteredRows.length} / {rows.length} Controls
                    </span>
                    {hasFilters && (
                        <button
                            onClick={() =>
                                setFilters({ control: "", applicability: "", status: "" })
                            }
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl overflow-x-auto shadow-sm border border-gray-100">
                    <table className="w-full border-collapse text-sm">
                        <thead className="text-left border-b border-gray-100 bg-gray-50/60">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-10">#</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-52">Control</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Description</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-28 text-center">Applicability</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Justification</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-36 text-center">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-14 text-center">+</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-400">
                                        Loading controls...
                                    </td>
                                </tr>
                            ) : filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-400">
                                    No controls match the current filters
                                    </td>
                                </tr>
                            ) : (
                                paginatedRows.map((row) => {
                                    const catColor = CATEGORY_COLORS[row.category] || CATEGORY_COLORS.Organizational;
                                    const isExpanded = expandedId === row.controlId;
                                    return (
                                        <React.Fragment key={row.controlId}>
                                            {/* --- Row 1 --- */}
                                            <tr
                                                className={`border-b border-gray-100 transition-colors ${isExpanded ? "bg-pink-50/30" : "hover:bg-gray-50/70"}`}
                                            >
                                                {/* # */}
                                                <td className="px-4 py-3">
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                        {row.rowNum}
                                                    </span>
                                                </td>

                                                {/* Control */}
                                                <td className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs font-bold text-primary-pink bg-pink-50 px-2 py-0.5 rounded-md">
                                                                {row.controlId}
                                                            </span>
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${catColor.bg} ${catColor.text}`}>
                                                                {row.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                            {row.controlName}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Description — controlled input, save on blur */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={row.description}
                                                        onChange={(e) =>
                                                            setRows((prev) =>
                                                                prev.map((r) =>
                                                                    r.controlId === row.controlId
                                                                        ? { ...r, description: e.target.value }
                                                                        : r
                                                                )
                                                            )
                                                        }
                                                        placeholder="Enter description..."
                                                        className="w-full min-w-[160px] bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-primary-pink/50 px-1 py-1 text-sm outline-none transition-all"
                                                    />
                                                </td>

                                                {/* Applicability */}
                                                <td className="px-4 py-3 text-center">
                                                    <BadgeDropdown
                                                        value={row.applicability}
                                                        options={["YES", "NO"]}
                                                        onChange={(val) => saveField(row.controlId, "applicability", val)}
                                                        styleFn={applicabilityStyle}
                                                    />
                                                </td>

                                                {/* Justification */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={row.justification}
                                                        onChange={(e) =>
                                                            setRows((prev) =>
                                                                prev.map((r) =>
                                                                    r.controlId === row.controlId
                                                                        ? { ...r, justification: e.target.value }
                                                                        : r
                                                                )
                                                            )
                                                        }
                                                        placeholder="Enter justification..."
                                                        className="w-full min-w-[160px] bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-primary-pink/50 px-1 py-1 text-sm outline-none transition-all"
                                                    />
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3 text-center">
                                                    <BadgeDropdown
                                                        value={row.status}
                                                        options={["To Do", "In Progress", "Done"]}
                                                        onChange={(val) => saveField(row.controlId, "status", val)}
                                                        styleFn={statusStyle}
                                                    />
                                                </td>

                                                {/* Expand */}
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() =>
                                                            setExpandedId(isExpanded ? null : row.controlId)
                                                        }
                                                        className={`p-2 rounded-lg transition-all ${isExpanded ? "bg-primary-pink text-white" : "text-gray-400 hover:bg-gray-100"}`}
                                                        title={isExpanded ? "Collapse" : "View Documentation / Record / Comments"}
                                                    >
                                                        {isExpanded ? (
                                                            <XMarkIcon className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDownIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* --- Row 2 (expanded) --- */}
                                            {isExpanded && (
                                                <tr className="border-b border-gray-100">
                                                    <td colSpan={7} className="px-6 py-5 bg-gray-50/60">
                                                        <div className="grid grid-cols-3 gap-8">

                                                            {/* Documentation */}
                                                            <div className="space-y-2">
                                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    Documentation
                                                                </div>
                                                                <div className="flex flex-wrap gap-2 min-h-[2rem] items-start">
                                                                    {row.documentation.map((doc) => (
                                                                        <span
                                                                            key={doc.id}
                                                                            className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100"
                                                                        >
                                                                            {doc.title}
                                                                            <button
                                                                                onClick={() => removeDoc(row.controlId, doc.id)}
                                                                                className="hover:text-red-500 transition-colors flex-shrink-0"
                                                                            >
                                                                                <XMarkIcon className="w-3 h-3" />
                                                                            </button>
                                                                        </span>
                                                                    ))}

                                                                    {/* Add doc button + picker */}
                                                                    <div className="relative">
                                                                        <button
                                                                            onClick={() =>
                                                                                setDocPickerOpen(
                                                                                    docPickerOpen === row.controlId
                                                                                        ? null
                                                                                        : row.controlId
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 hover:bg-primary-pink/10 hover:text-primary-pink px-2.5 py-1 rounded-full border border-gray-200 transition-all"
                                                                        >
                                                                            <PlusIcon className="w-3 h-3" />
                                                                            Tag Document
                                                                        </button>
                                                                        {docPickerOpen === row.controlId && (
                                                                            <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-72 max-h-52 overflow-y-auto">
                                                                                {frameworkDocs.length === 0 ? (
                                                                                    <p className="text-xs text-gray-400 p-4 text-center">
                                                                                        No framework documents found
                                                                                    </p>
                                                                                ) : (
                                                                                    frameworkDocs.map((doc) => (
                                                                                        <button
                                                                                            key={doc.id}
                                                                                            onClick={() =>
                                                                                                addDoc(row.controlId, {
                                                                                                    id: doc.id,
                                                                                                    title: doc.title,
                                                                                                })
                                                                                            }
                                                                                            className="w-full text-left text-xs px-4 py-2.5 hover:bg-gray-50 text-gray-700 border-b border-gray-50 last:border-0 transition-colors"
                                                                                        >
                                                                                            {doc.title}
                                                                                        </button>
                                                                                    ))
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Record */}
                                                            <div className="space-y-2">
                                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    Record
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <LinkIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                                                    <input
                                                                        type="text"
                                                                        value={row.record}
                                                                        onChange={(e) =>
                                                                            setRows((prev) =>
                                                                                prev.map((r) =>
                                                                                    r.controlId === row.controlId
                                                                                        ? { ...r, record: e.target.value }
                                                                                        : r
                                                                                )
                                                                            )
                                                                        }
                                                                        placeholder="Add link to system screen..."
                                                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/20"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Comments */}
                                                            <div className="space-y-2">
                                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    Comments
                                                                </div>
                                                                <textarea
                                                                    value={row.comments}
                                                                    onChange={(e) =>
                                                                        setRows((prev) =>
                                                                            prev.map((r) =>
                                                                                r.controlId === row.controlId
                                                                                    ? { ...r, comments: e.target.value }
                                                                                    : r
                                                                            )
                                                                        )
                                                                    }
                                                                    placeholder="Add comments..."
                                                                    rows={3}
                                                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-pink/20"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Save button */}
                                                        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                                                            <button
                                                                onClick={() => saveAllTextFields(row.controlId)}
                                                                disabled={savingId === row.controlId}
                                                                className="bg-primary-pink text-white px-8 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                                            >
                                                                {savingId === row.controlId ? "Saving..." : "Save"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-sm text-gray-500 font-medium">
                            Showing <span className="text-[#1E293B]">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                            <span className="text-[#1E293B]">{Math.min(currentPage * pageSize, filteredRows.length)}</span> of{" "}
                            <span className="text-[#1E293B] font-bold">{filteredRows.length}</span> controls
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Show first, last, and pages around current
                                    if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={`w-9 h-9 text-sm font-bold rounded-lg transition-all ${
                                                    currentPage === p
                                                        ? "bg-primary-pink text-white shadow-md shadow-primary-pink/20"
                                                        : "text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === currentPage - 2 || p === currentPage + 2) {
                                        return <span key={p} className="text-gray-300 text-xs">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop to close doc picker */}
            {docPickerOpen && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => setDocPickerOpen(null)}
                />
            )}
            <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
        </div>
    );
};

export default SOAOverview;
