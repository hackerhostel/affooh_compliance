import axios from "axios";
import { useEffect, useState } from "react";

const useFetchSteeringCommittees = (projectId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSteeringCommittees = async () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        `/compliance/steering-committee/${projectId}`
      );
      setData(response?.data?.body || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteeringCommittees();
  }, [projectId]);

  return { data, error, loading, refetch: fetchSteeringCommittees };
};

export default useFetchSteeringCommittees;
