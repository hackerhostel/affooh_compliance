import axios from 'axios';

const soaApi = {
    listSOA: async (orgId, filters = {}) => {
        return await axios.get(`/soa/list/${orgId}`, { params: filters });
    },
    createSOA: async (data) => {
        return await axios.post('/soa', data);
    },
    updateSOA: async (id, updates) => {
        return await axios.put(`/soa/${id}`, updates);
    },
    deleteSOA: async (id) => {
        return await axios.delete(`/soa/${id}`);
    },
};

export default soaApi;
