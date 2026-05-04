import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { reviewAuditApi } from "../../utils/reviewAuditApi.js";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";

const classificationOptions = [
    { label: "Public", value: "Public" },
    { label: "Confidential", value: "Confidential" },
    { label: "Restricted", value: "Restricted" },
];

const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric"
        });
    } catch {
        return dateStr;
    }
};

const ReviewDetail = ({ document, onClose, onSuccess }) => {
    const { addToast } = useToasts();
    const [form, setForm] = useState({
        name: document.name || "",
        category: document.category || "",
    });
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {
        if (!form.name.trim()) {
            addToast("Name is required", { appearance: "error" });
            return;
        }
        setSaving(true);
        try {
            const res = await reviewAuditApi.updateReviewAudit(document.id, form);
            addToast("Updated successfully!", { appearance: "success" });
            if (onSuccess) onSuccess({ ...document, ...form });
        } catch (e) {
            addToast("Failed to update", { appearance: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-dashboard-bgc min-h-screen px-6 py-4">
            {/* Breadcrumb + meta */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="text-sm text-gray-500 mb-1">
                        <span
                            className="cursor-pointer hover:text-primary-pink"
                            onClick={onClose}
                        >
                            Reviews and Audits
                        </span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800 font-medium">{document.type || "Review"}</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <span>Created Date : {formatDate(document.createdAt)}</span>
                    </div>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="bg-primary-pink px-8 py-2 rounded-md text-white hover:opacity-90 transition-all font-medium"
                >
                    {saving ? "Updating..." : "Update"}
                </button>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-lg p-6 mt-4 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                    <FormInput
                        name="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        showLabel={false}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Classification</label>
                    <FormSelect
                        name="category"
                        value={form.category}
                        options={classificationOptions}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        showLabel={false}
                        placeholder="Select Classification"
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewDetail;
