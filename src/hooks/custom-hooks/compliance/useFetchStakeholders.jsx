import axios from "axios";
import { useEffect, useState } from "react";

const useFetchStakeholders = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStakeholders = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/compliance/stakeholders/${projectId}`);
      setData(response?.data?.body || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakeholders();
  }, [projectId]);

  return { data, error, loading, refetch: fetchStakeholders };
};

export default useFetchStakeholders;
