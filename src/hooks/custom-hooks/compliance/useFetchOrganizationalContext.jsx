import axios from "axios";
import { useEffect, useState } from "react";

const useFetchOrganizationalContext = (projectId, documentType = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchContext = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      let url = `/compliance/organizational-context/${projectId}`;
      if (documentType) {
        url += `?documentType=${documentType}`;
      }
      const response = await axios.get(url);
      setData(response?.data?.body || null);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContext();
  }, [projectId, documentType]);

  return { data, error, loading, refetch: fetchContext };
};

export default useFetchOrganizationalContext;
