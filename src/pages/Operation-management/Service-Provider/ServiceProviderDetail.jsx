import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useToasts } from "react-toast-notifications";
import {
  getServiceProviderDetails,
  updateServiceProvider,
  getServiceProviderCriteria,
  assignCriteriaToServiceProvider,
  unassignCriteriaFromServiceProvider,
} from "../../../utils/serviceProviderApi";
import ConfirmationDialog from "../../../components/ConfirmationDialog.jsx";

const ServiceProviderDetail = ({ serviceProviderId, onBack }) => {
  const { addToast } = useToasts();
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Criteria assignment state
  const [allCriteria, setAllCriteria] = useState([]);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState("");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [serviceProviderId]);

  const fetchData = async () => {
    if (!serviceProviderId) return;
    try {
      setLoading(true);
      const spData = await getServiceProviderDetails(serviceProviderId);
      setServiceProvider(spData);
      setFormData(spData || {});
    } catch (error) {
      addToast("Failed to fetch service provider details", { appearance: "error" });
    } finally {
      setLoading(false);
    }
    try {
      const criteriaData = await getServiceProviderCriteria();
      setAllCriteria(criteriaData);
    } catch (error) {
      addToast("Failed to fetch criteria list", { appearance: "error" });
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async () => {
    if (!formData.serviceProviderName || !formData.email) {
      addToast("Service Provider Name and Email are required", { appearance: "warning" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      addToast("Please enter a valid email address", { appearance: "warning" });
      return;
    }

    try {
      await updateServiceProvider(serviceProviderId, formData);
      addToast("Service provider details updated successfully", { appearance: "success" });
      setServiceProvider(formData);
      setIsEditing(false);
    } catch (error) {
      addToast("Failed to update service provider", { appearance: "error" });
    }
  };

  const handleAssignCriteria = async () => {
    if (!selectedCriteriaId) return;
    try {
      await assignCriteriaToServiceProvider(serviceProviderId, selectedCriteriaId);
      addToast("Criteria assigned successfully", { appearance: "success" });
      setSelectedCriteriaId("");
      fetchData(); // refresh to get updated assigned criteria
    } catch (error) {
      addToast("Failed to assign criteria", { appearance: "error" });
    }
  };

  const handleUnassignCriteria = async (criteriaId) => {
    try {
      await unassignCriteriaFromServiceProvider(serviceProviderId, criteriaId);
      addToast("Criteria removed successfully", { appearance: "success" });
      fetchData(); // refresh
    } catch (error) {
      addToast("Failed to remove criteria", { appearance: "error" });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Service Provider Details...</div>;
  }

  if (!serviceProvider) {
    return <div className="text-center py-10">Service provider not found.</div>;
  }

  const assignedCriteriaIds = serviceProvider.criteria?.map(c => c.id) || [];
  const availableCriteria = allCriteria.filter(c => !assignedCriteriaIds.includes(c.id));

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h4 className="text-xl font-bold">Service Provider Details: {serviceProvider.serviceProviderName}</h4>
      </div>

      {/* Section 1: Editable Fields */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-lg font-semibold">General Information</h5>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-pink text-white px-4 py-2 rounded text-sm hover:bg-pink-600"
            >
              Edit Details
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(serviceProvider);
                }}
                className="bg-gray-200 text-black px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="bg-primary-pink text-white px-4 py-2 rounded text-sm hover:bg-pink-600"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Service Provider Name</label>
            {isEditing ? (
              <input name="serviceProviderName" value={formData.serviceProviderName || ""} onChange={handleInputChange} className="border p-2 rounded" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.serviceProviderName}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Email</label>
            {isEditing ? (
              <input name="email" value={formData.email || ""} onChange={handleInputChange} className="border p-2 rounded" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Contact Person</label>
            {isEditing ? (
              <input name="contactPerson" value={formData.contactPerson || ""} onChange={handleInputChange} className="border p-2 rounded" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.contactPerson}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Contact Number</label>
            {isEditing ? (
              <input name="contactNumber" value={formData.contactNumber || ""} onChange={handleInputChange} className="border p-2 rounded" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.contactNumber}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Contract End Date</label>
            {isEditing ? (
              <input type="date" name="contractEndDate" value={formData.contractEndDate ? formData.contractEndDate.split('T')[0] : ""} onChange={handleInputChange} className="border p-2 rounded" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.contractEndDate ? serviceProvider.contractEndDate.split('T')[0] : "-"}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Description of Service</label>
            {isEditing ? (
              <textarea name="servicesProvided" value={formData.servicesProvided || ""} onChange={handleInputChange} className="border p-2 rounded" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.servicesProvided}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-sm font-medium text-gray-600">Address</label>
            {isEditing ? (
              <textarea name="address" value={formData.address || ""} onChange={handleInputChange} className="border p-2 rounded w-full" />
            ) : (
              <p className="p-2 bg-gray-50 rounded min-h-[40px]">{serviceProvider.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Criteria */}
      <div className="bg-white p-6 rounded shadow">
        <h5 className="text-lg font-semibold mb-4">Evaluation Criteria</h5>

        {/* Add Criteria Form */}
        <div className="flex gap-4 items-center mb-6 p-4 bg-gray-50 rounded border">
          <select
            className="flex-1 border p-2 rounded"
            value={selectedCriteriaId}
            onChange={(e) => setSelectedCriteriaId(e.target.value)}
          >
            <option value="">-- Select Criteria to Assign --</option>
            {availableCriteria.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleAssignCriteria}
            disabled={!selectedCriteriaId}
            className={`flex items-center gap-1 px-4 py-2 rounded text-white ${selectedCriteriaId ? "bg-primary-pink hover:bg-pink-600" : "bg-gray-400 cursor-not-allowed"}`}
          >
            <PlusIcon className="w-5 h-5" />
            Assign Criteria
          </button>
        </div>

        {/* List of Assigned Criteria */}
        {serviceProvider.criteria && serviceProvider.criteria.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {serviceProvider.criteria.map((c, index) => (
              <li key={c.id} className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium text-gray-700">{index + 1}. {c.name}</span>
                <button
                  onClick={() => handleUnassignCriteria(c.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove Criteria"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No criteria assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDetail;
