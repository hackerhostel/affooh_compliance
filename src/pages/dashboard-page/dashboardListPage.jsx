import React from 'react'

function DashboardListPage({ selectedDashboard, onSelect }) {
    return (
        <div className='h-list-screen overflow-y-auto w-full'>
            <div className='flex flex-col gap-3 p-3'>
                <button 
                    onClick={() => onSelect("Overview")}
                    className={`items-center p-3 border rounded-md w-full grid grid-cols-3 gap-2 transition-colors ${selectedDashboard === "Overview" ? 'bg-pink-50 border-primary-pink ring-1 ring-primary-pink' : 'border-gray-200 hover:bg-gray-100'}`}
                >
                    <div className='col-span-2 text-left'>
                        <div className={`font-bold ${selectedDashboard === "Overview" ? 'text-primary-pink' : 'text-gray-700'}`}>Overview</div>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default DashboardListPage;