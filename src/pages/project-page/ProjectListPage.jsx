import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { selectProjectList, setSelectedProjectFromList } from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";

const ProjectListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedProject, setSelectedProject] = useState("");
  const dispatch = useDispatch();

 
  const projectList = useSelector(selectProjectList);
  const [filteredProjectList, setFilteredProjectList] = useState([]);

 
  useEffect(() => {
    if (projectList && Array.isArray(projectList)) {
      const filtered = projectList.filter(
        (project) =>
          project.status === activeTab &&
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjectList(filtered);
    }
  }, [projectList, searchTerm, activeTab]);

  
  const handleProjectSelection = (e) => {
    const selected = e.target.value;
    setSelectedProject(selected);
    const projectIndex = projectList.findIndex(project => project.name === selected);
    if (projectIndex >= 0) {
      dispatch(setSelectedProjectFromList(projectIndex)); 
    }
  };

  useEffect(() => {
    console.log("Project list fetched:", projectList);
  }, [projectList]);

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          className="border rounded-lg p-2 pl-10 w-full"
          placeholder="Search Projects"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

    
      <div className="mb-4">
        <select
          className="border rounded-lg p-2 w-full"
          value={selectedProject}
          onChange={handleProjectSelection}
        >
          {projectList.map((project, index) => (
            <option key={index} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

  
      <div  className="flex space-x-2 mb-4">
        {["Active", "On Hold", "Closed"].map((status) => (
          <button
            style={{width:"105px", height:"37px"}}
            key={status}
            className={`rounded-full ${
              activeTab === status
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab(status)}
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

     
      <div>
        {filteredProjectList.map((project, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <span>{project.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectListPage;
