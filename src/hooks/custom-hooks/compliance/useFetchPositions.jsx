import { useEffect, useState } from "react";
import { getOrganizationRoles } from "../../../utils/complianceApi";

const useFetchPositions = (projectId) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      try {
        const roles = await getOrganizationRoles();
        setPositions(roles.map((r) => ({ id: r.name, name: r.name })));
      } catch (error) {
        console.error("Failed to fetch organization roles:", error);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return { positions, loading };
};

export default useFetchPositions;

