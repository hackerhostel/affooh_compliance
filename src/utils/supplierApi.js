import axios from "axios";

// Supplier API
export const getSuppliers = async () => {
    const response = await axios.get("/suppliers");
    return response?.data || [];
};

export const createSupplier = async (payload) => {
    const response = await axios.post("/suppliers", payload);
    return response?.data;
};

export const getSupplierDetails = async (id) => {
    const response = await axios.get(`/suppliers/${id}`);
    return response?.data;
};

export const updateSupplier = async (id, payload) => {
    const response = await axios.put(`/suppliers/${id}`, payload);
    return response?.data;
};

export const deleteSupplier = async (id) => {
    const response = await axios.delete(`/suppliers/${id}`);
    return response?.data;
};

// Supplier Criteria Mapping API
export const assignCriteriaToSupplier = async (supplierId, criteriaId) => {
    const response = await axios.post(`/suppliers/${supplierId}/criteria`, { criteriaId });
    return response?.data;
};

export const unassignCriteriaFromSupplier = async (supplierId, criteriaId) => {
    const response = await axios.delete(`/suppliers/${supplierId}/criteria/${criteriaId}`);
    return response?.data;
};

// Master Supplier Criteria API
export const getSupplierCriteria = async () => {
    const response = await axios.get("/supplier-criteria");
    return response?.data || [];
};

export const createSupplierCriteria = async (payload) => {
    const response = await axios.post("/supplier-criteria", payload);
    return response?.data;
};

export const updateSupplierCriteria = async (id, payload) => {
    const response = await axios.put(`/supplier-criteria/${id}`, payload);
    return response?.data;
};

export const deleteSupplierCriteria = async (id) => {
    const response = await axios.delete(`/supplier-criteria/${id}`);
    return response?.data;
};
