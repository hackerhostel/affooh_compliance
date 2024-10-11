import React, {useState} from 'react';
import {DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {XMarkIcon} from "@heroicons/react/24/outline";

const DateRangeSelector = ({isOpen, onClose}) => {
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection);
    };

    return isOpen && (
        <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="p-4 bg-white shadow rounded-lg flex flex-col items-center">
                <div className=" flex cursor-pointer w-full justify-end mb-3" onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-500"/>
                </div>
                <DateRange
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                />
                <div className=" flex cursor-pointer w-full justify-end">
                    <button
                        className="px-4 py-2 bg-primary-pink text-white rounded hover:bg-pink-600 w-full cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateRangeSelector;
