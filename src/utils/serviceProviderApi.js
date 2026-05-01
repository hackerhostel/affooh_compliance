import axios from "axios";

// Service Provider API
export const getServiceProviders = async () => {
    const response = await axios.get("/service-providers");
    return response?.data || [];
};

export const createServiceProvider = async (payload) => {
    const response = await axios.post("/service-providers", payload);
    return response?.data;
};

export const getServiceProviderDetails = async (id) => {
    const response = await axios.get(`/service-providers/${id}`);
    return response?.data;
};

export const updateServiceProvider = async (id, payload) => {
    const response = await axios.put(`/service-providers/${id}`, payload);
    return response?.data;
};

export const deleteServiceProvider = async (id) => {
    const response = await axios.delete(`/service-providers/${id}`);
    return response?.data;
};

// Service Provider Criteria Mapping API
export const assignCriteriaToServiceProvider = async (serviceProviderId, criteriaId) => {
    const response = await axios.post(`/service-providers/${serviceProviderId}/criteria`, { criteriaId });
    return response?.data;
};

export const unassignCriteriaFromServiceProvider = async (serviceProviderId, criteriaId) => {
    const response = await axios.delete(`/service-providers/${serviceProviderId}/criteria/${criteriaId}`);
    return response?.data;
};

// Master Service Provider Criteria API
export const getServiceProviderCriteria = async () => {
    const response = await axios.get("/service-provider-criteria");
    return response?.data || [];
};

export const createServiceProviderCriteria = async (payload) => {
    const response = await axios.post("/service-provider-criteria", payload);
    return response?.data;
};

export const updateServiceProviderCriteria = async (id, payload) => {
    const response = await axios.put(`/service-provider-criteria/${id}`, payload);
    return response?.data;
};

export const deleteServiceProviderCriteria = async (id) => {
    const response = await axios.delete(`/service-provider-criteria/${id}`);
    return response?.data;
};

// Service Provider Evaluation API
export const getServiceProviderEvaluations = async (serviceProviderId) => {
    const response = await axios.get(`/service-providers/${serviceProviderId}/evaluations`);
    return response?.data || [];
};

export const createServiceProviderEvaluation = async (serviceProviderId, payload) => {
    const response = await axios.post(`/service-providers/${serviceProviderId}/evaluations`, payload);
    return response?.data;
};

export const updateServiceProviderEvaluation = async (evaluationId, payload) => {
    const response = await axios.put(`/service-provider-evaluations/${evaluationId}`, payload);
    return response?.data;
};

export const deleteServiceProviderEvaluation = async (evaluationId) => {
    const response = await axios.delete(`/service-provider-evaluations/${evaluationId}`);
    return response?.data;
};

