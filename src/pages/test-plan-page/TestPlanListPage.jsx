import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
    doGetTestPlans,
    selectIsTestPlanListForProjectError,
    selectIsTestPlanListForProjectLoading,
    selectSelectedTestPlanId,
    selectTestPlanListForProject,
    setSelectedTestPlanId
} from "../../state/slice/testPlansSlice.js";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import {doGetReleases} from "../../state/slice/releaseSlice.js";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";

const TestPlanListPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {addToast} = useToasts();

    const selectedProject = useSelector(selectSelectedProject);
    const testPlansError = useSelector(selectIsTestPlanListForProjectError);
    const testPlansLoading = useSelector(selectIsTestPlanListForProjectLoading);
    const testPlans = useSelector(selectTestPlanListForProject);
    const selectedTestPlanId = useSelector(selectSelectedTestPlanId);
    const [toDeleteTestPlan, setToDeleteTestPlan] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [allTestPlans, setAllTestPlans] = useState([]);
    const [filteredTestPlans, setFilteredTestPlans] = useState([]);
    const [toDeleteRelease, setToDeleteRelease] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({
      todo: false,
      inProgress: true,
      done: false,
    });

    const [filterCounts, setFilterCounts] = useState({
      todo: 0,
      inProgress: 0,
      done: 0,
    });

    useEffect(() => {
        if (selectedProject?.id && !testPlans.length) {
            dispatch(doGetTestPlans(selectedProject?.id));
        }
    }, [selectedProject]);

    useEffect(() => {
        if (testPlans.length) {
            setAllTestPlans(testPlans)
        }
    }, [testPlans]);

    const filteredTestPlan = allTestPlans.filter((testPlan) => {
      // If both filters are unchecked, show nothing
      if (
        !selectedFilters.todo &&
        !selectedFilters.inProgress &&
        !selectedFilters.done
      ) {
        return false;
      }

      // Return true if the test plan status matches selected filters
      if (selectedFilters.todo && testPlan.status === "TODO") return true;
      if (selectedFilters.inProgress && testPlan.status === "IN PROGRESS")
        return true;
      if (selectedFilters.done && testPlan.status === "DONE") return true;

      return false;
    });

    const handleFilterChange = (filterName) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterName]: !prev[filterName],
      }));
    };

    useEffect(() => {
      if (testPlans.length) {
        setAllTestPlans(testPlans);

        const todoCount = allTestPlans.filter(
          (testPlan) => testPlan.status === "TODO",
        ).length;
        const inProgressCount = allTestPlans.filter(
          (testPlan) => testPlan.status === "IN PROGRESS",
        ).length;
        const doneCount = allTestPlans.filter(
          (testPlan) => testPlan.status === "DONE",
        ).length;

        setFilterCounts({
          todo: todoCount,
          inProgress: inProgressCount,
          done: doneCount,
        });
      }
    }, [testPlans]);

    const handleSearch = (term) => {
        if (term.trim() === '') {
            setFilteredTestPlans(testPlans);
        } else {
            const filtered = testPlans.filter(tp =>
                tp?.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredTestPlans(filtered);
        }
    };

    const handleTestPlanEditClick = (test_plan_id) => {
        history.push(`/test-plans/${test_plan_id}`);
    };

    const handleTestPlanClick = (test_plan_id) => {
        dispatch(setSelectedTestPlanId(test_plan_id))
        history.push(`/test-plans`);
    };

    const handleDeleteClick = (testPlan) => {
        setToDeleteTestPlan(testPlan)
        setIsDialogOpen(true);
    };

    const deleteTestPlan = async () => {
        try {
            const response = await axios.delete(`/test-plans/${toDeleteTestPlan.id}`)
            const deleted = response?.data?.status

            if (deleted) {
                addToast('Test Plan Successfully Deleted', {appearance: 'success'});
                dispatch(doGetTestPlans(selectedProject?.id));
                if (toDeleteTestPlan.id === selectedTestPlanId) {
                    handleTestPlanClick(0)
                }
            } else {
                addToast('Failed To Deleted The Test Plan ', {appearance: 'error'});
            }
        } catch (error) {
            addToast('Failed To Deleted The Test Plan ', {appearance: 'error'});
        }
    }

    if (testPlansError) return <ErrorAlert message={testPlansError.message}/>;

    return (
      <div className="h-list-screen overflow-y-auto w-full">
        {testPlansLoading ? (
          <div className="p-2">
            <SkeletonLoader />
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-3">
            <div className="py-3">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex flex-col gap-4 w-full pl-3">
              <div className="flex justify-between w-full">
                <button
                  className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.todo ? "bg-black text-white" : "bg-gray-200"}`}
                  onClick={() => handleFilterChange("todo")}
                >
                  TODO ({filterCounts.todo})
                </button>
                <button
                  className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.inProgress ? "bg-black text-white" : "bg-gray-200"}`}
                  onClick={() => handleFilterChange("inProgress")}
                >
                  IN-PROGRESS ({filterCounts.inProgress})
                </button>
                <button
                  className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.done ? "bg-black text-white" : "bg-gray-200"}`}
                  onClick={() => handleFilterChange("done")}
                >
                  DONE ({filterCounts.done})
                </button>
              </div>
            </div>
            {filteredTestPlan.map((element, index) => (
              <div
                key={element?.id}
                className={`flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100 ${
                    selectedTestPlanId === element.id ? 'bg-gray-100' : ''
                }`}
              >
                <div
                  className="text-left cursor-pointer"
                  onClick={() => handleTestPlanClick(element?.id)}
                >
                  <div className="font-bold mb-1">{element?.name}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    {element?.sprintName}
                    <span className="mx-1 text-black text-2xl ">&#8226;</span>
                    {element?.releaseName}
                  </div>
                </div>
                <div className={"flex gap-1"}>
                  <div
                    onClick={() => handleDeleteClick(element)}
                    className={"cursor-pointer"}
                  >
                    <TrashIcon className={"w-4 h-4 text-pink-700"} />
                  </div>
                  <div
                    onClick={() => handleTestPlanEditClick(element?.id)}
                    className={"cursor-pointer"}
                  >
                    <PencilSquareIcon className={"w-4 h-4 text-black"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          onConfirm={deleteTestPlan}
          message={
            toDeleteTestPlan
              ? `To delete test plan - ${toDeleteTestPlan.name} ?`
              : ""
          }
        />
      </div>
    );
};

export default TestPlanListPage;