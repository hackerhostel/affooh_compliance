import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import {useFetchTestPlans} from "../../hooks/testPlanHooks/useFetchTestPlans.jsx";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";

const TestPlanListPage = () => {
    const selectedProject = useSelector(selectSelectedProject);

    const {testPlans, loading, error} = useFetchTestPlans(selectedProject?.id)
    const [filteredTestPlans, setFilteredTestPlans] = useState([]);

    useEffect(() => {
        if (testPlans.length) {
            setFilteredTestPlans(testPlans)
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

    if (loading) return <div className="p-2"><SkeletonLoader/></div>;
    if (error) return <ErrorAlert message={error.message}/>;

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            <div className="flex flex-col gap-3 p-3">
                <div className="py-3">
                    <SearchBar onSearch={handleSearch}/>
                </div>
                {filteredTestPlans.map((element, index) => (
                    <button
                        key={index}
                        className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100"
                        // onClick={() => {
                        //     dispatch(setSelectedProjectFromList(index))
                        // }}
                    >
                        <div className="text-left">
                            <div className="font-bold mb-1">{element?.name}</div>
                            <div className="text-sm text-gray-600 flex items-center">{element?.sprintID}<span
                                className="mx-1 text-black text-2xl ">&#8226;</span>{element?.releaseID}</div>
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