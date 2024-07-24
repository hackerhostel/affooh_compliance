import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import {useFetchTestPlans} from "../../hooks/testPlanHooks/useFetchTestPlans.jsx";

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

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            <div className="flex flex-col gap-3 p-3">
                <div className="py-3">
                    <SearchBar onSearch={handleSearch}/>
                </div>
                {filteredTestPlans.map((element, index) => (
                    <button
                        key={index}
                        className="items-center p-3 border border-gray-200 rounded-md w-full grid grid-cols-3 gap-2 hover:bg-gray-100"
                        // onClick={() => {
                        //     dispatch(setSelectedProjectFromList(index))
                        // }}
                    >
                        <div className="col-span-2 text-left">
                            <div className="font-bold">{element?.name}</div>
                            <div className="text-sm text-gray-600">Website<span className="mx-1">&#8226;</span>Development
                            </div>
                        </div>
                        <div className="text-right">{`>`}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TestPlanListPage;