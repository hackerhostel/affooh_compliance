import axios from 'axios';

const riskApi = {
    createRisk: async (riskData) => {
        return await axios.post('/risk', riskData);
    },
    listRisks: async (orgId, filters = {}) => {
        return await axios.get(`/risk/list/${orgId}`, { params: filters });
    },
    getStats: async (orgId) => {
        return await axios.get(`/risk/stats/${orgId}`);
    },
    updateRisk: async (id, updates) => {
        return await axios.put(`/risk/${id}`, updates);
    },
    deleteRisk: async (id) => {
        return await axios.delete(`/risk/${id}`);
    },
    listReassessments: async (riskId) => {
        return await axios.get(`/risk/${riskId}/reassessments`);
    },
    createReassessment: async (data) => {
        return await axios.post('/risk/reassessment', data);
    },
    updateReassessment: async (id, data) => {
        return await axios.put(`/risk/reassessment/${id}`, data);
    },
    deleteReassessment: async (reassessmentId) => {
        return await axios.delete(`/risk/reassessment/${reassessmentId}`);
    },
};

export default riskApi;
