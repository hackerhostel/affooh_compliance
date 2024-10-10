import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectProjectList, setSelectedProjectFromList } from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const projectList = useSelector(selectProjectList);

  const [filteredProjectList, setFilteredProjectList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    active: true,
    onHold: true,
    closed: true,
  });

  const [filterCounts, setFilterCounts] = useState({
    active: 0,
    onHold: 0,
    closed: 0,
  });

  useEffect(() => {
    if (projectList && Array.isArray(projectList)) {
      const activeCount = projectList.filter(project => project.status === "Active").length;
      const onHoldCount = projectList.filter(project => project.status === "On Hold").length;
      const closedCount = projectList.filter(project => project.status === "Closed").length;

      setFilterCounts({
        active: activeCount,
        onHold: onHoldCount,
        closed: closedCount,
      });

      setFilteredProjectList(projectList);
    }
  }, [projectList]);

  const handleSearch = (term) => {
    let filtered = projectList;

    if (term.trim() !== '') {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    filtered = filtered.filter(project => {
      if (selectedFilters.active && project.status === "Active") return true;
      if (selectedFilters.onHold && project.status === "On Hold") return true;
      if (selectedFilters.closed && project.status === "Closed") return true;
      return false;
    });

    setFilteredProjectList(filtered);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters(prevState => ({
      ...prevState,
      [filterName]: !prevState[filterName]
    }));
  };

  return (
    <div className="h-list-screen overflow-y-auto w-full">
      <div className="flex flex-col gap-3 p-3">
        <div className="py-3">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-between w-full mb-4">
          <button
            className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.active ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('active')}
          >
            Active ({filterCounts.active})
          </button>
          <button
            className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.onHold ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('onHold')}
          >
            On Hold ({filterCounts.onHold})
          </button>
          <button
            className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.closed ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('closed')}
          >
            Closed ({filterCounts.closed})
          </button>
        </div>

        {filteredProjectList.map((element, index) => (
          <button
            key={index}
            className="items-center p-3 border border-gray-200 rounded-md w-full grid grid-cols-3 gap-2 hover:bg-gray-100"
            onClick={() => {
              dispatch(setSelectedProjectFromList(index))
            }}
          >
            <div className="col-span-2 text-left">
              <div className="font-bold">{element?.name}</div>
              <div className="text-sm text-gray-600">
                Website<span className="mx-1">&#8226;</span>Development
              </div>
            </div>

            <div className="flex gap-1 ml-5">
              <TrashIcon className="w-4 h-4 text-pink-700" />
              <ChevronRightIcon className="w-4 h-4 text-black" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectListPage;
