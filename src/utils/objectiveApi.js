import axios from "axios";

// Objective Collections API
export const getObjectiveCollections = async () => {
    const response = await axios.get("/objective-collections");
    return response?.data || [];
};

export const createObjectiveCollection = async (payload) => {
    const response = await axios.post("/objective-collections", payload);
    return response?.data;
};

export const getCollectionDetails = async (id) => {
    const response = await axios.get(`/objective-collections/${id}`);
    return response?.data;
};

export const deleteObjectiveCollection = async (id) => {
    const response = await axios.delete(`/objective-collections/${id}`);
    return response?.data;
};

// Objectives API
export const getObjectives = async (collectionId) => {
    const query = collectionId ? `?collectionId=${collectionId}` : "";
    const response = await axios.get(`/objectives${query}`);
    return response?.data || [];
};

export const createObjective = async (payload) => {
    const response = await axios.post("/objectives", payload);
    return response?.data;
};

export const getObjectiveDetails = async (id) => {
    const response = await axios.get(`/objectives/${id}`);
    return response?.data;
};

export const updateObjective = async (id, payload) => {
    const response = await axios.put(`/objectives/${id}`, payload);
    return response?.data;
};

export const deleteObjective = async (id) => {
    const response = await axios.delete(`/objectives/${id}`);
    return response?.data;
};

// KPIs API
export const getObjectiveKPIs = async (objectiveId) => {
    const response = await axios.get(`/objectives/${objectiveId}/kpis`);
    return response?.data || [];
};

export const createObjectiveKPI = async (objectiveId, payload) => {
    const response = await axios.post(`/objectives/${objectiveId}/kpis`, payload);
    return response?.data;
};

export const updateObjectiveKPI = async (objectiveId, kpiId, payload) => {
    const response = await axios.put(`/objectives/${objectiveId}/kpis/${kpiId}`, payload);
    return response?.data;
};

export const deleteObjectiveKPI = async (objectiveId, kpiId) => {
    const response = await axios.delete(`/objectives/${objectiveId}/kpis/${kpiId}`);
    return response?.data;
};

// Tasks Linking API
export const linkObjectiveTask = async (objectiveId, taskId) => {
    const response = await axios.post(`/objectives/${objectiveId}/tasks`, { taskId });
    return response?.data;
};

export const getLinkedObjectiveTasks = async (objectiveId) => {
    const response = await axios.get(`/objectives/${objectiveId}/tasks`);
    return response?.data || [];
};

export const unlinkObjectiveTask = async (objectiveId, taskId) => {
    const response = await axios.delete(`/objectives/${objectiveId}/tasks/${taskId}`);
    return response?.data;
};

export const getAvailableTasks = async (projectId) => {
    const query = projectId ? `?projectId=${projectId}` : "";
    const response = await axios.get(`/available-tasks${query}`);
    return response?.data || [];
};
