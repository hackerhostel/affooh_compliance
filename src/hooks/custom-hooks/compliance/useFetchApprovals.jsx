import axios from "axios";
import { useEffect, useState } from "react";

const useFetchApprovals = (projectId, documentType = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchApprovals = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      let url = `/compliance/approvals/${projectId}`;
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
    fetchApprovals();
  }, [projectId, documentType]);

  return { data, error, loading, refetch: fetchApprovals };
};

export default useFetchApprovals;
