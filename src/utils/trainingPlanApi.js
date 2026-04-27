import axios from 'axios';

const trainingPlanApi = {
    createTrainingPlan: async (data) => {
        return await axios.post('/training-plans', data);
    },
    listTrainingPlans: async (orgId) => {
        return await axios.get(`/training-plans/list/${orgId}`);
    },
    updateTrainingPlan: async (id, updates) => {
        return await axios.put(`/training-plans/${id}`, updates);
    },
    deleteTrainingPlan: async (id) => {
        return await axios.delete(`/training-plans/${id}`);
    },
};

export default trainingPlanApi;
