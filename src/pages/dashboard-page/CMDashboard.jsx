import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../state/slice/authSlice.js";
import { selectOrganizationUsers, doGetOrganizationUsers } from "../../state/slice/appSlice.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import riskApi from "../../utils/riskApi.js";
import incidentApi from "../../utils/incidentApi.js";
import { getObjectiveCollections, getObjectives, getObjectiveKPIs, getObjectiveMasterData } from "../../utils/objectiveApi.js";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const CMDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const organizationID = user?.organization?.id;
    const organizationUsers = useSelector(selectOrganizationUsers);
    const selectedProject = useSelector(selectSelectedProject);

    const [risks, setRisks] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [kpiRows, setKpiRows] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [riskFilters, setRiskFilters] = useState({ status: "", owner: "" });
    const [incidentFilters, setIncidentFilters] = useState({ status: "", owner: "" });
    const [kpiFilters, setKpiFilters] = useState({ year: "", department: "" });

    useEffect(() => {
        if (!organizationUsers) {
            dispatch(doGetOrganizationUsers());
        }
        if (organizationID) {
            fetchDashboardData();
        }
    }, [organizationID, dispatch, organizationUsers]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch Risks
            const risksRes = await riskApi.listRisks(organizationID);
            const allRisks = (risksRes.data.body || []).map((r, i) => ({
                ...r,
                displayId: String(i + 1).padStart(2, '0')
            }));
            
            // Filter risks by due date in current month
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const currentMonthRisks = allRisks.filter(risk => {
                if (!risk.dueDate) return false;
                const dueDate = new Date(risk.dueDate);
                return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
            });
            setRisks(currentMonthRisks);

            // Fetch Incidents
            const incidentsRes = await incidentApi.listIncidents(organizationID);
            const allIncidents = incidentsRes.data.body || [];
            // Sort by date (latest first) and take top 10
            const sortedIncidents = allIncidents
                .sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate))
                .slice(0, 10)
                .map((inc, i) => ({
                    ...inc,
                    displayId: String(i + 1).padStart(2, '0')
                }));
            setIncidents(sortedIncidents);

            // Fetch Master Data for Departments
            if (selectedProject?.id) {
                const masterData = await getObjectiveMasterData(selectedProject.id);
                if (masterData.departments) {
                    setDepartments(masterData.departments);
                }
            }

            // Fetch KPIs
            // 1. Get Objective Collections
            const collections = await getObjectiveCollections();
            
            if (collections.length > 0) {
                // For each collection, get objectives
                const objectivePromises = collections.map(col => getObjectives(col.id));
                const objectiveResponses = await Promise.all(objectivePromises);
                const allObjectives = objectiveResponses.flat();

                // For each objective, get its tracking records (KPIs)
                const kpiPromises = allObjectives.map(obj => getObjectiveKPIs(obj.id));
                const kpiResponses = await Promise.all(kpiPromises);
                
                const kpiData = allObjectives.map((obj, idx) => {
                    const trackings = kpiResponses[idx] || [];
                    // Get latest tracking record
                    const latestTracking = trackings.sort((a, b) => new Date(b.trackDate) - new Date(a.trackDate))[0] || {};
                    
                    return {
                        id: obj.id,
                        year: obj.year || "-",
                        department: obj.departmentName || obj.department || "-",
                        type: obj.typeName || obj.type || "-",
                        objective: obj.objectiveText || obj.objective || "-",
                        kpi: obj.kpi || "-",
                        initialStatus: obj.initialStatus || "-",
                        target: latestTracking.target || obj.target || "-",
                        monitoringFrequency: obj.frequencyName || obj.monitoringFrequency || "-",
                        howToMeasure: obj.howToMeasure || "-"
                    };
                }).map((k, i) => ({
                    ...k,
                    displayId: String(i + 1).padStart(2, '0')
                }));

                setKpiRows(kpiData);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    };

    const StatusBadge = ({ status }) => {
        if (!status) return "-";
        const styles = {
            "To Do": "bg-red-100 text-red-600 border-red-200",
            "In Progress": "bg-yellow-100 text-yellow-600 border-yellow-200",
            "Done": "bg-green-100 text-green-600 border-green-200",
            "High": "bg-red-100 text-red-600 border-red-200",
            "Medium": "bg-yellow-100 text-yellow-600 border-yellow-200",
            "Low": "bg-green-100 text-green-600 border-green-200",
            "Closed": "bg-green-100 text-green-600 border-green-200",
        };
        const style = styles[status] || "bg-gray-100 text-gray-600 border-gray-200";
        const dotColor = style.split(' ')[1].replace('text-', 'bg-');
        
        return (
            <span className={`px-3 py-1 rounded-md text-xs font-medium border ${style} flex items-center gap-1.5 w-fit`}>
                <span className={`w-1 h-3 rounded-full ${dotColor}`}></span>
                {status}
            </span>
        );
    };

    const userOptions = organizationUsers?.map(u => ({
        value: String(u.id),
        label: `${u.firstName} ${u.lastName || ""}`.trim()
    })) || [];

    const filteredRisks = risks.filter(r => {
        if (riskFilters.status && r.status !== riskFilters.status) return false;
        if (riskFilters.owner && String(r.owner) !== riskFilters.owner) return false;
        return true;
    });

    const filteredIncidents = incidents.filter(i => {
        if (incidentFilters.status && i.status !== incidentFilters.status) return false;
        const ownerId = i.ownerId || i.owner; // Adjust based on actual API
        if (incidentFilters.owner && String(ownerId) !== incidentFilters.owner) return false;
        return true;
    });

    const filteredKpis = kpiRows.filter(k => {
        if (kpiFilters.year && String(k.year) !== String(kpiFilters.year)) return false;
        if (kpiFilters.department && String(k.department) !== kpiFilters.department && String(k.departmentID) !== kpiFilters.department) return false;
        return true;
    });

    return (
        <div className="bg-[#F8F9FD] min-h-screen p-8 space-y-12">
            <div className="flex items-center text-xs text-gray-400 gap-2 mb-4">
                <span>Dashboard</span>
                <span>&gt;</span>
                <span className="font-bold text-gray-900">Project</span>
            </div>

            {/* RISKS Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="text-xl font-medium text-gray-700">RISKs</h5>
                    <div className="flex gap-4">
                        <select 
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                            value={riskFilters.status}
                            onChange={(e) => setRiskFilters({...riskFilters, status: e.target.value})}
                        >
                            <option value="">Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                        <select 
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                            value={riskFilters.owner}
                            onChange={(e) => setRiskFilters({...riskFilters, owner: e.target.value})}
                        >
                            <option value="">Owner</option>
                            {userOptions.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-100 text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4 font-medium">Risk ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Current Gaps</th>
                                <th className="px-6 py-4 font-medium">owner</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400 animate-pulse">Loading risks...</td></tr>
                            ) : filteredRisks.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No risks found for this filter</td></tr>
                            ) : filteredRisks.map((risk) => (
                                <tr key={risk.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-6 text-gray-500 font-medium">{risk.displayId}</td>
                                    <td className="px-6 py-6 text-gray-600">{formatDate(risk.createdAt)}</td>
                                    <td className="px-6 py-6"><StatusBadge status={risk.status} /></td>
                                    <td className="px-6 py-6 text-gray-600 max-w-xs truncate">{risk.currentGaps || "-"}</td>
                                    <td className="px-6 py-6 text-gray-600">
                                        {userOptions.find(u => u.value === String(risk.owner))?.label || risk.owner || "-"}
                                    </td>
                                    <td className="px-6 py-6 text-gray-600">{formatDate(risk.dueDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 flex items-center justify-end gap-4 border-t border-gray-50 text-xs text-gray-400">
                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeftIcon className="w-4 h-4" /></button>
                        <span className="text-pink-500 font-bold">01</span>
                        <span className="hover:text-gray-600 cursor-pointer">02</span>
                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronRightIcon className="w-4 h-4" /></button>
                    </div>
                </div>
            </section>

            {/* Incidents Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="text-xl font-medium text-gray-700">Incidents</h5>
                    <div className="flex gap-4">
                        <select 
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                            value={incidentFilters.status}
                            onChange={(e) => setIncidentFilters({...incidentFilters, status: e.target.value})}
                        >
                            <option value="">Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <select 
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                            value={incidentFilters.owner}
                            onChange={(e) => setIncidentFilters({...incidentFilters, owner: e.target.value})}
                        >
                            <option value="">Owner</option>
                            {userOptions.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-100 text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Severity</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">owner</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400 animate-pulse">Loading incidents...</td></tr>
                            ) : filteredIncidents.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No incidents found</td></tr>
                            ) : filteredIncidents.map((inc) => (
                                <tr key={inc.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-6 text-gray-500 font-medium">{inc.displayId}</td>
                                    <td className="px-6 py-6 text-gray-600">{formatDate(inc.incidentDate)}</td>
                                    <td className="px-6 py-6"><StatusBadge status={inc.severity || "Medium"} /></td>
                                    <td className="px-6 py-6 text-gray-600 max-w-xs truncate">{inc.natureOfIncidents || inc.description || "-"}</td>
                                    <td className="px-6 py-6 text-gray-600">
                                        {inc.ownerFirstName ? `${inc.ownerFirstName} ${inc.ownerLastName || ""}`.trim() : 
                                         userOptions.find(u => u.value === String(inc.owner))?.label || inc.owner || "-"}
                                    </td>
                                    <td className="px-6 py-6"><StatusBadge status={inc.status || "To Do"} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 flex items-center justify-end gap-4 border-t border-gray-50 text-xs text-gray-400">
                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeftIcon className="w-4 h-4" /></button>
                        <span className="text-pink-500 font-bold">01</span>
                        <span className="hover:text-gray-600 cursor-pointer">02</span>
                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronRightIcon className="w-4 h-4" /></button>
                    </div>
                </div>
            </section>

            {/* KPI Tracking Section */}
            <section className="space-y-4 pb-12">
                <div className="flex items-center justify-between">
                    <h5 className="text-xl font-medium text-gray-700">KPI Tracking</h5>
                    <div className="flex gap-4">
                        <select 
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                            value={kpiFilters.year}
                            onChange={(e) => setKpiFilters({...kpiFilters, year: e.target.value})}
                        >
                            <option value="">Year</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                        <select 
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                            value={kpiFilters.department}
                            onChange={(e) => setKpiFilters({...kpiFilters, department: e.target.value})}
                        >
                            <option value="">Department</option>
                            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-100 text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Year</th>
                                <th className="px-6 py-4 font-medium">Department</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Objective</th>
                                <th className="px-6 py-4 font-medium">KPI</th>
                                <th className="px-6 py-4 font-medium">Initial Status</th>
                                <th className="px-6 py-4 font-medium">Target</th>
                                <th className="px-6 py-4 font-medium">Monitoring Frequency</th>
                                <th className="px-6 py-4 font-medium">How to Measure</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="10" className="px-6 py-8 text-center text-gray-400 animate-pulse">Loading KPIs...</td></tr>
                            ) : filteredKpis.length === 0 ? (
                                <tr><td colSpan="10" className="px-6 py-8 text-center text-gray-400">No KPI data available</td></tr>
                            ) : filteredKpis.map((kpi) => (
                                <tr key={kpi.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-6 text-gray-500 font-medium">{kpi.displayId}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.year}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.department}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.type}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.objective}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.kpi}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.initialStatus}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.target}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.monitoringFrequency}</td>
                                    <td className="px-6 py-6 text-gray-600">{kpi.howToMeasure}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CMDashboard;
