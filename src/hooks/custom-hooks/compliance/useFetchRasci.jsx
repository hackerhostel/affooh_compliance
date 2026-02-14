import axios from "axios";
import { useEffect, useState } from "react";

const useFetchRasci = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRasci = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/compliance/rasci/project/${projectId}`);
      setData(response?.data?.body || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRasci();
  }, [projectId]);

  return { data, error, loading, refetch: fetchRasci };
};

export default useFetchRasci;
