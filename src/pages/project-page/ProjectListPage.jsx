import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectProjectList, setSelectedProjectFromList } from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";

const ProjectListPage = () => {
  const dispatch = useDispatch();

  // TODO: need to have a separate API to fetch project list
  const projectList = useSelector(selectProjectList);

  const [filteredProjectList, setFilteredProjectList] = useState([]);

  useEffect(() => {
    if (projectList && Array.isArray(projectList)) {
      setFilteredProjectList(projectList)
    }
  }, [projectList]);

  const handleSearch = (term) => {
    if (term.trim() === '') {
      setFilteredProjectList(projectList);
    } else {
      const filtered = projectList.filter(project =>
        project.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProjectList(filtered);
    }
  };

  return (
    <div className="h-list-screen overflow-y-auto w-full">
      <div className="flex flex-col gap-3 p-3">
        <div className="py-3">
          <SearchBar onSearch={handleSearch} />
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