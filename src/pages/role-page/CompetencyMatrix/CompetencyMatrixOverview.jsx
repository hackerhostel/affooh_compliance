import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const CompetencyMatrixOverview = () => {
  // Dummy competency data
  const [competencyRows, setCompetencyRows] = useState([
    {
      id: 1,
      employee: "Alice Johnson",
      communication: "Excellent",
      technical: "Advanced",
      leadership: "Strong",
      problemSolving: "Excellent",
      domainKnowledge: "Expert",
    },
    {
      id: 2,
      employee: "Bob Smith",
      communication: "Good",
      technical: "Intermediate",
      leadership: "Moderate",
      problemSolving: "Good",
      domainKnowledge: "Advanced",
    },
    {
      id: 3,
      employee: "Carol Lee",
      communication: "Excellent",
      technical: "Advanced",
      leadership: "Strong",
      problemSolving: "Excellent",
      domainKnowledge: "Intermediate",
    },
    {
      id: 4,
      employee: "David Brown",
      communication: "Good",
      technical: "Expert",
      leadership: "Strong",
      problemSolving: "Advanced",
      domainKnowledge: "Expert",
    },
    {
      id: 5,
      employee: "Evelyn White",
      communication: "Excellent",
      technical: "Intermediate",
      leadership: "Moderate",
      problemSolving: "Good",
      domainKnowledge: "Advanced",
    },
  ]);

  // Delete handler
  const handleDeleteRow = (id) => {
    setCompetencyRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5">
        <span className="text-lg font-semibold">Competency Matrix</span>
      </div>

      <div className="bg-white rounded p-3 mt-2">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="text-left text-secondary-grey border-b border-gray-200">
              <th className="py-4 px-2 w-10">#</th>
              <th className="py-4 px-4">Employee</th>
              <th className="py-4 px-4">Communication</th>
              <th className="py-4 px-4">Technical Skills</th>
              <th className="py-4 px-4">Leadership</th>
              <th className="py-4 px-4">Problem Solving</th>
              <th className="py-4 px-4">Domain Knowledge</th>
              <th className="py-4 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {competencyRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  No records found
                </td>
              </tr>
            ) : (
              competencyRows.map((row, index) => (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="py-5 px-2">{index + 1}</td>
                  <td className="py-4 px-2">{row.employee}</td>
                  <td className="py-4 px-2">{row.communication}</td>
                  <td className="py-4 px-2">{row.technical}</td>
                  <td className="py-4 px-2">{row.leadership}</td>
                  <td className="py-4 px-2">{row.problemSolving}</td>
                  <td className="py-4 px-2">{row.domainKnowledge}</td>
                  <td className="py-4 px-2">
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

export default CompetencyMatrixOverview;
