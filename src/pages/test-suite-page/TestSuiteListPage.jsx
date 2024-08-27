import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import SearchBar from "../../components/SearchBar.jsx";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {selectSelectedTestPlan, setSelectedTestPlan} from "../../state/slice/testPlansSlice.js";
import useFetchTestPlan from "../../hooks/custom-hooks/test-plan/useFetchTestPlan.jsx";

const TestPlanListPage = () => {
    const history = useHistory();
    const {test_plan_id} = useParams();
    const dispatch = useDispatch();

    const selectedTestPlan = useSelector(selectSelectedTestPlan);

    const [loading, setLoading] = useState(true);
    const [filteredTestSuites, setFilteredTestSuites] = useState([]);
    const [testPlan, setTestPlan] = useState({});
    const [testPlanId, setTestPlanId] = useState(0);
    const [testSuites, setTestSuites] = useState([]);

    const {data: testPlanResponse} = useFetchTestPlan(testPlanId)

    useEffect(() => {
        if (selectedTestPlan?.id && selectedTestPlan.id === Number(test_plan_id)) {
            setTestPlan(selectedTestPlan)
        } else {
            setTestPlanId(Number(test_plan_id))
        }
    }, [selectedTestPlan]);

    useEffect(() => {
        if (testPlanResponse?.id) {
            setTestPlan(testPlanResponse)
            dispatch(setSelectedTestPlan(testPlanResponse))
        }
    }, [testPlanResponse]);

    useEffect(() => {
        if (testPlan?.id) {
            setTestSuites(testPlan?.testSuites || [])
            setFilteredTestSuites(testPlan?.testSuites || [])
            setLoading(false)
        }
    }, [testPlan]);


    const handleSearch = (term) => {
        if (term.trim() === '') {
            setFilteredTestSuites(testSuites);
        } else {
            const filtered = testSuites.filter(tp =>
                tp?.summary.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredTestSuites(filtered);
        }
    };

    const handleTestSuiteItemClick = (testSuiteId) => {
        history.push(`/test-plans/${test_plan_id}/test-suites/${testSuiteId}`);
    };

    if (loading) return <div className="p-2"><SkeletonLoader/></div>;

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            <div className="flex flex-col gap-3 p-3">
                <div className="py-3">
                    <SearchBar onSearch={handleSearch}/>
                </div>
                {filteredTestSuites.map((element, index) => (
                    <button
                        key={index}
                        className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100"
                        onClick={() => {
                            handleTestSuiteItemClick(element?.id)
                        }}
                    >
                        <div className="text-left">
                            <div className="font-bold mb-1">{element?.summary}</div>
                            <div className="text-sm text-gray-600 flex items-center">{testPlan?.name}</div>
                        </div>
                        <div className={"flex gap-1"}>
                            <TrashIcon className={"w-4 h-4 text-pink-700"}/>
                            <ChevronRightIcon className={"w-4 h-4 text-black"}/>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TestPlanListPage;