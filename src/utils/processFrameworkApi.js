import axios from "axios";

export const PROCESS_FRAMEWORK_TYPES = [
  { value: "POLICY", label: "Policy" },
  { value: "DOCUMENT", label: "Documents" },
  { value: "PROCESS", label: "Process" },
  { value: "STANDARD", label: "Standard" },
  { value: "TEMPLATE", label: "Template" },
];

export const getProcessFrameworkDocuments = async (organizationID, type) => {
  const response = await axios.get(`/process-framework/documents/${organizationID}`, {
    params: { type },
  });
  return response?.data?.body || [];
};

export const getProcessFrameworkDocument = async (documentID) => {
  const response = await axios.get(`/process-framework/document/${documentID}`);
  return response?.data?.body || null;
};

export const createProcessFrameworkDocument = async (payload) => {
  const response = await axios.post("/process-framework/document", payload);
  return response?.data?.body;
};

export const updateProcessFrameworkDocument = async (documentID, payload) => {
  const response = await axios.put(`/process-framework/document/${documentID}`, payload);
  return response?.data?.body;
};

export const deleteProcessFrameworkDocument = async (documentID) => {
  const response = await axios.delete(`/process-framework/document/${documentID}`);
  return response?.data?.body;
};

export const createProcessFrameworkSection = async (payload) => {
  const response = await axios.post("/process-framework/section", payload);
  return response?.data?.body;
};

export const updateProcessFrameworkSection = async (sectionID, payload) => {
  const response = await axios.put(`/process-framework/section/${sectionID}`, payload);
  return response?.data?.body;
};

export const deleteProcessFrameworkSection = async (sectionID) => {
  const response = await axios.delete(`/process-framework/section/${sectionID}`);
  return response?.data?.body;
};

export const getProcessFrameworkControlCategories = async () => {
  const response = await axios.get("/process-framework/control-categories");
  return response?.data?.body || [];
};

export const getProcessFrameworkControls = async (standardType) => {
  const response = await axios.get("/process-framework/controls", {
    params: standardType ? { standardType } : {},
  });
  return response?.data?.body || [];
};
