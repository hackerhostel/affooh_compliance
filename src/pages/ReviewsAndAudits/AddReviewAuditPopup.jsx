import React, { useState } from "react";
import Modal from "../../components/Modal.jsx";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import { reviewAuditApi } from "../../utils/reviewAuditApi.js";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";

const AddReviewAuditPopup = ({ isOpen, onClose, onSuccess }) => {
    const { addToast } = useToasts();
    const orgId = useSelector((state) => state.auth?.user?.organizationID) || 1;

    const [formData, setFormData] = useState({ name: "", type: "", category: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await reviewAuditApi.createReviewAudit(orgId, formData);
            addToast("Created successfully!", { appearance: "success" });
            if (onSuccess) onSuccess();
        } catch (error) {
            addToast("Failed to create", { appearance: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            type="side"
            title="Create Review / Audit"
        >
            <div className="flex flex-col h-[calc(100vh-120px)] w-full sm:w-[500px]">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 space-y-6 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-secondary-grey mb-1">Name</label>
                            <FormInput
                                name="name"
                                placeholder=""
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                showLabel={false}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="text-sm font-medium text-secondary-grey mb-1">Type</label>
                                <FormSelect
                                    name="type"
                                    placeholder="Select Type"
                                    value={formData.type}
                                    options={[
                                        { label: "ISO 9001", value: "ISO 9001" },
                                        { label: "ISO 27001", value: "ISO 27001" }
                                    ]}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                    showLabel={false}
                                />
                            </div>

                            <div className="flex flex-col flex-1">
                                <label className="text-sm font-medium text-secondary-grey mb-1">Clasification</label>
                                <FormSelect
                                    name="category"
                                    placeholder="Select Category"
                                    value={formData.category}
                                    options={[
                                        { label: "Public", value: "Public" },
                                        { label: "Confidential", value: "Confidential" },
                                        { label: "Restricted", value: "Restricted" }
                                    ]}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    showLabel={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pb-8 pt-6 border-t mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-500 font-medium hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] h-12 bg-primary-pink text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-md focus:ring-2 focus:ring-primary-pink focus:ring-offset-2"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
export default AddReviewAuditPopup;
