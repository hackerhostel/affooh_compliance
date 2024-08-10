import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import SprintTable from "../../components/sprint-table/index.jsx";
import {selectSelectedSprint, setSelectedSprint} from "../../state/slice/sprintSlice.js";
import useGraphQL from "../../hooks/useGraphQL.jsx";
import {fetchSprintDetails} from "../../graphql/sprintQueries/queries.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SprintHeader from "./SprintHeader.jsx";

function transformTask(task) {
  return {
    id: task.id,
    status: task.attributes.status?.value || '',
    title: task.name,
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

  const {makeRequest, loading, error} = useGraphQL();
  const [taskList, setTaskList] = useState([])
  const [sprintDetails, setSprintDetails] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const query = fetchSprintDetails;
      const variables = {sprintID: selectedSprint?.id}; // not mandatory
      const data = await makeRequest(query, variables);

      // TODO: this response needs to be restructured
      if (
        data?.data?.listTasksBySprint?.tasks &&
        Array.isArray(data?.data?.listTasksBySprint?.tasks)
      ) {
        const taskListResponse = data?.data?.listTasksBySprint?.tasks
        const taskListConverted = []

        taskListResponse.map(task => {
          taskListConverted.push(transformTask(task))
        })
        setTaskList(taskListConverted)
      }

      if (data?.data?.getSprint) {
        setSprintDetails(data?.data?.getSprint)
      }
    };

    if (selectedSprint) {
      fetchData();
    }
  }, [selectedSprint]);

  if (loading) return <div className="p-2"><SkeletonLoader/></div>;
  if (error) return <ErrorAlert message={error.message}/>;

  return (
    <>
      <SprintHeader sprintDetails={sprintDetails}/>
      <SprintTable taskList={taskList}/>
    </>
  );
}

export default SprintContentPage;