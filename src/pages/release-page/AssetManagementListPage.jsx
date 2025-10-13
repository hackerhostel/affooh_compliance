import React, { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import SearchBar from "../../components/SearchBar.jsx";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";

const AssetManagementListPage = () => {
  const [assets, setAssets] = useState([
    { id: 1, name: "Asset Inventory System", type: "Software", status: "To Do" },
    { id: 2, name: "Office Laptop Set", type: "Hardware", status: "In Progress" },
    { id: 3, name: "Cloud Storage License", type: "Subscription", status: "Done" },
  ]);

  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    toDo: true,
    inProgress: false,
    done: false,
  });

  const [filterCounts, setFilterCounts] = useState({
    toDo: 0,
    inProgress: 0,
    done: 0,
  });

  const [openMenu, setOpenMenu] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toDeleteAsset, setToDeleteAsset] = useState(null);


  useEffect(() => {
    const counts = {
      toDo: assets.filter((a) => a.status === "To Do").length,
      inProgress: assets.filter((a) => a.status === "In Progress").length,
      done: assets.filter((a) => a.status === "Done").length,
    };
    setFilterCounts(counts);
    setFilteredAssets(assets);
  }, [assets]);


  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };


  const filteredList = filteredAssets.filter((asset) => {
    if (!selectedFilters.toDo && !selectedFilters.inProgress && !selectedFilters.done)
      return false;
    if (selectedFilters.toDo && asset.status === "To Do") return true;
    if (selectedFilters.inProgress && asset.status === "In Progress") return true;
    if (selectedFilters.done && asset.status === "Done") return true;
    return false;
  });


  const handleSearch = (term) => {
    if (term.trim() === "") {
      setFilteredAssets(assets);
    } else {
      const filtered = assets.filter((asset) =>
        asset.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAssets(filtered);
    }
  };


  const toggleMenuOpen = (index, event) => {
    if (openMenu?.index === index) {
      setOpenMenu(null);
    } else {
      setOpenMenu({
        index: index,
        position: { top: event.screenY },
      });
    }
  };


  const handleDeleteClick = (asset) => {
    setToDeleteAsset(asset);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (toDeleteAsset) {
      setAssets((prev) => prev.filter((a) => a.id !== toDeleteAsset.id));
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="h-list-screen overflow-y-auto w-full">
      <div className="flex-col gap-4">
        {/* Search + Filters */}
        <div className="flex flex-col gap-4 pl-3 pr-3">
          <SearchBar onSearch={handleSearch} />

          <div className="flex w-full laptopL:w-60 gap-5 justify-start ml-3">
            <button
              className={`px-2 py-1 rounded-xl text-xs ${
                selectedFilters.toDo ? "bg-primary-pink text-white" : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("toDo")}
            >
              To Do ({filterCounts.toDo})
            </button>

            <button
              className={`px-2 py-1 rounded-xl text-xs ${
                selectedFilters.inProgress
                  ? "bg-primary-pink text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("inProgress")}
            >
              In Progress ({filterCounts.inProgress})
            </button>

            <button
              className={`px-2 py-1 rounded-xl text-xs ${
                selectedFilters.done ? "bg-primary-pink text-white" : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("done")}
            >
              Done ({filterCounts.done})
            </button>
          </div>
        </div>

        {/* Asset List */}
        <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-3 pr-1 mt-6">
          {filteredList.length === 0 ? (
            <div className="text-center text-gray-600">No assets found</div>
          ) : (
            filteredList.map((asset, index) => (
              <div
                key={asset.id}
                style={{ width: "266px" }}
                className="flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer border-gray-200"
              >
                <div className="text-left">
                  <div className="font-bold mb-1">{asset.name}</div>
                  <div className="flex text-xs text-gray-600 items-center">
                    {asset.type}
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    {asset.status}
                  </div>
                </div>
                <div className="flex gap-1 relative">
                  <div onClick={(event) => toggleMenuOpen(index, event)}>
                    <EllipsisVerticalIcon className="w-4 h-4 text-black cursor-pointer" />
                  </div>
                  {openMenu?.index === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: "24px",
                        right: 0,
                      }}
                      className="mt-2 w-24 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleDeleteClick(asset)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          toDeleteAsset ? `Delete asset "${toDeleteAsset.name}"?` : ""
        }
      />
    </div>
  );
};

export default AssetManagementListPage;
