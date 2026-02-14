import axios from "axios";
import { useEffect, useState } from "react";

const useFetchPositions = (projectId) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setPositions([]);
      return;
    }

    const fetchPositions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/compliance/rasci/positions/${projectId}`
        );
        const list = response?.data?.body || [];
        setPositions(list.map((p) => ({ id: p, name: p })));
      } catch {
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [projectId]);

  return { positions, loading };
};

export default useFetchPositions;
