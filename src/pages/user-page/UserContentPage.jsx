import React from 'react';
import { ClockIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, PencilIcon } from '@heroicons/react/24/outline/index.js';

const UserContentPage = () => {
    const timeData = {
        Today: 4,
        Yesterday: 8,
        Week: 40,
        Month: 150
    };

    const taskCounts = {
        all: 22,
        tasks: 10,
        bugs: 12
    };

    const estimationDeviations = [
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '10 hrs', actual: '8 hrs', deviation: '+4 hrs' },
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '10 hrs', actual: '12 hrs', deviation: '- 2 hrs' }
    ];

    const scheduleDeviations = [
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '05.10.2024', actual: '06.10.2024', deviation: '- 1d' },
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '05.10.2024', actual: '02.10.2024', deviation: '+ 3d' }
    ];

    const producedBugs = [
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: 'High', actual: 'Done', deviation: '+ 4 hrs' },
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: 'Low', actual: 'Ongoing', deviation: '- 2 hrs' }
    ];

    const DeviationTable = ({ headers, data }) => (
        <table className="w-full">
            <thead className="text-left text-sm text-gray-500">
            <tr>
                {headers.map(header => (
                    <th key={header} className="pb-3">{header}</th>
                ))}
            </tr>
            </thead>
            <tbody className="text-sm">
            {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                    <td className="py-3">{row.id}</td>
                    <td className="py-3">{row.summary}</td>
                    <td className="py-3">{row.estimation}</td>
                    <td className="py-3">{row.actual}</td>
                    <td className="py-3">
              <span className={`${row.deviation.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                {row.deviation}
              </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-wrap gap-6 pb-6">
                {/* Left Sidebar */}
                <div className="w-64 bg-white rounded-lg p-6 h-fit">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                        <h5 className="text-lg font-semibold mb-1">Nilanga Pathirana</h5>
                        <span className="text-sm text-gray-500 mb-6">Administrator</span>

                        <div className="w-full space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <EnvelopeIcon size={18}/>
                                <span className="text-sm">nilangapathirana@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <PhoneIcon className="h-5 w-5"/>
                                <span className="text-sm">+94 71 234 6678</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPinIcon className="h-5 w-5"/>
                                <span className="text-sm">2239 Hog Camp Road<br/>New Zealand</span>
                            </div>
                        </div>

                        <div className="mt-8 w-full">
                            <div className="rounded-full bg-pink-100 p-4">
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-pink-500">73</span>
                                    <p className="text-sm text-gray-500">Hours</p>
                                </div>
                            </div>
                            <p className="text-center mt-2 text-sm text-gray-500">Total Time Logs</p>
                        </div>
                    </div>
                </div>

                {/* Time log Section */}
                <div className="flex-1 bg-white rounded-lg p-6">
                    <h6 className="font-semibold mb-3">Time logs</h6>
                    <div className="flex gap-4 mb-6">
                        {Object.entries(timeData).map(([period, hours]) => (
                            <div key={period} className="flex-1">
                                <div className="bg-pink-500 text-white p-2 rounded-t-lg text-center">
                                    {period}
                                </div>
                                <div className="border border-t-0 rounded-b-lg p-3 text-center">
                                    <span className="text-xl font-semibold">{hours}</span>
                                    <span className="text-gray-500">hrs</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <table className="w-full">
                        <thead className="text-left text-sm text-gray-500">
                        <tr>
                            <th className="pb-3">Task ID</th>
                            <th className="pb-3">Task Summary</th>
                            <th className="pb-3">Time Speed</th>
                            <th className="pb-3">Date</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {[1, 2, 3, 4].map((_, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3">10001</td>
                                <td className="py-3">hjhtasdhjsad</td>
                                <td className="py-3">4hrs</td>
                                <td className="py-3">05.10.2024</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Tasks Section */}
                <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Tasks</h6>
                        <div className="flex gap-4">
                            {Object.entries(taskCounts).map(([type, count]) => (
                                <div key={type} className="text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                    ${type === 'all' ? 'bg-pink-100 text-pink-500' :
                                        type === 'tasks' ? 'bg-green-100 text-green-500' :
                                            'bg-red-100 text-red-500'}`}>
                                        {count}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 capitalize">{type}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mb-4">
                        <select className="px-4 py-2 border rounded-lg text-sm">
                            <option>Priority</option>
                        </select>
                        <select className="px-4 py-2 border rounded-lg text-sm">
                            <option>Status</option>
                        </select>
                    </div>

                    <table className="w-full">
                        <thead className="text-left text-sm text-gray-500">
                        <tr>
                            <th className="pb-3">Task ID</th>
                            <th className="pb-3">Task Summary</th>
                            <th className="pb-3">Priority</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Due Date</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        <tr className="border-t">
                            <td className="py-3">10001</td>
                            <td className="py-3">hjhtasdhjsad</td>
                            <td className="py-3">High</td>
                            <td className="py-3">Done</td>
                            <td className="py-3">05.10.2024</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-6 pb-6">
                {/* Estimation Deviations */}
                <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Estimation Deviations</h6>
                        <span className="text-gray-600">+14 hrs</span>
                    </div>
                    <DeviationTable
                        headers={['Task ID', 'Task Summary', 'Estimation', 'Actual', 'Deviation']}
                        data={estimationDeviations}
                    />
                </div>

                {/* Schedule Deviations */}
                <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Schedule Deviations</h6>
                        <span className="text-gray-600">+4d</span>
                    </div>
                    <DeviationTable
                        headers={['Task ID', 'Task Summary', 'Estimation', 'Actual', 'Deviation']}
                        data={scheduleDeviations}
                    />
                </div>
            </div>

            {/* Produced Bugs */}
            <div className="flex gap-6">
                <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Produced Bugs</h6>
                        <span className="text-gray-600">14 hrs</span>
                    </div>
                    <DeviationTable
                        headers={['Task ID', 'Task Summary', 'Estimation', 'Actual', 'Deviation']}
                        data={producedBugs}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserContentPage;