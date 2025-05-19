import axios from "axios";
import { useEffect, useState } from "react";

const useFetchReleaseTasks = (releaseId) => {
  const [data, setData] = useState({ tasks: [] });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReleaseTasks = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/releases/${releaseId}/tasks`);
      const releaseTasksResponse = response?.data;

      if (releaseTasksResponse?.tasks) {
        setLoading(false);
        setData(releaseTasksResponse);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (releaseId) {
      fetchReleaseTasks();
    }
  }, [releaseId]);

  return { data, error, loading, refetch: fetchReleaseTasks };
};

export default useFetchReleaseTasks;
