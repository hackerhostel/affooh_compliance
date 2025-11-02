import React, { useState } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline"
import FormSelect from "../../../components/FormSelect.jsx";
import  CreateNewCloudAsset from "./CreateNewCloudAsset.jsx";
import CloudAssetUpdate from "./CloudAssetUpdate.jsx"; 

const CloudAssetOverview = () => {
   const [isOpen, setIsOpen] = useState(false);
    const [openActionRowId, setOpenActionRowId] = useState(null);
    const [editAsset, setEditAsset] = useState(null);
  // Dummy filter form state
  const [formValues, setFormValues] = useState({
    vendor: "",
    type: "",
    classification: "",
    owner: "",
  });

  // ✅ Classification color handler
  const getColorClass = (classification) => {
    switch (classification) {
      case "Public":
        return "text-green-600 font-semibold";
      case "Confidential":
        return "text-yellow-500 font-semibold";
      case "Restricted":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-500 font-semibold";
    }
  };

  // ✅ Dummy Cloud Asset Data
  const [assetRows, setAssetRows] = useState([
    {
      id: 1,
      asset: "AWS EC2 Instance",
      vendor: "Amazon Web Services",
      type: "Compute",
      backupAvailability: "Yes",
      backupLocation: "AWS S3 Backup",
      classification: "Confidential",
      owner: { firstName: "Alice", lastName: "Johnson", avatar: "" },
    },
    {
      id: 2,
      asset: "Azure SQL Database",
      vendor: "Microsoft Azure",
      type: "Database",
      backupAvailability: "Yes",
      backupLocation: "Azure Blob Storage",
      classification: "Restricted",
      owner: { firstName: "John", lastName: "Doe", avatar: "" },
    },
    {
      id: 3,
      asset: "Google Cloud Storage",
      vendor: "Google Cloud",
      type: "Storage",
      backupAvailability: "No",
      backupLocation: "—",
      classification: "Public",
      owner: { firstName: "Maria", lastName: "Gomez", avatar: "" },
    },
  ]);

  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  const handleDeleteRow = (id) => {
    setAssetRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleStartEdit = (id) => {
    const asset = assetRows.find((row) => row.id === id);
    if (asset) {
      setEditAsset(asset); // ✅ triggers edit mode
      setOpenActionRowId(null);
    }
  };

   

  const onAddNew = () => {
    setIsOpen(true)
  };

  const handleClose = () => {
    setIsOpen(false);
  }

   if (editAsset) {
      return (
        <CloudAssetUpdate
          asset={editAsset}
          onBack={handleClose} 
        />
      );
    }

  // Render owner cell (same as approvedBy cell)
  const renderUserCell = (user) => {
    if (!user)
      return <span className="text-gray-400 italic">No user</span>;

    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-6">
      {/* Top Buttons */}
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Archived
        </button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Approved
        </button>
        <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Save
        </button>
      </div>

      <div className="flex items-center gap-5 mt-4">
        <span className="text-lg font-semibold">Cloud Asset</span>
         <div className="flex items-center gap-1">
          <PlusCircleIcon onClick={onAddNew} className="w-6 h-6 text-pink-500 cursor-pointer" />
          <button className="text-text-color" onClick={onAddNew}>
            Add New
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center mt-4 justify-between">
        <div className="flex space-x-4">
          {["classification", "owner"].map((field) => (
            <div className="w-28" key={field}>
              <FormSelect
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                showLabel={false}
                options={[]}
                formValues={formValues}
                onChange={(e) =>
                  setFormValues({ ...formValues, [field]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-3 shadow-sm">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="py-4 px-2 w-10">ID</th>
              <th className="py-4 px-4">Asset</th>
              <th className="py-4 px-4">Vendor</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Backup Availability</th>
              <th className="py-4 px-4">Backup Location</th>
              <th className="py-4 px-4">Classification</th>
              <th className="py-4 px-4">Owner</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {assetRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  No records found
                </td>
              </tr>
            ) : (
              assetRows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-2">{index + 1}</td>
                  <td className="py-4 px-4">{row.asset}</td>
                  <td className="py-4 px-4">{row.vendor}</td>
                  <td className="py-4 px-4">{row.type}</td>
                  <td className="py-4 px-4">{row.backupAvailability}</td>
                  <td className="py-4 px-4">{row.backupLocation}</td>
                  <td className={`py-4 px-4 ${getColorClass(row.classification)}`}>
                    {row.classification}
                  </td>
                  <td className="py-4 px-4">{renderUserCell(row.owner)}</td>
                  <td className="py-3 px-2">
                    {openActionRowId !== row.id ? (
                      <div
                        className="cursor-pointer inline-flex"
                        onClick={() => toggleActionMenu(row.id)}
                      >
                        <EllipsisVerticalIcon className="w-5 h-5 text-secondary-grey" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleStartEdit(row.id)}
                        >
                          <PencilIcon className="w-5 h-5 text-text-color" />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleDeleteRow(row.id)}
                        >
                          <TrashIcon className="w-5 h-5 text-text-color" />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => setOpenActionRowId(null)}
                        >
                          <XMarkIcon className="w-5 h-5 text-text-color" />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <CreateNewCloudAsset isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default CloudAssetOverview;
