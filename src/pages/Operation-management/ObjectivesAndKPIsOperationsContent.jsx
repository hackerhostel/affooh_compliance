import React, { useState, useEffect } from "react";
import ObjectivesAndKPIsContentPage from "../Objectives-KPIs/ObjectivesAndKPIsContent";
import { getObjectiveCollections } from "../../utils/objectiveApi";
import { useToasts } from "react-toast-notifications";

const ObjectivesAndKPIsOperationsContent = () => {
  const { addToast } = useToasts();
  const [collections, setCollections] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getObjectiveCollections();
        setCollections(data);
        if (data.length > 0) {
          setSelectedDocument(data[0]);
        }
      } catch (error) {
        addToast("Failed to fetch collections", { appearance: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  return (
    <div className="bg-dashboard-bgc min-h-screen">
      {collections.length > 1 && (
        <div className="flex items-center gap-3 px-4 pt-4">
          <span className="text-sm text-gray-600">Collection:</span>
          <select
            className="border border-gray-200 rounded px-3 py-1 text-sm"
            value={selectedDocument?.id || ""}
            onChange={(e) => {
              const doc = collections.find((c) => String(c.id) === e.target.value);
              setSelectedDocument(doc || null);
            }}
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <ObjectivesAndKPIsContentPage selectedDocument={selectedDocument} />
    </div>
  );
};

export default ObjectivesAndKPIsOperationsContent;
