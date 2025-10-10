import React from 'react'

const OrganizationChartContent = () => {
    return (
        <div className="h-[calc(100vh-250px)] p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Organization Chart</h1>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Organizational Structure</h2>
                    
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mx-auto w-64">
                                <h3 className="text-lg font-semibold text-blue-800">CEO</h3>
                                <p className="text-blue-600">Chief Executive Officer</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-center space-x-8">
                            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 w-48 text-center">
                                <h4 className="font-semibold text-green-800">CTO</h4>
                                <p className="text-green-600 text-sm">Chief Technology Officer</p>
                            </div>
                            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 w-48 text-center">
                                <h4 className="font-semibold text-green-800">CFO</h4>
                                <p className="text-green-600 text-sm">Chief Financial Officer</p>
                            </div>
                            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 w-48 text-center">
                                <h4 className="font-semibold text-green-800">COO</h4>
                                <p className="text-green-600 text-sm">Chief Operating Officer</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
                                <h5 className="font-medium text-gray-700">Engineering</h5>
                                <p className="text-gray-500 text-sm">Development Teams</p>
                            </div>
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
                                <h5 className="font-medium text-gray-700">Finance</h5>
                                <p className="text-gray-500 text-sm">Accounting & Budgeting</p>
                            </div>
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
                                <h5 className="font-medium text-gray-700">Operations</h5>
                                <p className="text-gray-500 text-sm">Business Operations</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Key Responsibilities</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Clear reporting structure and accountability</li>
                            <li>Decision-making authority and escalation paths</li>
                            <li>Communication channels and collaboration protocols</li>
                            <li>Performance management and development frameworks</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrganizationChartContent
