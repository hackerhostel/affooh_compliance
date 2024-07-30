import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import {useFetchReleases} from "../../hooks/releaseHooks/useFetchReleases.jsx";
import CustomFieldsListPage from "./CustomFieldsListPage.jsx";

const SettingPage = () => {
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
            <CustomFieldsListPage/>
        </div>
    );
};

export default SettingPage;