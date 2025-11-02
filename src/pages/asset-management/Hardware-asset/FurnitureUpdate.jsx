import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DeviceUpdate = ({ onBack }) => {
  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Hardware Asset Overview
      </button>

      {/* Page Title */}
      <h2 className="text-2xl font-semibold mb-6">Update Furniture</h2>

      {/* Your form or content here */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Device update form will go here.</p>
      </div>
    </div>
  );
};

export default DeviceUpdate;
