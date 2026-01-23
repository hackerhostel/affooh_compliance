import axios from "axios";
import { useEffect, useState } from "react";

const useFetchSwot = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSwot = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/compliance/swot/${projectId}`);
      setData(response?.data?.body || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwot();
  }, [projectId]);

  return { data, error, loading, refetch: fetchSwot };
};

export default useFetchSwot;
