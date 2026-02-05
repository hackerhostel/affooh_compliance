import React, { useRef } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

// Counter for generating unique IDs per component instance
let instanceCounter = 0;

const ToggleButton = ({label, onChange, checked, isOn, onToggle, name, id}) => {
    const isChecked = isOn !== undefined ? isOn : checked;
    const handleChange = (e) => {
        const value = e.target.checked;
        if (onToggle) {
            onToggle(value);
        } else if (onChange) {
            onChange(e);
        }
    };
    // Generate unique ID per component instance to avoid conflicts with form selects
    const instanceIdRef = useRef(null);
    if (!instanceIdRef.current) {
        instanceCounter += 1;
        instanceIdRef.current = instanceCounter;
    }
    const inputId = id || (name ? `toggle-${name}-${instanceIdRef.current}` : label ? `toggle-${label}-${instanceIdRef.current}` : `toggle-${instanceIdRef.current}`);

    return (
        <div className="flex items-center mb-1 space-x-2">
            {label && <label htmlFor={inputId} className="text-secondary-grey mb-0">{label}</label>}
            <label htmlFor={inputId} className="relative cursor-pointer mb-0">
                <input 
                    type="checkbox" 
                    id={inputId} 
                    onChange={handleChange} 
                    className="sr-only peer" 
                    checked={isChecked}
                />
                <div
                    className="w-10 h-25px bg-white rounded-full border-2 border-secondary-grey transition-colors peer-checked:border-green-500"></div>
                <div style={{marginTop:"-22px"}} className=" w-5 h-5 mb-1 bg-secondary-grey rounded-full shadow top-29.5px translate-x-3px transition-transform
                peer-checked:translate-x-4.2 peer-checked:bg-status-done"></div>
            </label>
        </div>
    )
}
export default ToggleButton;
