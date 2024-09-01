import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import SprintTable from "../../components/sprint-table/index.jsx";
import {selectSelectedSprint, setSelectedSprint} from "../../state/slice/sprintSlice.js";
import useGraphQL from "../../hooks/useGraphQL.jsx";
import {fetchSprintDetails} from "../../graphql/sprintQueries/queries.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SprintHeader from "./SprintHeader.jsx";
import useFetch from "../../hooks/useFetch.jsx";
import axios from "axios";

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

  const [taskList, setTaskList] = useState([])
  const [sprintDetails, setSprintDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(`/sprints/${selectedSprint?.id}`);

        // TODO: wrong response structure
        if (data.data) {
          const details = data.data
          console.log(details)
          const taskListResponse = details?.tasks
          const taskListConverted = []

          if(taskListResponse && Array.isArray(taskListResponse)) {
            taskListResponse.map(task => {
              taskListConverted.push(transformTask(task))
            })
            setTaskList(taskListConverted)
          }

          if(details?.sprint) {
            setSprintDetails(details?.sprint)
          }
        }

      } catch (e) {
        setError(e)
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSprint) {
      fetchData();
    }
  }, [selectedSprint]);

  if (isLoading) return <div className="p-2"><SkeletonLoader/></div>;
  if (error) return <ErrorAlert message={error.message}/>;

  return (
    <>
      <SprintHeader sprintDetails={sprintDetails}/>
      <SprintTable taskList={taskList}/>
    </>
  );
}

export default SprintContentPage;