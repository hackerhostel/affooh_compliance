import React, { useState } from "react";

const CloneIssuePopup = ({ isOpen, onClose, issueId }) => {
  const [selectedInclude, setSelectedInclude] = useState("Attachments");

  const includesOptions = ["Attachments", "Sub Tasks", "Accepted Criteria"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
        
       
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-lg font-semibold">
            Clone Issue : <span className="text-gray-600">{issueId}</span>
          </span>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            ✖
          </button>
        </div>

        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">Summary</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            value="CLONE - Price list on Home page"
            readOnly
          />
        </div>

  
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">Include</label>
          <div className="mt-2 space-y-2">
            {includesOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="include"
                  value={option}
                  checked={selectedInclude === option}
                  onChange={() => setSelectedInclude(option)}
                    className="text-pink-500 focus:ring-pink-500 border-pink-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn-primary">
            Clone
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloneIssuePopup;
