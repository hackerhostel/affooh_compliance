import axios from "axios";

export const createOrganizationalContext = async (payload) => {
  const response = await axios.post("/compliance/organizational-context", payload);
  return response?.data?.body;
};

export const updateOrganizationalContext = async (id, payload) => {
  const response = await axios.put(`/compliance/organizational-context/${id}`, payload);
  return response?.data?.body;
};

export const deleteOrganizationalContext = async (id) => {
  const response = await axios.delete(`/compliance/organizational-context/${id}`);
  return response?.data?.body;
};

export const createFunction = async (payload) => {
  const response = await axios.post("/compliance/functions", payload);
  return response?.data?.body;
};

export const updateFunction = async (id, payload) => {
  const response = await axios.put(`/compliance/functions/${id}`, payload);
  return response?.data?.body;
};

export const deleteFunction = async (id) => {
  const response = await axios.delete(`/compliance/functions/${id}`);
  return response?.data?.body;
};

export const createLaw = async (payload) => {
  const response = await axios.post("/compliance/laws", payload);
  return response?.data?.body;
};

export const updateLaw = async (id, payload) => {
  const response = await axios.put(`/compliance/laws/${id}`, payload);
  return response?.data?.body;
};

export const deleteLaw = async (id) => {
  const response = await axios.delete(`/compliance/laws/${id}`);
  return response?.data?.body;
};

export const createSwot = async (payload) => {
  const response = await axios.post("/compliance/swot", payload);
  return response?.data?.body;
};

export const updateSwot = async (id, payload) => {
  const response = await axios.put(`/compliance/swot/${id}`, payload);
  return response?.data?.body;
};

export const deleteSwot = async (id) => {
  const response = await axios.delete(`/compliance/swot/${id}`);
  return response?.data?.body;
};

export const createPest = async (payload) => {
  const response = await axios.post("/compliance/pest", payload);
  return response?.data?.body;
};

export const updatePest = async (id, payload) => {
  const response = await axios.put(`/compliance/pest/${id}`, payload);
  return response?.data?.body;
};

export const deletePest = async (id) => {
  const response = await axios.delete(`/compliance/pest/${id}`);
  return response?.data?.body;
};

export const createStakeholder = async (payload) => {
  const response = await axios.post("/compliance/stakeholders", payload);
  return response?.data?.body;
};

export const updateStakeholder = async (id, payload) => {
  const response = await axios.put(`/compliance/stakeholders/${id}`, payload);
  return response?.data?.body;
};

export const deleteStakeholder = async (id) => {
  const response = await axios.delete(`/compliance/stakeholders/${id}`);
  return response?.data?.body;
};

export const createCommunication = async (payload) => {
  const response = await axios.post("/compliance/communications", payload);
  return response?.data?.body;
};

export const updateCommunication = async (id, payload) => {
  const response = await axios.put(`/compliance/communications/${id}`, payload);
  return response?.data?.body;
};

export const deleteCommunication = async (id) => {
  const response = await axios.delete(`/compliance/communications/${id}`);
  return response?.data?.body;
};

export const createRevisionHistory = async (payload) => {
  const response = await axios.post("/compliance/revision-history", payload);
  return response?.data?.body;
};

export const createApproval = async (payload) => {
  const response = await axios.post("/compliance/approvals", payload);
  return response?.data?.body;
};

export const updateApproval = async (id, payload) => {
  const response = await axios.put(`/compliance/approvals/${id}`, payload);
  return response?.data?.body;
};

// Steering Committee
export const createSteeringCommittee = async (payload) => {
  const response = await axios.post(
    "/compliance/steering-committee",
    payload
  );
  return response?.data?.body;
};

export const updateSteeringCommittee = async (id, payload) => {
  const response = await axios.put(
    `/compliance/steering-committee/${id}`,
    payload
  );
  return response?.data?.body;
};

export const deleteSteeringCommittee = async (id) => {
  const response = await axios.delete(`/compliance/steering-committee/${id}`);
  return response?.data?.body;
};

export const getSteeringCommitteeRoles = async (projectId, search = "") => {
  const params = search ? { search } : {};
  const response = await axios.get(
    `/compliance/steering-committee/roles/${projectId}`,
    { params }
  );
  return response?.data?.body?.roles || [];
};

export const fetchRasciByProject = async (projectId) => {
  const response = await axios.get(`/compliance/rasci/project/${projectId}`);
  return response?.data?.body || [];
};

export const fetchPositionsByProject = async (projectId) => {
  const response = await axios.get(`/compliance/rasci/positions/${projectId}`);
  return response?.data?.body || [];
};

export const createRasci = async (payload) => {
  const response = await axios.post("/compliance/rasci", payload);
  return response?.data?.body;
};

export const updateRasci = async (id, payload) => {
  const response = await axios.put(`/compliance/rasci/${id}`, payload);
  return response?.data?.body;
};

export const deleteRasci = async (id) => {
  const response = await axios.delete(`/compliance/rasci/${id}`);
  return response?.data?.body;
};

export const getOrganizationRoles = async () => {
  const response = await axios.get("/organizations/roles");
  const responseData = response?.data;
  let data;
  if (responseData?.body) {
    data = responseData.body;
  } else if (Array.isArray(responseData)) {
    data = responseData;
  } else {
    data = responseData;
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    data = Object.values(data);
  }
  return data || [];
};

// Skill Inventory
export const fetchSkillInventory = async (organizationID) => {
  const response = await axios.get("/compliance/skill-inventory", {
    params: { organizationID },
  });
  return response?.data?.body || response?.data || [];
};


export const fetchSkillInventoryByUser = async (userId) => {
  const response = await axios.get(`/compliance/skill-inventory/user/${userId}`);
  return response?.data?.body || response?.data || { jobTitle: "", skills: [] };
};

export const createSkillInventoryEntry = async (payload) => {
  const response = await axios.post("/compliance/skill-inventory", payload);
  return response?.data?.body;
};

export const updateSkillInventoryEntry = async (id, payload) => {
  const response = await axios.put(`/compliance/skill-inventory/${id}`, payload);
  return response?.data?.body;
};

export const deleteSkillInventoryEntry = async (id) => {
  const response = await axios.delete(`/compliance/skill-inventory/${id}`);
  return response?.data?.body;
};

export const updateUserJobTitle = async (userId, jobTitle) => {
  const response = await axios.put(`/compliance/skill-inventory/user/${userId}/job-title`, { jobTitle });
  return response?.data?.body;
};

// Competency Matrix
export const fetchCompetencyMatrix = async () => {
  const response = await axios.get("/compliance/competency-matrix");
  return response?.data?.body || response?.data || [];
};

export const fetchCompetencyMatrixByUser = async (userId) => {
  const response = await axios.get(`/compliance/competency-matrix/user/${userId}`);
  return response?.data?.body || response?.data || null;
};

export const createCompetencyMatrix = async (payload) => {
  const response = await axios.post("/compliance/competency-matrix", payload);
  return response?.data?.body;
};

export const updateCompetencyMatrix = async (id, payload) => {
  const response = await axios.put(`/compliance/competency-matrix/${id}`, payload);
  return response?.data?.body;
};

// User Access Matrix
export const fetchUserAccess = async () => {
  const response = await axios.get("/compliance/user-access");
  return response?.data?.body || response?.data || [];
};

export const fetchUserAccessByUser = async (userId) => {
  const response = await axios.get(`/compliance/user-access/user/${userId}`);
  return response?.data?.body || response?.data || [];
};

export const upsertUserAccess = async (payload) => {
  const response = await axios.post("/compliance/user-access", payload);
  return response?.data?.body;
};

