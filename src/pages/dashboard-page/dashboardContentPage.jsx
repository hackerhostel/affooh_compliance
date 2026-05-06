import React from 'react'
import CMDashboard from './CMDashboard.jsx';

function DashboardContentPage({ selectedDashboard }) {
  return (
      <div className="h-full overflow-y-auto">
          {selectedDashboard === "Overview" ? (
              <CMDashboard />
          ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                  Select a dashboard to view content
              </div>
          )}
      </div>
  )
}

export default DashboardContentPage;