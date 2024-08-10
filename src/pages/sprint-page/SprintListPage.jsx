import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import useGraphQL from "../../hooks/useGraphQL.jsx";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {listSprintsByProject} from "../../graphql/sprintQueries/queries.js";
import {
  selectIsSprintListForProjectError,
  selectIsSprintListForProjectLoading,
  selectSprintListForProject,
  setSelectedSprint
} from "../../state/slice/sprintSlice.js";

const SprintListPage = () => {
  const dispatch = useDispatch();
  const sprintListError = useSelector(selectIsSprintListForProjectError);
  const sprintListForLoading = useSelector(selectIsSprintListForProjectLoading);
  const sprintListForProject = useSelector(selectSprintListForProject);

  const [sprintList, setSprintList] = useState([]);
  const [filteredSprintList, setFilteredSprintList] = useState([]);

  useEffect(() => {
    setFilteredSprintList(sprintListForProject)
  }, [sprintListForProject]);

  const handleSearch = (term) => {
    if (term.trim() === '') {
      setFilteredSprintList(sprintList);
    } else {
      const filtered = sprintList.filter(user =>
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSprintList(filtered);
    }
  };

  if (sprintListForLoading) return <div className="p-2"><SkeletonLoader/></div>;
  if (sprintListError) return <ErrorAlert message="failed to fetch sprints at the moment"/>;

  return (
    <div className="h-list-screen overflow-y-auto w-full">
      <div className="flex flex-col gap-3 p-3">
        <div className="py-3">
          <SearchBar onSearch={handleSearch}/>
        </div>
        {filteredSprintList.map((element, index) => (
          <button
            key={index}
            className="items-center p-3 border border-gray-200 rounded-md w-full grid grid-cols-3 gap-2 hover:bg-gray-100"
            onClick={() => {
              dispatch(setSelectedSprint(element))
            }}
          >
            <div className="col-span-2 text-left">
              <div className="font-bold">{element?.name}</div>
              <div className="text-sm text-gray-600">Website<span className="mx-1">&#8226;</span>Development</div>
            </div>
            <div className="text-right">{`>`}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SprintListPage;