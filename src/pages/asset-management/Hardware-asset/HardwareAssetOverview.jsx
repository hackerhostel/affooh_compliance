import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import FormSelect from '../../../components/FormSelect.jsx';

const HardwareAssetOverview = () => {
  // Dummy hardware asset data
   const [formValues, setFormValues] = useState({
        type: '',
        owner: '',
        classification: '',
        development: '',
        assigned: '',
    });

  const [assetRows, setAssetRows] = useState([
    {
      id: 1,
      assetName: "Dell Latitude 5520",
      code: "DL-5520",
      serialKey: "DL5520-XYZ123",
      type: "Laptop",
      category: "Computers",
      classification: "Hardware",
      department: "Engineering",
      owner: {
        firstName: "Alice",
        lastName: "Johnson",
        avatar: "",
      },
      assignee: {
        firstName: "Bob",
        lastName: "Smith",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    },
    {
      id: 2,
      assetName: "HP LaserJet Pro M404",
      code: "HP-M404",
      serialKey: "HP404-ABC456",
      type: "Printer",
      category: "Office Equipment",
      classification: "Peripheral",
      department: "Administration",
      owner: {
        firstName: "Carol",
        lastName: "Lee",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      assignee: null,
    },
    {
      id: 3,
      assetName: "Apple MacBook Pro 16”",
      code: "MBP-16",
      serialKey: "MBP16-789XYZ",
      type: "Laptop",
      category: "Computers",
      classification: "Hardware",
      department: "Design",
      owner: {
        firstName: "David",
        lastName: "Brown",
        avatar: "",
      },
      assignee: {
        firstName: "Evelyn",
        lastName: "White",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
    },
  ]);

  // Delete handler
  const handleDeleteRow = (id) => {
    setAssetRows((prev) => prev.filter((row) => row.id !== id));
  };

  // Render user (owner or assignee)
  const renderUserCell = (user) => {
    if (!user)
      return <span className="text-gray-400 italic">No user</span>;

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
        <span>{user.firstName} {user.lastName}</span>
      </div>
    );
  };

  return (
    <div className="mt-6">
        {/* Top Buttons */}
            <div className='flex justify-end items-center mt-4 space-x-2'>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Archived</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Approved</button>
                <button className='bg-primary-pink px-8 py-3 rounded-md text-white'>Save</button>
            </div>
      <div className="flex items-center justify-between gap-5">
        <span className="text-lg font-semibold">Hardware Asset </span>
      </div>

      <div className='flex items-center justify-between'>
                    <div className='flex space-x-4 '>
                        <div className='w-28'>
                            <FormSelect
                                name="type"
                                options={[]}
                                placeholder="Type"
                                showLabel={false}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>
                        <div className='w-28'>
                            <FormSelect
                                name="owner"
                                placeholder="Owner"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-36'>
                            <FormSelect
                                name="classification"
                                placeholder="Classification"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-28'>
                            <FormSelect
                                name="development"
                                placeholder="Development"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-28'>
                            <FormSelect
                                name="assigned"
                                placeholder="Assigned"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>
                    </div>

                  
                </div>

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
              {/* <th className="py-4 px-2">Action</th> */}
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
                  <td className="py-4 px-2">{row.type}</td>
                  <td className="py-4 px-2">{row.category}</td>
                  <td className="py-4 px-2">{row.classification}</td>
                  <td className="py-4 px-2">{row.department}</td>
                  <td className="py-4 px-2">{renderUserCell(row.owner)}</td>
                  <td className="py-4 px-2">{renderUserCell(row.assignee)}</td>
                  {/* <td className="py-4 px-2">
                    <TrashIcon
                      onClick={() => handleDeleteRow(row.id)}
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500 transition"
                    />
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HardwareAssetOverview;
