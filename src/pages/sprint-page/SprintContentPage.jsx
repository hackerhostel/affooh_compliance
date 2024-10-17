import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import SprintTable from "../../components/sprint-table/index.jsx";
import {selectSelectedSprint} from "../../state/slice/sprintSlice.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SprintHeader from "./SprintHeader.jsx";
import useFetchSprint from "../../hooks/custom-hooks/sprint/useFetchSprint.jsx";

const transformTask = (task) => {
  return {
    id: task.id,
    statusId: task.attributes.status?.id || 1,
    status: task.attributes.status?.value || 'To Do',
    title: task.name,
    taskCode: task.code,
    assigneeId: task?.assignee?.id ? task?.assignee?.id : 0,
    assignee: task?.assignee?.firstName ? `${task?.assignee?.firstName} ${task?.assignee?.lastName}` : 'Unassigned',
    epic: task.epicName || '',
    startDate: task.attributes.startDate?.value || null,
    endDate: task.attributes.endDate?.value || null,
    type: task.type,
    priority: task.attributes.priority?.value || '',
    parentTaskId: task?.parentTaskID || 0
  };
}

const SprintContentPage = () => {
  const selectedSprint = useSelector(selectSelectedSprint);

  const [taskList, setTaskList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [filters, setFilters] = useState({
    epic: false,
    completed: false,
    sub: false,
    assignee: -1,
    status: -1
  });
  const [sprint, setSprint] = useState(null)
  const [sprintId, setSprintId] = useState(0);
  const [isBacklog, setIsBacklog] = useState(false);
  const [assigneeList, setAssigneeList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const {error, loading, data: sprintResponse, refetch: refetchSprint} = useFetchSprint(sprintId)

  useEffect(() => {
    if (sprintResponse?.sprint) {
      setSprint(sprintResponse?.sprint)
      setIsBacklog(sprintResponse?.sprint?.name === 'BACKLOG')

      const taskListResponse = sprintResponse?.tasks
      const taskListConverted = []
      if (taskListResponse && Array.isArray(taskListResponse)) {
        const assignees = new Set();
        assignees.add(JSON.stringify({value: -1, label: "All Assignees"}))
        const status = new Set();
        status.add(JSON.stringify({value: -1, label: "All Status"}))

        taskListResponse.map(task => {
          taskListConverted.push(transformTask(task))
        })

        setTaskList(taskListConverted)

        for (const tlc of taskListConverted) {
          assignees.add(JSON.stringify({value: tlc.assigneeId, label: tlc.assignee}))
          status.add(JSON.stringify({value: tlc.statusId, label: tlc.status}))
        }
        setAssigneeList(Array.from(assignees).map(item => JSON.parse(item)))
        setStatusList(Array.from(status).map(item => JSON.parse(item)))
      }
    }
  }, [sprintResponse]);

  useEffect(() => {
    if (selectedSprint?.id) {
      setSprintId(selectedSprint?.id)
    }
  }, [selectedSprint]);

  useEffect(() => {
    if (taskList.length) {
      const epicFilteredTasks = taskList.filter(tl => filters.epic || tl?.type !== 'Epic');
      const completedFilteredTasks = epicFilteredTasks.filter(tl => (filters.completed || tl?.status !== 'Done'));
      const subFilteredTasks = completedFilteredTasks.filter(tl => (filters.sub || tl?.parentTaskId === 0));
      const assigneeFilteredTasks = subFilteredTasks.filter(tl => (filters?.assignee === -1 ? true : tl?.assigneeId === filters.assignee));
      const statusFilteredTasks = assigneeFilteredTasks.filter(tl => (filters?.status === -1 ? true : tl?.statusId === filters.status));

      setFilteredList(statusFilteredTasks)
    }
  }, [taskList, filters]);

  if (loading) return <div className="p-2"><SkeletonLoader/></div>;
  if (error) return <ErrorAlert message={error.message}/>;

  return (
    <>
      <SprintHeader sprint={sprint} isBacklog={isBacklog} refetchSprint={refetchSprint} filters={filters}
                    onFilterChange={setFilters} assignees={assigneeList} statusList={statusList}/>
      <SprintTable taskList={filteredList}/>
    </>
  );
}

export default SprintContentPage;