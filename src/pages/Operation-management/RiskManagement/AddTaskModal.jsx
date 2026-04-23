import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddTaskModal = ({
    isOpen,
    onClose,
    riskId,
    existingTasks = [],
    onTasksUpdated
}) => {
    const selectedProject = useSelector(selectSelectedProject);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToasts();

    const fetchTasks = async () => {
        if (!selectedProject?.id) return;
        setLoading(true);
        try {
            // Reusing the same endpoint as in affooh-web-new if available, 
            // or a general task list endpoint
            const response = await axios.get(`/tasks/project/${selectedProject.id}`);
            setTasks(response.data.body || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            addToast("Failed to fetch tasks", { appearance: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTasks();
        }
    }, [isOpen, selectedProject?.id]);

    useEffect(() => {
        if (tasks.length > 0) {
            const existingIds = new Set(existingTasks.map(t => t.id || t));
            const formatted = tasks.map(task => ({
                label: `${task.code || task.id} - ${task.name}`,
                value: task.id,
                taskData: task,
                isDisabled: existingIds.has(task.id)
            }));
            setTaskOptions(formatted);
        }
    }, [tasks, existingTasks]);

    const handleSelectChange = (selectedOptions) => {
        setSelectedTasks(selectedOptions || []);
    };

    const handleClose = () => {
        setSelectedTasks([]);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedTasks.length === 0) return;

        setIsSubmitting(true);
        try {
            const taskIds = selectedTasks.map(t => t.value);
            // Assuming the updateRisk endpoint handles linking tasks
            await axios.put(`/risk/${riskId}/link-tasks`, { taskIds });
            addToast("Tasks linked successfully", { appearance: "success" });
            if (onTasksUpdated) onTasksUpdated();
            handleClose();
        } catch (error) {
            console.error("Error linking tasks:", error);
            addToast("Failed to link tasks", { appearance: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '0.75rem',
            padding: '4px',
            borderColor: '#e2e8f0',
            boxShadow: 'none',
            '&:hover': { borderColor: '#ec4899' }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#ec4899' : state.isFocused ? '#fce7f3' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        })
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[1000]">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4 transform transition-all">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-lg font-bold text-[#1E293B]">Link Tasks to Risk</h4>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block text-center">Select Tasks</label>
                        <Select
                            isMulti
                            options={taskOptions}
                            value={selectedTasks}
                            onChange={handleSelectChange}
                            placeholder="Search and select tasks..."
                            styles={customStyles}
                            isLoading={loading}
                            isDisabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 rounded-xl bg-primary-pink text-white font-semibold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || selectedTasks.length === 0}
                        >
                            {isSubmitting ? "Linking..." : "Link Tasks"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
