import axios from 'axios';

const incidentApi = {
    createIncident: async (data) => axios.post('/incident', data),
    listIncidents: async (orgId, filters = {}) => axios.get(`/incident/list/${orgId}`, { params: filters }),
    getStats: async (orgId) => axios.get(`/incident/stats/${orgId}`),
    updateIncident: async (id, data) => axios.put(`/incident/${id}`, data),
    deleteIncident: async (id) => axios.delete(`/incident/${id}`),
};

export default incidentApi;
