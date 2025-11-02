import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const DeviceUpdate = ({ onBack }) => {
    return (
        <div className="w-full text-left p-4">
            {/* Header Section */}
            <div className="mb-4 justify-between flex">
                <div>
                    <span className="text-black font-semibold mt-4 block">
                    Hardware Asset / Device
                </span>
                <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                    <span>Create Date: 2024/10/04</span>
                    <span>Created By: Nilanga Pathirana</span>
                </div>
                </div>
                <div>
                  <button className="btn-primary h-10 rounded-md w-36" type="button">
                        Update
                    </button>
                </div>
            </div>

            <div className='bg-white rounded'>
                <div>
                    
                </div>
            </div>
        </div>
    );
};

export default DeviceUpdate;
