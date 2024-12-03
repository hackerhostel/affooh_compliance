import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProjectList,
  selectSelectedProject,
  setSelectedProject,
} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import axios from "axios";
import { useToasts } from "react-toast-notifications";

const ProjectListPage = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const projectList = useSelector(selectProjectList);
  const selectedProject = useSelector(selectSelectedProject);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (projectList?.length) {
      updateFilterCounts();
      setFilteredProjectList(projectList);
    }
  }, [projectList]);

  const updateFilterCounts = () => {
    const counts = {
      active: projectList.filter((p) => p.status === "Active").length,
      onHold: projectList.filter((p) => p.status === "On Hold").length,
      closed: projectList.filter((p) => p.status === "Closed").length,
    };
    setFilterCounts(counts);
  };

  const handleSearch = (term) => {
    let filtered = projectList;

    if (term.trim()) {
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    filtered = filtered.filter((project) => {
      if (selectedFilters.active && project.status === "Active") return true;
      if (selectedFilters.onHold && project.status === "On Hold") return true;
      if (selectedFilters.closed && project.status === "Closed") return true;
      return false;
    });

    setFilteredProjectList(filtered);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      axios
        .delete(`/projects/${projectToDelete.id}`)
        .then(() => {
          addToast("Project successfully deleted", { appearance: "success" });
          const updatedList = projectList.filter((p) => p.id !== projectToDelete.id);
          setFilteredProjectList(updatedList);
          updateFilterCounts();
        })
        .catch(() => {
          addToast("Failed to delete project", { appearance: "error" });
        });
    }
    setIsDialogOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="h-list-screen w-full">
      <div className="flex flex-col gap-4  w-full pl-3">
        <SearchBar onSearch={handleSearch} />
        <div className="flex w-full laptopL:w-60 justify-between ">
          {["active", "onHold", "closed"].map((filter) => (
            <button
              key={filter}
              className={`px-2 py-1 rounded-xl text-xs ${
                selectedFilters[filter] ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} ({filterCounts[filter]})
            </button>
          ))}
        </div>
      </div>

      <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-1 mt-6">
        {filteredProjectList.length === 0 ? (
          <div className="text-center text-gray-600">No projects found</div>
        ) : (
          filteredProjectList.map((project) => (
            <div
              key={project.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="col-span-2 text-left flex flex-col gap-1">
                <div className="font-bold">{project.name}</div>
                <div className="text-xs text-gray-600">Website • Development</div>
              </div>
              <div className="flex gap-1">
                <TrashIcon
                  onClick={() => handleDeleteClick(project)}
                  className="w-4 h-4 text-pink-700 cursor-pointer"
                />
                <ChevronRightIcon
                  onClick={() => dispatch(setSelectedProject(project))}
                  className="w-4 h-4 text-black cursor-pointer"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete project "${projectToDelete?.name}"?`}
      />
    </div>
  );
};

export default ProjectListPage;
