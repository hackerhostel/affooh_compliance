import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../components/SearchBar.jsx";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import {
  doGetTestPlans,
  selectIsTestPlanListForProjectError,
  selectIsTestPlanListForProjectLoading,
  selectTestPlanListForProject,
  setSelectedTestPlanId,
} from "../../state/slice/testPlansSlice.js";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";

const TestPlanListPage = () => {
  const dispatch = useDispatch();
  const testPlansError = useSelector(selectIsTestPlanListForProjectError);
  const testPlansLoading = useSelector(selectIsTestPlanListForProjectLoading);
  const testPlans = useSelector(selectTestPlanListForProject);
  const selectedProject = useSelector(selectSelectedProject);

  const [filteredTestPlans, setFilteredTestPlans] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    todo: true,
    inProgress: true,
    done: true,
  });

  const [filterCounts, setFilterCounts] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
  });

  const [toDeleteTestPlan, setToDeleteTestPlan] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(doGetTestPlans(selectedProject?.id));
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    if (testPlans.length) {
      const todoCount = testPlans.filter((tp) => tp.status === "TODO").length;
      const inProgressCount = testPlans.filter((tp) => tp.status === "IN PROGRESS").length;
      const doneCount = testPlans.filter((tp) => tp.status === "DONE").length;

      setFilterCounts({ todo: todoCount, inProgress: inProgressCount, done: doneCount });
      handleSearch("");
    }
  }, [testPlans]);

  const handleSearch = (term) => {
    let filtered = testPlans;

    if (term.trim()) {
      filtered = filtered.filter((tp) => tp.name.toLowerCase().includes(term.toLowerCase()));
    }

    filtered = filtered.filter((tp) => {
      if (selectedFilters.todo && tp.status === "TODO") return true;
      if (selectedFilters.inProgress && tp.status === "IN PROGRESS") return true;
      if (selectedFilters.done && tp.status === "DONE") return true;
      return false;
    });

    setFilteredTestPlans(filtered);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleDeleteClick = (testPlan) => {
    setToDeleteTestPlan(testPlan);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Assume delete API call and state update here
    setIsDialogOpen(false);
    dispatch(doGetTestPlans(selectedProject?.id));
  };

  if (testPlansError) return <ErrorAlert message="Failed to fetch test plans at the moment" />;

  return (
    <div className="h-list-screen w-full">
      {testPlansLoading ? (
        <div className="p-2">
          <SkeletonLoader />
        </div>
      ) : (
        <div className="flex-col gap-4">
          <div className="flex flex-col gap-4 w-full ">
            <SearchBar onSearch={handleSearch} />
            <div className="flex w-full laptopL:w-64 justify-between">
            <button
                className={`px-2 py-1 rounded-xl text-xs ${
                  selectedFilters.inProgress ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => handleFilterChange("inProgress")}
              >
                In Progress ({filterCounts.inProgress})
              </button>
              <button
                className={`px-2 py-1 rounded-xl text-xs ${
                  selectedFilters.todo ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => handleFilterChange("todo")}
              >
                Todo ({filterCounts.todo})
              </button>
              <button
                className={`px-2 py-1 rounded-xl text-xs ${
                  selectedFilters.done ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => handleFilterChange("done")}
              >
                Done ({filterCounts.done})
              </button>
            </div>
          </div>
          <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-1 mt-6">
            {filteredTestPlans.length === 0 ? (
              <div className="text-center text-gray-600">No test plans found</div>
            ) : (
              filteredTestPlans.map((tp) => (
                <div
                  key={tp.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div
                    className="col-span-2 text-left flex gap-2"
                    onClick={() => dispatch(setSelectedTestPlanId(tp.id))}
                  >
                    <div className="flex flex-col gap-2 justify-center">
                      <div className="font-bold">{tp.name}</div>
                      <div className="text-xs text-gray-600">{tp.sprintName}</div>
                    </div>
                  </div>
                  <div className="gap-1 flex">
                    <div onClick={() => handleDeleteClick(tp)}>
                      <TrashIcon className="w-4 h-4 text-pink-700" />
                    </div>
                    <div onClick={() => dispatch(setSelectedTestPlanId(tp.id))}>
                      <ChevronRightIcon className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete test plan "${toDeleteTestPlan?.name}"?`}
      />
    </div>
  );
};

export default TestPlanListPage;
