import axios from 'axios';

export const reviewAuditApi = {
    createReviewAudit: async (orgId, data) => {
        return await axios.post(`/reviews-audits/organizations/${orgId}`, data);
    },
    getReviewAudits: async (orgId, filters = {}) => {
        return await axios.get(`/reviews-audits/organizations/${orgId}`, { params: filters });
    },
    getReviewAuditDetail: async (reviewAuditId) => {
        return await axios.get(`/reviews-audits/${reviewAuditId}`);
    },
    getAuditControls: async (reviewAuditId) => {
        return await axios.get(`/reviews-audits/${reviewAuditId}/controls`);
    },
    updateControlEvaluation: async (evaluationId, data) => {
        // We pass standardControlID and reviewAuditID in data
        return await axios.put(`/reviews-audits/evaluations/${evaluationId}`, data);
    },
};
