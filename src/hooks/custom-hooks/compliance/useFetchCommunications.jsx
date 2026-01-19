import axios from "axios";
import { useEffect, useState } from "react";

const useFetchCommunications = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCommunications = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/compliance/communications/${projectId}`);
      setData(response?.data?.body || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [projectId]);

  return { data, error, loading, refetch: fetchCommunications };
};

export default useFetchCommunications;
