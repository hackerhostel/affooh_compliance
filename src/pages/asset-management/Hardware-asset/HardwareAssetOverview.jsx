import React, { useState } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";
import CreateNewHardwareAsset from "./CreateNewHardwareAsset.jsx";
import CreateNewHardwareAssetFurniture from "./CreateNewHardwareAssetFurniture.jsx";
import DeviceUpdate from "./DeviceUpdate.jsx";
import FurnitureUpdate from "./FurnitureUpdate.jsx";

const HardwareAssetOverview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editAsset, setEditAsset] = useState(null);

  const [formValues, setFormValues] = useState({
    type: "",
    owner: "",
    classification: "",
    development: "",
    assigned: "",
  });

  const typeOptions = [
    { label: "Device", value: "device" },
    { label: "Furniture", value: "furniture" },
  ];

  const [assetRows, setAssetRows] = useState([
    {
      id: 1,
      assetName: "Dell Latitude 5520",
      code: "DL-5520",
      serialKey: "DL5520-XYZ123",
      type: "device",
      category: "Computers",
      classification: "Hardware",
      department: "Engineering",
      owner: { firstName: "Alice", lastName: "Johnson", avatar: "" },
      assignee: { firstName: "Bob", lastName: "Smith", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    },
    {
      id: 2,
      assetName: "HP LaserJet Pro M404",
      code: "HP-M404",
      serialKey: "HP404-ABC456",
      type: "device",
      category: "Office Equipment",
      classification: "Peripheral",
      department: "Administration",
      owner: { firstName: "Carol", lastName: "Lee", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      assignee: null,
    },
    {
      id: 3,
      assetName: "Office Desk",
      code: "FUR-001",
      serialKey: "FUR001-AAA111",
      type: "furniture",
      category: "Furniture",
      classification: "Office",
      department: "Design",
      owner: { firstName: "David", lastName: "Brown", avatar: "" },
      assignee: { firstName: "Evelyn", lastName: "White", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
    },
  ]);

  // Show avatar or initials
  const renderUserCell = (user) => {
    if (!user) return <span className="text-gray-400 italic">No user</span>;
    return (
      <div className="flex items-center space-x-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
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

  // handle "Add New" button
  const onAddNew = () => {
    if (formValues.type === "device" || formValues.type === "furniture") {
      setSelectedType(formValues.type);
      setIsOpen(true);
      setEditAsset(null);
    } else {
      alert("Please select a type before adding a new asset.");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedType("");
    setEditAsset(null);
  };

  // open action menu
  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  // handle delete row
  const handleDeleteRow = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this asset?");
    if (confirmed) {
      setAssetRows(assetRows.filter((row) => row.id !== id));
      setOpenActionRowId(null);
    }
  };

  // handle start edit
  const handleStartEdit = (id) => {
    const asset = assetRows.find((row) => row.id === id);
    if (asset) {
      setEditAsset(asset);
      setSelectedType(asset.type); // ensures correct update form is shown
      setIsOpen(true);
    }
  };


  return (
    <div className="relative mt-6">
      {/* ✅ Hide Overview when editing or adding */}
      {!isOpen && (
        <>
          {/* Top Buttons */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Archived</button>
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Approved</button>
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">Save</button>
          </div>

          {/* Header */}
          <div className="flex items-center gap-5 mt-4">
            <span className="text-lg font-semibold">Hardware Asset</span>
            <div className="flex items-center gap-1">
              <PlusCircleIcon onClick={onAddNew} className="w-6 h-6 text-pink-500 cursor-pointer" />
              <button className="text-text-color" onClick={onAddNew}>
                Add New
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <div className="w-28">
                <FormSelect
                  name="type"
                  options={typeOptions}
                  placeholder="Type"
                  showLabel={false}
                  formValues={formValues}
                  onChange={(e) => setFormValues({ ...formValues, type: e.target.value })}
                />
              </div>
              <div className="w-28">
                <FormSelect
                  name="owner"
                  placeholder="Owner"
                  showLabel={false}
                  options={[]}
                  formValues={formValues}
                  onChange={(e) => setFormValues({ ...formValues, owner: e.target.value })}
                />
              </div>
              <div className="w-36">
                <FormSelect
                  name="classification"
                  placeholder="Classification"
                  showLabel={false}
                  options={[]}
                  formValues={formValues}
                  onChange={(e) => setFormValues({ ...formValues, classification: e.target.value })}
                />
              </div>
              <div className="w-28">
                <FormSelect
                  name="development"
                  placeholder="Development"
                  showLabel={false}
                  options={[]}
                  formValues={formValues}
                  onChange={(e) => setFormValues({ ...formValues, development: e.target.value })}
                />
              </div>
              <div className="w-28">
                <FormSelect
                  name="assigned"
                  placeholder="Assigned"
                  showLabel={false}
                  options={[]}
                  formValues={formValues}
                  onChange={(e) => setFormValues({ ...formValues, assigned: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded p-3 mt-3 shadow-sm">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="text-left text-secondary-grey border-b border-gray-200">
                  <th className="py-4 px-2 w-10">#</th>
                  <th className="py-4 px-4">Asset Name</th>
                  <th className="py-4 px-4">Code</th>
                  <th className="py-4 px-4">Serial Key</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Classification</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4">Owner</th>
                  <th className="py-4 px-4">Assignee</th>
                  <th className="py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assetRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center text-gray-500 py-4">
                      No records found
                    </td>
                  </tr>
                ) : (
                  assetRows.map((row, index) => (
                    <tr key={row.id} className="border-b border-gray-200">
                      <td className="py-5 px-2">{index + 1}</td>
                      <td className="py-4 px-2">{row.assetName}</td>
                      <td className="py-4 px-2">{row.code}</td>
                      <td className="py-4 px-2">{row.serialKey}</td>
                      <td className="py-4 px-2 capitalize">{row.type}</td>
                      <td className="py-4 px-2">{row.category}</td>
                      <td className="py-4 px-2">{row.classification}</td>
                      <td className="py-4 px-2">{row.department}</td>
                      <td className="py-4 px-2">{renderUserCell(row.owner)}</td>
                      <td className="py-4 px-2">{renderUserCell(row.assignee)}</td>
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
        </>
      )}

      {/* ✅ Popups / Update Forms */}
      {/* ✅ Popups / Update Forms */}
      {isOpen && !editAsset && selectedType === "device" && (
        <CreateNewHardwareAsset onClose={handleClose} isOpen={isOpen} />
      )}

      {isOpen && !editAsset && selectedType === "furniture" && (
        <CreateNewHardwareAssetFurniture onClose={handleClose} isOpen={isOpen} />
      )}

      {isOpen && editAsset && selectedType === "device" && (
        <DeviceUpdate onBack={handleClose} asset={editAsset} />
      )}

      {isOpen && editAsset && selectedType === "furniture" && (
        <FurnitureUpdate onBack={handleClose} asset={editAsset} />
      )}

    </div>
  );
};

export default HardwareAssetOverview;
