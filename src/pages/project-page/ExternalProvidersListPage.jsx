import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import SearchBar from "../../components/SearchBar.jsx";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import axios from "axios";
import { useToasts } from "react-toast-notifications";


const ExternalProvidersListPage = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [providerList, setProviderList] = useState([]);
  const [filteredProviderList, setFilteredProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    draft: true,
    approved: false,
    archived: false,
  });

  const [filterCounts, setFilterCounts] = useState({
    draft: 0,
    approved: 0,
    archived: 0,
  });

  useEffect(() => {
    const sampleData = [
      { id: 1, name: "Provider A", status: "Draft", type: "Hosting" },
      { id: 2, name: "Provider B", status: "Approved", type: "Email" },
      { id: 3, name: "Provider C", status: "Archived", type: "Storage" },
    ];
    setProviderList(sampleData);
    setFilteredProviderList(sampleData);

    setFilterCounts({
      draft: sampleData.filter((p) => p.status === "Draft").length,
      approved: sampleData.filter((p) => p.status === "Approved").length,
      archived: sampleData.filter((p) => p.status === "Archived").length,
    });
  }, []);

  const handleSearch = (term) => {
    let filtered = providerList;

    if (term.trim() !== "") {
      filtered = filtered.filter((provider) =>
        provider.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredProviderList(filtered);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filteredList = filteredProviderList.filter((provider) => {
    if (!selectedFilters.draft && !selectedFilters.approved && !selectedFilters.archived)
      return false;

    if (selectedFilters.draft && provider.status === "Draft") return true;
    if (selectedFilters.approved && provider.status === "Approved") return true;
    if (selectedFilters.archived && provider.status === "Archived") return true;

    return false;
  });

  const handleDeleteClick = (provider) => {
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  };

  return (
    <div className="h-list-screen w-full">
      <div className="flex-col gap-4">
        <div className="flex flex-col gap-4 pl-3 pr-3">
          <SearchBar onSearch={handleSearch} />

          <div className="flex w-full laptopL:w-72 space-x-3 ml-3">
            {["draft", "approved", "archived"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1 rounded-xl text-xs ${
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

      <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-1 mt-6">
        {filteredList.length === 0 ? (
          <div className="text-center text-gray-600">
            No external providers found
          </div>
        ) : (
          filteredList.map((provider) => (
            <div
              key={provider.id}
              style={{ width: "256px" }}
              onClick={() => setSelectedProvider(provider)}
              className={`flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer ${
                selectedProvider?.id === provider.id
                  ? "border-primary-pink"
                  : "border-gray-200"
              }`}
            >
              <div className="col-span-2 text-left flex flex-col gap-1">
                <div className="font-bold">{provider.name}</div>
                <div className="text-xs text-gray-600">
                  {provider.type || "Service Provider"}
                </div>
              </div>
              <div className="flex gap-1">
                <TrashIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(provider);
                  }}
                  className="w-4 h-4 text-pink-700 cursor-pointer z-10"
                />
                <ChevronRightIcon className="w-4 h-4 text-black cursor-pointer" />
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedProvider(null);
        }}
        message={
          selectedProvider
            ? `Delete external provider "${selectedProvider.name}"?`
            : ""
        }
      />
    </div>
  );
};

export default ExternalProvidersListPage;
