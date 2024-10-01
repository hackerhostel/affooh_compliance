import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import SearchBar from "../../components/SearchBar.jsx";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
  selectIsSprintListForProjectError,
  selectIsSprintListForProjectLoading,
  selectSprintListForProject,
  setSelectedSprint
} from "../../state/slice/sprintSlice.js";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";

const SprintListPage = () => {
  const dispatch = useDispatch();
  const sprintListError = useSelector(selectIsSprintListForProjectError);
  const sprintListForLoading = useSelector(selectIsSprintListForProjectLoading);
  const sprintListForProject = useSelector(selectSprintListForProject);

  const [sprintList, setSprintList] = useState([]);
  const [filteredSprintList, setFilteredSprintList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    inProgress: true,
    toDo: true,
    done: true,
  });

  const [filterCounts, setFilterCounts] = useState({
    inProgress: 0,
    toDo: 0,
    done: 0,
  });

  useEffect(() => {
    if (sprintListForProject.length) {
      setSprintList([...sprintListForProject]);

      const inProgressCount = sprintListForProject.filter(sprint => sprint.status.value === "In Progress").length;
      const toDoCount = sprintListForProject.filter(sprint => sprint.status.value === "Open").length;
      const doneCount = sprintListForProject.filter(sprint => sprint.status.value === "Done").length;

      setFilterCounts({
        inProgress: inProgressCount,
        toDo: toDoCount,
        done: doneCount,
      });

      handleSearch('');
    }
  }, [sprintListForProject]);

  useEffect(() => {
    if (sprintList.length) {
      setFilteredSprintList([...sprintList]);
    }
  }, [sprintList]);

  const handleSearch = (term) => {
    let filtered = sprintList;

    if (term.trim() !== '') {
      filtered = filtered.filter(sprint =>
          sprint.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    filtered = filtered.filter(sprint => {
      if (selectedFilters.inProgress && sprint.status.value === "In Progress") return true;
      if (selectedFilters.toDo && sprint.status.value === "Open") return true;
      if (selectedFilters.done && sprint.status.value === "Done") return true;
      return false;
    });

    setFilteredSprintList(filtered);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters(prevState => ({
      ...prevState,
      [filterName]: !prevState[filterName]
    }));
  };

  useEffect(() => {
    handleSearch('');
  }, [selectedFilters]);

  if (sprintListError) return <ErrorAlert message="Failed to fetch sprints at the moment"/>;

  return (
      <div className="h-list-screen w-full">
        {sprintListForLoading ? (
            <div className="p-2"><SkeletonLoader/></div>
        ) : (
            <div className="flex-col gap-4">
              <div className="flex flex-col gap-4 w-full pl-3">
                <SearchBar onSearch={handleSearch}/>
                <div className="flex justify-between w-full">
                  <button
                      className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.inProgress ? 'bg-black text-white' : 'bg-gray-200'}`}
                      onClick={() => handleFilterChange('inProgress')}
                  >
                    In Progress ({filterCounts.inProgress})
                  </button>
                  <button
                      className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.toDo ? 'bg-black text-white' : 'bg-gray-200'}`}
                      onClick={() => handleFilterChange('toDo')}
                  >
                    To Do ({filterCounts.toDo})
                  </button>
                  <button
                      className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.done ? 'bg-black text-white' : 'bg-gray-200'}`}
                      onClick={() => handleFilterChange('done')}
                  >
                    Done ({filterCounts.done})
                  </button>
                </div>
              </div>
              <div className={"h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-3 pr-2 mt-6"}>
                {filteredSprintList.length === 0 ? (
                    <div className="text-center text-gray-600">No sprints found</div>
                ) : (
                    filteredSprintList.map((element, index) => (
                        <button
                            key={index}
                            className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100"
                            onClick={() => dispatch(setSelectedSprint(element))}
                        >
                          <div className="col-span-2 text-left">
                            <div className="font-bold">{element?.name}</div>
                            <div className="text-sm text-gray-600">Website<span className="mx-1">&#8226;</span>Development
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <TrashIcon className="w-4 h-4 text-pink-700"/>
                            <ChevronRightIcon className="w-4 h-4 text-black"/>
                          </div>
                        </button>
                    ))
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default SprintListPage;