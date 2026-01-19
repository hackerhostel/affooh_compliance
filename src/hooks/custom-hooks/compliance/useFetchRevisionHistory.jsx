import axios from "axios";
import { useEffect, useState } from "react";

const useFetchRevisionHistory = (projectId, documentType = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRevisionHistory = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      let url = `/compliance/revision-history/${projectId}`;
      if (documentType) {
        url += `?documentType=${documentType}`;
      }
      const response = await axios.get(url);
      setData(response?.data?.body || []);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisionHistory();
  }, [projectId, documentType]);

  return { data, error, loading, refetch: fetchRevisionHistory };
};

export default useFetchRevisionHistory;
