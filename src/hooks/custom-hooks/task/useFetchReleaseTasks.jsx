import axios from "axios";
import { useEffect, useState } from "react";

const useFetchReleaseTasks = (releaseId) => {
  const [data, setData] = useState({ tasks: [] });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const transformTask = (task) => {
    return {
      key: "",
      code: task.code || "N/A",
      title: task.name || "N/A",
      priority: task.attributes?.priority?.value || "N/A",
      status: task.attributes?.status?.value || "N/A",
      startDate: task.attributes?.startDate?.value || "N/A",
      endDate: task.attributes?.endDate?.value || "N/A",
      type: task.taskType?.name || "N/A",
      assigneeId: task?.assignee?.id ? task?.assignee?.id : 0,
      assignee: task?.assignee?.firstName
        ? `${task?.assignee?.firstName} ${task?.assignee?.lastName}`
        : "Unassigned",
      priorityId: task.attributes?.priority?.id || 0,
      statusId: task.attributes?.status?.id || 0,
    };
  };

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

  const applyFilters = () => {
    if (!data?.tasks || data.tasks.length === 0) {
      setFilteredTaskList([]);
      return;
    }

    let filtered = data.tasks.map((task, index) => ({
      ...transformTask(task),
      key: `${(index + 1).toString().padStart(3, "0")}`,
    }));

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (assigneeFilter !== "") {
      filtered = filtered.filter(
        (task) =>
          assigneeFilter === "" || task.assigneeId === Number(assigneeFilter)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (task) =>
          task.status &&
          task.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter(
        (task) =>
          task.priority &&
          task.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter((task) => {
        if (!task.startDate || task.startDate === "N/A") return false;
        const taskStartDate = new Date(task.startDate);
        if (isNaN(taskStartDate.getTime())) return false;
        return (
          taskStartDate.getDate() === startDateFilter.getDate() &&
          taskStartDate.getMonth() === startDateFilter.getMonth() &&
          taskStartDate.getFullYear() === startDateFilter.getFullYear()
        );
      });
    }

    if (endDateFilter) {
      filtered = filtered.filter((task) => {
        if (!task.endDate || task.endDate === "N/A") return false;
        const taskEndDate = new Date(task.endDate);
        if (isNaN(taskEndDate.getTime())) return false;
        return (
          taskEndDate.getDate() === endDateFilter.getDate() &&
          taskEndDate.getMonth() === endDateFilter.getMonth() &&
          taskEndDate.getFullYear() === endDateFilter.getFullYear()
        );
      });
    }

    filtered = filtered.map((task, index) => ({
      ...task,
      key: `${(index + 1).toString().padStart(3, "0")}`,
    }));

    setFilteredTaskList(filtered);
  };

  useEffect(() => {
    if (releaseId) {
      fetchReleaseTasks();
    }
  }, [releaseId]);

  useEffect(() => {
    applyFilters();
  }, [
    assigneeFilter,
    statusFilter,
    priorityFilter,
    startDateFilter,
    endDateFilter,
    data,
    searchTerm,
  ]);

  const resetFilters = () => {
    setAssigneeFilter("");
    setStatusFilter("");
    setPriorityFilter("");
    setStartDateFilter(null);
    setEndDateFilter(null);
    setSearchTerm("");
  };

  return {
    data,
    error,
    loading,
    refetch: fetchReleaseTasks,
    filteredTaskList,
    setAssigneeFilter,
    setStatusFilter,
    setPriorityFilter,
    setStartDateFilter,
    setEndDateFilter,
    setSearchTerm,
    resetFilters,
    searchTerm,
    assigneeFilter,
    statusFilter,
    priorityFilter,
    startDateFilter,
    endDateFilter,
  };
};

export default useFetchReleaseTasks;
