import axios from "axios";
import { useEffect, useState } from "react";

const useFetchPest = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPest = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/compliance/pest/${projectId}`);
      setData(response?.data?.body || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPest();
  }, [projectId]);

  return { data, error, loading, refetch: fetchPest };
};

export default useFetchPest;
