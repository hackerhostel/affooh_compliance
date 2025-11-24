import React, { useState } from "react";
import FormSelect from "../../../components/FormSelect.jsx";
import { getSelectOptions } from "../../../utils/commonUtils.js";

const UserAccessMatrixOverview = () => {
  // Dropdowns
  const userOptions = getSelectOptions([
    { id: "Alice Johnson", name: "Alice Johnson" },
    { id: "Bob Smith", name: "Bob Smith" },
    { id: "Carol Lee", name: "Carol Lee" },
    { id: "David Brown", name: "David Brown" },
  ]);

  const teamOptions = getSelectOptions([
    { id: "Team A", name: "Team A" },
    { id: "Team B", name: "Team B" },
    { id: "Team C", name: "Team C" },
  ]);

  const groupOptions = getSelectOptions([
    { id: "Group X", name: "Group X" },
    { id: "Group Y", name: "Group Y" },
    { id: "Group Z", name: "Group Z" },
  ]);

  // Systems listing
  const [systems, setSystems] = useState([
    {
      id: 1,
      system: "Biometric Access",
      user1: "",
      user2: "",
      user3: "",
      user4: "",
      user5: "",
    },
    {
      id: 2,
      system: "CCTV",
      user1: "",
      user2: "",
      user3: "",
      user4: "",
      user5: "",
    },
    {
      id: 3,
      system: "Firewall",
      user1: "",
      user2: "",
      user3: "",
      user4: "",
      user5: "",
    },
  ]);

  // For handling select changes
  const handleSelectChange = (id, field, value) => {
    setSystems((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  return (
    <div className="mt-6">

        <div className=" flex justify-end">
            <button className="bg-primary-pink px-8 py-3 rounded-md text-white">
          Approved
        </button>
        </div>
        
      <div className="flex items-center gap-5">
            <span className="text-lg font-semibold">User Access Matrix</span>
        <div className="w-40">
          <FormSelect
            name="team"
            formValues={{ team: "" }}
            options={teamOptions}
            onChange={() => {}}
            placeholder="Team"
            showLabel={false}
          />
        </div>

        
        <div className="w-40">
          <FormSelect
            name="group"
            formValues={{ group: "" }}
            options={groupOptions}
            onChange={() => {}}
            placeholder="Group"
            showLabel={false}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded p-3 mt-4">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-3 px-2 w-10">#</th>
              <th className="py-3 px-4 w-40">System</th>
              <th className="py-3 px-4 w-40">User 1</th>
              <th className="py-3 px-4 w-40">User 2</th>
              <th className="py-3 px-4 w-40">User 3</th>
              <th className="py-3 px-4 w-40">User 4</th>
              <th className="py-3 px-4 w-40">User 5</th>
            </tr>
          </thead>

          <tbody>
            {systems.map((row, index) => (
              <tr key={row.id} className="border-b border-gray-200">
                <td className="py-3 px-2">{index + 1}</td>

                <td className="py-3 px-2">{row.system}</td>

                {/* User 1 */}
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="user1"
                    formValues={{ user1: row.user1 }}
                    options={userOptions}
                    onChange={(e) =>
                      handleSelectChange(row.id, "user1", e.target.value)
                    }
                  />
                </td>

                {/* User 2 */}
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="user2"
                    formValues={{ user2: row.user2 }}
                    options={userOptions}
                    onChange={(e) =>
                      handleSelectChange(row.id, "user2", e.target.value)
                    }
                  />
                </td>

                {/* User 3 */}
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="user3"
                    formValues={{ user3: row.user3 }}
                    options={userOptions}
                    onChange={(e) =>
                      handleSelectChange(row.id, "user3", e.target.value)
                    }
                  />
                </td>

                {/* User 4 */}
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="user4"
                    formValues={{ user4: row.user4 }}
                    options={userOptions}
                    onChange={(e) =>
                      handleSelectChange(row.id, "user4", e.target.value)
                    }
                  />
                </td>

                {/* User 5 */}
                <td className="py-3 px-2 w-40">
                  <FormSelect
                    name="user5"
                    formValues={{ user5: row.user5 }}
                    options={userOptions}
                    onChange={(e) =>
                      handleSelectChange(row.id, "user5", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessMatrixOverview;
