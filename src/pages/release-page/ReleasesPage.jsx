import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import {useFetchReleases} from "../../hooks/releaseHooks/useFetchReleases.jsx";

const ReleasesPage = () => {
    const selectedProject = useSelector(selectSelectedProject);

    const {releases, loading, error} = useFetchReleases(selectedProject?.id)
    const [filteredReleases, setFilteredReleases] = useState([]);

    useEffect(() => {
        if (releases.length) {
            setFilteredReleases(releases)
        }
    }, [releases]);

    const handleSearch = (term) => {
        if (term.trim() === '') {
            setFilteredReleases(releases);
        } else {
            const filtered = releases.filter(tp =>
                tp?.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredReleases(filtered);
        }
    };

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            <div className="flex flex-col gap-3 p-3">
                <div className="py-3">
                    <SearchBar onSearch={handleSearch}/>
                </div>
                {filteredReleases.map((element, index) => (
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

export default ReleasesPage;