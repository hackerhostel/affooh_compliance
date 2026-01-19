import axios from "axios";
import { useEffect, useState } from "react";

const useFetchFunctions = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFunctions = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/compliance/functions/${projectId}`);
      setData(response?.data?.body || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, [projectId]);

  return { data, error, loading, refetch: fetchFunctions };
};

export default useFetchFunctions;
