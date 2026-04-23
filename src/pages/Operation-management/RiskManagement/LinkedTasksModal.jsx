import React, { useState } from 'react';
import {
    XMarkIcon,
    ClipboardDocumentListIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import riskApi from '../../../utils/riskApi';
import { useToasts } from 'react-toast-notifications';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';

const LinkedTasksModal = ({ isOpen, onClose, risk, onTaskUnlinked }) => {
    const { addToast } = useToasts();
    const [isUnlinking, setIsUnlinking] = useState(false);
    const [taskToUnlink, setTaskToUnlink] = useState(null);

    if (!isOpen || !risk) return null;

    const handleUnlink = (task) => {
        setTaskToUnlink(task);
    };

    const confirmUnlink = async () => {
        if (!taskToUnlink) return;
        
        setIsUnlinking(true);
        try {
            await riskApi.unlinkTask(risk.databaseId || risk.id, taskToUnlink.id);
            addToast('Task unlinked successfully', { appearance: 'success' });
            onTaskUnlinked(risk.id, taskToUnlink.id);
            setTaskToUnlink(null);
        } catch (error) {
            console.error('Error unlinking task:', error);
            addToast('Failed to unlink task', { appearance: 'error' });
        } finally {
            setIsUnlinking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-pink/10 flex items-center justify-center">
                            <ClipboardDocumentListIcon className="w-6 h-6 text-primary-pink" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Linked Tasks</h4>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all group"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-8 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100">Task ID</th>
                                <th className="px-8 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100">Task Name</th>
                                <th className="px-8 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest text-center border-b border-gray-100">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risk.tasks && risk.tasks.length > 0 ? (
                                risk.tasks.map((task) => (
                                    <tr key={task.id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-8 py-5 border-b border-gray-50">
                                            <span className="text-base font-bold text-gray-900">{task.code || task.id}</span>
                                        </td>
                                        <td className="px-8 py-5 border-b border-gray-50">
                                            <span className="text-base text-gray-600 font-medium">{task.name || 'N/A'}</span>
                                        </td>
                                        <td className="px-8 py-5 border-b border-gray-50 text-center">
                                            <button
                                                onClick={() => handleUnlink(task)}
                                                disabled={isUnlinking}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Remove Task"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <ClipboardDocumentListIcon className="w-12 h-12 text-gray-200 mb-3" />
                                            <p className="text-gray-400 font-medium text-sm">No tasks linked to this risk</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationDialog 
                isOpen={!!taskToUnlink}
                onClose={() => setTaskToUnlink(null)}
                onConfirm={confirmUnlink}
                title="Unlink Task?"
                message={`Are you sure you want to unlink task "${taskToUnlink?.code || taskToUnlink?.id}"?`}
            />
        </div>
    );
};

export default LinkedTasksModal;
