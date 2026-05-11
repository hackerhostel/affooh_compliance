import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const SaveVersionPopup = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [version, setVersion] = useState("");
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!version.trim()) newErrors.version = "Version is required";
    if (!summary.trim()) newErrors.summary = "Summary of change is required";
    return newErrors;
  };

  const handleConfirm = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm({ version: version.trim(), summary: summary.trim() });
    setVersion("");
    setSummary("");
    setErrors({});
  };

  const handleClose = () => {
    setVersion("");
    setSummary("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h4 className="text-lg font-semibold text-gray-900 mb-1">Save Document</h4>
        <p className="text-sm text-gray-500 mb-5">Enter version details to save this document as a draft.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
                if (errors.version) setErrors((prev) => ({ ...prev, version: "" }));
              }}
              placeholder="e.g. 1.0, 2.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
            />
            {errors.version && <p className="text-xs text-red-500 mt-1">{errors.version}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary of Change</label>
            <textarea
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                if (errors.summary) setErrors((prev) => ({ ...prev, summary: "" }));
              }}
              placeholder="Describe the changes made..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent resize-none"
            />
            {errors.summary && <p className="text-xs text-red-500 mt-1">{errors.summary}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-5 py-2 text-sm text-white bg-primary-pink rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save as Draft"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveVersionPopup;
