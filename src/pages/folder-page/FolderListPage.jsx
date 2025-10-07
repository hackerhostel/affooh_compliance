import React, { useState, useMemo } from "react";
import { TrashIcon, ChevronRightIcon } from "@heroicons/react/24/outline";


const FolderListPage = ({
  folders = [],
  onSelect,
  selectedFolderId,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    active: false,
    onHold: false,
    closed: false,
  });

  // 🔍 Handle search
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  // 🏷 Handle filter toggle
  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // 📊 Example filter counts (you can customize based on folder.status)
  const filterCounts = useMemo(() => {
    return {
      active: folders.filter((f) => f.status === "active").length,
      onHold: folders.filter((f) => f.status === "onHold").length,
      closed: folders.filter((f) => f.status === "closed").length,
    };
  }, [folders]);

  // 🧩 Filter + search logic
  const filteredFolders = useMemo(() => {
    const activeFilters = Object.keys(selectedFilters).filter(
      (f) => selectedFilters[f]
    );

    return folders.filter((folder) => {
      const matchesSearch = folder.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilters.length === 0 || activeFilters.includes(folder.status);

      return matchesSearch && matchesFilter;
    });
  }, [folders, searchTerm, selectedFilters]);

  return (
    <div className="h-list-screen w-full">
      {/* 🔍 Search + Filter Section */}
      <div className="flex-col gap-4">
        <div className="flex flex-col gap-4 pl-3 pr-3">
          <div className="flex w-full laptopL:w-60 justify-between ml-3">
            {["active", "onHold", "closed"].map((filter) => (
              <button
                key={filter}
                className={`px-2 py-1 rounded-xl text-xs ${
                  selectedFilters[filter]
                    ? "bg-primary-pink text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} (
                {filterCounts[filter]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📂 Folder List */}
      <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-1 mt-6">
        {filteredFolders.length === 0 ? (
          <div className="text-center text-gray-600">No folders found</div>
        ) : (
          filteredFolders.map((folder) => {
            const isActive = selectedFolderId === folder.id;
            return (
              <div
                key={folder.id}
                style={{ width: "256px" }}
                className={`flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer ${
                  isActive ? "border-primary-pink" : "border-gray-200"
                }`}
                onClick={() => onSelect && onSelect(folder.id)}
              >
                <div className="col-span-2 text-left flex flex-col gap-1">
                  <div className="font-bold">{folder.name}</div>
                  {folder.description && (
                    <div className="text-xs text-gray-600 truncate">
                      {folder.description}
                    </div>
                  )}
                  {folder.updatedAt && (
                    <div className="text-[10px] text-gray-400 mt-1">
                      Updated {folder.updatedAt}
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  <TrashIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(folder);
                    }}
                    className="w-4 h-4 text-pink-700 cursor-pointer z-10"
                  />
                  <ChevronRightIcon className="w-4 h-4 text-black cursor-pointer" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FolderListPage;
