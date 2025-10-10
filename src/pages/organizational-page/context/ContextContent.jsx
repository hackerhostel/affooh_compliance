import React from 'react'

const ContextContent = () => {
    return (
        <div className="h-[calc(100vh-250px)] p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Context</h1>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Organizational Context</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Business Environment</h3>
                            <p className="text-gray-600 leading-relaxed">
                                This section outlines the external and internal factors that influence our organization's 
                                operations and strategic decisions. It includes market conditions, regulatory environment, 
                                technological trends, and organizational capabilities.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Key Stakeholders</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Identification and analysis of primary stakeholders including customers, suppliers, 
                                regulators, employees, and shareholders who have an interest in the organization's activities.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Regulatory Framework</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Overview of applicable laws, regulations, and industry standards that govern our 
                                operations and compliance requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContextContent