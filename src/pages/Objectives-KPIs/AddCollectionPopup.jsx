import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import Modal from "../../components/Modal.jsx";
import { createObjectiveCollection, getObjectiveMasterData } from "../../utils/objectiveApi.js";
import { useToasts } from "react-toast-notifications";
import { getSelectOptions } from "../../utils/commonUtils.js";

const AddCollectionPopup = ({ isOpen, onClose, onAddSuccess }) => {
    const { addToast } = useToasts();
    const selectedProject = useSelector(selectSelectedProject);
    const [formData, setFormData] = useState({
        name: "",
        classificationID: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [classifications, setClassifications] = useState([]);

    useEffect(() => {
        const fetchMasterData = async () => {
            const projectID = selectedProject?.id;
            try {
                const data = await getObjectiveMasterData(projectID);
                if (data.classifications) {
                    setClassifications(getSelectOptions(data.classifications));
                }
            } catch (error) {
                console.error("Failed to fetch objective master data", error);
            }
        };

        if (isOpen) {
            fetchMasterData();
        }
    }, [isOpen, selectedProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.classificationID) {
            addToast("Please fill all required fields", { appearance: "warning" });
            return;
        }
        setLoading(true);
        try {
            await createObjectiveCollection({
                ...formData,
                classificationID: Number(formData.classificationID),
            });
            addToast("Collection created successfully", { appearance: "success" });
            onAddSuccess();
            onClose();
        } catch (error) {
            addToast("Failed to create collection", { appearance: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
        >
            <div className="flex flex-col gap-4 mt-2">
                <h4 className="text-md font-bold text-gray-900 mb-2">Create Objective Collection</h4>
                <FormInput
                    name="name"
                    placeholder="Name"
                    formValues={formData}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    name="classificationID"
                    placeholder="Classification"
                    formValues={formData}
                    options={classifications}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    name="description"
                    placeholder="Description"
                    formValues={formData}
                    onChange={handleChange}
                />
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddCollectionPopup;
