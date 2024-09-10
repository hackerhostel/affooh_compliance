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
    selectTestPlanListForProject,
    setSelectedTestPlanId
} from "../../state/slice/testPlansSlice.js";
import {useHistory} from "react-router-dom";

const TestPlanListPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const selectedProject = useSelector(selectSelectedProject);
    const testPlansError = useSelector(selectIsTestPlanListForProjectError);
    const testPlansLoading = useSelector(selectIsTestPlanListForProjectLoading);
    const testPlans = useSelector(selectTestPlanListForProject);

    useEffect(() => {
        if (selectedProject?.id && !testPlans.length) {
            dispatch(doGetTestPlans(selectedProject?.id));
        }
    }, [selectedProject]);

    useEffect(() => {
        if (testPlans.length) {
            setFilteredTestPlans(testPlans)
        }
    }, [testPlans]);

    const [filteredTestPlans, setFilteredTestPlans] = useState([]);

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

    if (testPlansLoading) return <div className="p-2"><SkeletonLoader/></div>;
    if (testPlansError) return <ErrorAlert message={testPlansError.message}/>;

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            <div className="flex flex-col gap-3 p-3">
                <div className="py-3">
                    <SearchBar onSearch={handleSearch}/>
                </div>
                {filteredTestPlans.map((element, index) => (
                    <div
                        key={element?.id}
                        className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100">
                        <div className="text-left cursor-pointer" onClick={() => handleTestPlanClick(element?.id)}>
                            <div className="font-bold mb-1">{element?.name}</div>
                            <div className="text-sm text-gray-600 flex items-center">{element?.sprintName}<span
                                className="mx-1 text-black text-2xl ">&#8226;</span>{element?.releaseName}</div>
                        </div>
                        <div className={"flex gap-1"}>
                            <div><TrashIcon className={"w-4 h-4 text-pink-700"}/></div>
                            <div onClick={() => handleTestPlanEditClick(element?.id)} className={"cursor-pointer"}>
                                <PencilSquareIcon className={"w-4 h-4 text-black"}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestPlanListPage;