import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const SkillInventoryOverview = () => {
  // Dummy skill inventory data
  const [skillRows, setSkillRows] = useState([
    {
      id: 1,
      employee: "Alice Johnson",
      jobTitle: "Software Engineer",
      skill: "React.js",
      certification: "AWS Certified Developer",
      experience: "5 years",
      proficiency: "Advanced",
    },
    {
      id: 2,
      employee: "Bob Smith",
      jobTitle: "Backend Developer",
      skill: "Node.js",
      certification: "Microsoft Azure Fundamentals",
      experience: "4 years",
      proficiency: "Intermediate",
    },
    {
      id: 3,
      employee: "Carol Lee",
      jobTitle: "UI/UX Designer",
      skill: "Figma",
      certification: "Adobe Certified Expert",
      experience: "6 years",
      proficiency: "Advanced",
    },
    {
      id: 4,
      employee: "David Brown",
      jobTitle: "DevOps Engineer",
      skill: "Docker & Kubernetes",
      certification: "AWS DevOps Professional",
      experience: "7 years",
      proficiency: "Advanced",
    },
    {
      id: 5,
      employee: "Evelyn White",
      jobTitle: "QA Engineer",
      skill: "Selenium",
      certification: "ISTQB Certified Tester",
      experience: "3 years",
      proficiency: "Intermediate",
    },
  ]);

  const handleDeleteRow = (id) => {
    setSkillRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Skill Inventory</span>
      </div>

      <div className="bg-white rounded p-3 mt-2">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-6 px-2 w-10">#</th>
              <th className="py-6 px-4">Employee</th>
              <th className="py-6 px-4">Job Title</th>
              <th className="py-6 px-4">Skill</th>
              <th className="py-6 px-4">Certification</th>
              <th className="py-6 px-4">Years of Experience</th>
              <th className="py-6 px-4">Proficiency Level</th>
              <th className="py-6 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {skillRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  No records found
                </td>
              </tr>
            ) : (
              skillRows.map((row, index) => (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-6 px-2">{index + 1}</td>
                  <td className="py-6 px-2">{row.employee}</td>
                  <td className="py-6 px-2">{row.jobTitle}</td>
                  <td className="py-6 px-2">{row.skill}</td>
                  <td className="py-6 px-2">{row.certification}</td>
                  <td className="py-6 px-2 text-center">{row.experience}</td>
                  <td className="py-6 px-2 text-center">{row.proficiency}</td>
                  <td className="py-6 px-2">
                    <TrashIcon
                      onClick={() => handleDeleteRow(row.id)}
                      className="w-5 h-5 text-text-color cursor-pointer"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillInventoryOverview;
