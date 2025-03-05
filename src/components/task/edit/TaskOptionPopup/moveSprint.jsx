import React from "react";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";


const MoveSprintPopup = ({ isOpen, onClose }) => {

    const handleMoveSprint = () => {
        onClose();
    }
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-lg font-semibold">
                Move Project: <span className="text-sm">Select Project</span>
              </span>
              <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                ✖
              </button>
            </div>

            {/* Body */}
            <div className="mt-4">
              {/* Current Project */}
              <label className="text-sm text-gray-500"> Current Sprint</label>
           

              {/* New Project Selection */}
              <label className="text-sm text-gray-500 mt-4 block">New Sprint</label>
        
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between space-x-2 mt-6">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleMoveSprint}
              >
                Move Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoveSprintPopup;
