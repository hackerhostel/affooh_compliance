import axios from 'axios';

export const reviewAuditApi = {
    createReviewAudit: async (orgId, data) => {
        return await axios.post(`/reviews-audits`, { ...data, organizationID: orgId });
    },
    getReviewAudits: async (orgId, filters = {}) => {
        return await axios.get(`/reviews-audits/organizations/${orgId}`, { params: filters });
    },
    getReviewAuditDetail: async (reviewAuditId) => {
        return await axios.get(`/reviews-audits/${reviewAuditId}`);
    },
    getAuditControls: async (reviewAuditId, page = 1, limit = 10) => {
        return await axios.get(`/reviews-audits/${reviewAuditId}/controls`, { params: { page, limit } });
    },
    updateControlEvaluation: async (evaluationId, data) => {
        // We pass standardControlID and reviewAuditID in data
        return await axios.put(`/reviews-audits/evaluations/${evaluationId}`, data);
    },
    getNonConformances: async (orgId, page = 1, limit = 10) => {
        return await axios.get(`/reviews-audits/organizations/${orgId}/non-conformances`, { params: { page, limit } });
    },
    getNonConformanceDetail: async (evaluationId) => {
        return await axios.get(`/reviews-audits/non-conformances/evaluations/${evaluationId}`);
    },
    updateNonConformance: async (evaluationId, data) => {
        return await axios.put(`/reviews-audits/non-conformances/evaluations/${evaluationId}`, data);
    },
    linkTaskToEvaluation: async (evaluationId, data) => {
        return await axios.post(`/reviews-audits/evaluations/${evaluationId}/tasks`, data);
    },
    unlinkTaskFromEvaluation: async (evaluationId, taskId) => {
        return await axios.delete(`/reviews-audits/evaluations/${evaluationId}/tasks/${taskId}`);
    },
    updateReviewAudit: async (id, data) => {
        return await axios.put(`/reviews-audits/${id}`, data);
    }
};
