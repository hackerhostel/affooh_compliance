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
    status: task.attributes.status?.value || '',
    title: task.name,
    taskCode: task.code,
    assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}`.trim() : '',
    epic: task.epicName || '',
    startDate: task.attributes.startDate?.value || null,
    endDate: task.attributes.endDate?.value || null,
    type: task.type,
    priority: task.attributes.priority?.value || ''
  };
}

const SprintContentPage = () => {
  const selectedSprint = useSelector(selectSelectedSprint);

  const [taskList, setTaskList] = useState([])
  const [sprint, setSprint] = useState(null)
  const [sprintId, setSprintId] = useState(0);
  const [isBacklog, setIsBacklog] = useState(false);

  const {error, loading, data: sprintResponse, refetch: refetchSprint} = useFetchSprint(sprintId)

  useEffect(() => {
    if (sprintResponse?.sprint) {
      setSprint(sprintResponse?.sprint)
      setIsBacklog(sprintResponse?.sprint?.name === 'BACKLOG')

      const taskListResponse = sprintResponse?.tasks
      const taskListConverted = []
      if (taskListResponse && Array.isArray(taskListResponse)) {
        taskListResponse.map(task => {
          taskListConverted.push(transformTask(task))
        })
        setTaskList(taskListConverted)
      }
    }
  }, [sprintResponse]);

  useEffect(() => {
    if (selectedSprint?.id) {
      setSprintId(selectedSprint?.id)
    }
  }, [selectedSprint]);

  if (loading) return <div className="p-2"><SkeletonLoader/></div>;
  if (error) return <ErrorAlert message={error.message}/>;

  return (
    <>
      <SprintHeader sprint={sprint} isBacklog={isBacklog} refetchSprint={refetchSprint}/>
      <SprintTable taskList={taskList}/>
    </>
  );
}

export default SprintContentPage;