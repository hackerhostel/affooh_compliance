import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const SearchableDropdown = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  label = "",
  disabled = false,
  className = "",
  displayKey = "name",
  valueKey = "id",
  searchKey = "name",
  onSearch,
  loading = false,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    const selectedOption = options.find(
      (opt) => String(opt[valueKey]) === String(value)
    );
    setSelected(selectedOption || null);
  }, [value, options, valueKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && onSearch && search.length >= 2) {
      onSearch(search);
    }
  }, [search, isOpen, onSearch]);

  const handleSelect = (option) => {
    setIsOpen(false);
    setSearch("");
    onChange({ target: { name, value: option[valueKey] } });
  };

  const getDisplayValue = (option) => {
    if (typeof displayKey === "function") {
      return displayKey(option);
    }
    return option[displayKey] || option.name || option.assetName || "";
  };

  const filteredOptions = options.filter((option) => {
    if (!search) return true;
    const searchValue = search.toLowerCase();
    const optionValue = getDisplayValue(option).toLowerCase();
    const searchFieldValue = option[searchKey]?.toLowerCase() || "";
    return optionValue.includes(searchValue) || searchFieldValue.includes(searchValue);
  });

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
      )}
      <div
        className={`flex items-center justify-between p-2 border border-gray-300 rounded-md bg-white cursor-pointer ${
          disabled ? "opacity-60 cursor-not-allowed" : "hover:border-gray-400"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="text-sm text-gray-700 flex-1 truncate">
          {selected ? getDisplayValue(selected) : placeholder}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Loading...
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option[valueKey]}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelect(option)}
                >
                  {getDisplayValue(option)}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
