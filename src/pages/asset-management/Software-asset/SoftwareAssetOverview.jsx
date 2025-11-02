import React, { useState } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import FormSelect from "../../../components/FormSelect.jsx";
import CreateNewSoftwareAsset from "./CreateNewSoftwareAsset.jsx";
import SoftwareAssetUpdate from "./SoftwareAssetUpdate.jsx";

const SoftwareAssetOverview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);
  const [editAsset, setEditAsset] = useState(null); // ✅ track asset being edited

  const [formValues, setFormValues] = useState({
    type: "",
    owner: "",
    classification: "",
    development: "",
    assigned: "",
  });

  const [assetRows, setAssetRows] = useState([
    {
      id: 1,
      softwareName: "Microsoft Silverlight",
      vendor: "Microsoft",
      downloadSource: "https://microsoft.com/silverlight",
      patch: "Yes",
      license: "Yes",
      approved: "Pending",
      approvedBy: { firstName: "Alice", lastName: "Johnson", avatar: "" },
    },
    {
      id: 2,
      softwareName: "Adobe Photoshop",
      vendor: "Adobe",
      downloadSource: "https://adobe.com/photoshop",
      patch: "No",
      license: "Yes",
      approved: "Approved",
      approvedBy: { firstName: "John", lastName: "Doe", avatar: "" },
    },
    {
      id: 3,
      softwareName: "Visual Studio Code",
      vendor: "Microsoft",
      downloadSource: "https://code.visualstudio.com",
      patch: "Yes",
      license: "Free",
      approved: "Approved",
      approvedBy: { firstName: "Maria", lastName: "Gomez", avatar: "" },
    },
  ]);

  const toggleActionMenu = (id) => {
    setOpenActionRowId(openActionRowId === id ? null : id);
  };

  const handleDeleteRow = (id) => {
    setAssetRows((prev) => prev.filter((row) => row.id !== id));
  };

  const onAddNew = () => {
    setEditAsset(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditAsset(null);
  };

  const handleStartEdit = (id) => {
    const asset = assetRows.find((row) => row.id === id);
    if (asset) {
      setEditAsset(asset);
      setIsOpen(true);
    }
  };

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
      {/* ✅ Show Update Component only */}
      {isOpen && editAsset ? (
        <SoftwareAssetUpdate asset={editAsset} onBack={handleClose} />
      ) : (
        <>
          {/* ✅ Show Overview Only When Not Editing */}
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
            <span className="text-lg font-semibold">Software Asset</span>
            <div className="flex items-center gap-1">
              <PlusCircleIcon
                onClick={onAddNew}
                className="w-6 h-6 text-pink-500 cursor-pointer"
              />
              <button className="text-text-color" onClick={onAddNew}>
                Add New
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex items-center mt-4 justify-between">
            <div className="flex space-x-4">
              {["type", "owner", "classification", "development", "assigned"].map(
                (field) => (
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
                )
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded p-3 mt-3 shadow-sm">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200">
                  <th className="py-4 px-2 w-10">#</th>
                  <th className="py-4 px-4">Software Name</th>
                  <th className="py-4 px-4">Vendor</th>
                  <th className="py-4 px-4">Download Source</th>
                  <th className="py-4 px-4">Latest Patch</th>
                  <th className="py-4 px-4">License</th>
                  <th className="py-4 px-4">Approval Status</th>
                  <th className="py-4 px-4">Approved By</th>
                  <th className="py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assetRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 py-4">
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
                      <td className="py-4 px-4">{row.softwareName}</td>
                      <td className="py-4 px-4">{row.vendor}</td>
                      <td className="py-4 px-4 text-blue-600 underline cursor-pointer">
                        <a
                          href={row.downloadSource}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {row.downloadSource}
                        </a>
                      </td>
                      <td className="py-4 px-4">{row.patch}</td>
                      <td className="py-4 px-4">{row.license}</td>
                      <td className="py-4 px-4">{row.approved}</td>
                      <td className="py-4 px-4">{renderUserCell(row.approvedBy)}</td>
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

          {/* ✅ Add popup for new asset */}
          {isOpen && !editAsset && (
            <CreateNewSoftwareAsset isOpen={isOpen} onClose={handleClose} />
          )}
        </>
      )}
    </div>
  );
};

export default SoftwareAssetOverview;
