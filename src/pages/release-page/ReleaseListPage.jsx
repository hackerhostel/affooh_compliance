import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
    doGetReleases,
    selectIsReleaseListForProjectError,
    selectIsReleaseListForProjectLoading,
    selectReleaseListForProject
} from "../../state/slice/releaseSlice.js";
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";

const ReleaseListPage = () => {
    const {addToast} = useToasts();
    const dispatch = useDispatch();
    const selectedProject = useSelector(selectSelectedProject);
    const releases = useSelector(selectReleaseListForProject)
    const releaseLoading = useSelector(selectIsReleaseListForProjectLoading)
    const releaseError = useSelector(selectIsReleaseListForProjectError)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRelease, setSelectedRelease] = useState(null);

    const [filteredReleases, setFilteredReleases] = useState([]);

    useEffect(() => {
        if (selectedProject?.id) {
            dispatch(doGetReleases(selectedProject?.id));
        }
    }, [selectedProject]);

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

    const handleDeleteClick = (release) => {
        setSelectedRelease(release);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRelease) {
            axios.delete(`/releases/${selectedRelease.id}`)
                .then(response => {
                const deleted = response?.data?.status

                if (deleted) {
                    addToast('Release Successfully Deleted', {appearance: 'success'});
                    dispatch(doGetReleases(selectedProject?.id));
                } else {
                    addToast('Failed to delete release ', {appearance: 'error'});
                }
            }).catch(() => {
                addToast('Release delete request failed ', {appearance: 'error'});
            });
        }
        setIsDialogOpen(false);
        setSelectedRelease(null);
    };

    if (releaseLoading) return <div className="p-2"><SkeletonLoader/></div>;
    if (releaseError) return <ErrorAlert message={error.message}/>;

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            {releaseLoading ? (<div className="p-2"><SkeletonLoader/></div>) : (
                <div className="flex flex-col gap-3 p-3">
                    <div className="py-3">
                        <SearchBar onSearch={handleSearch}/>
                    </div>
                    {filteredReleases.map((element, index) => (
                        <button
                            key={index}
                            className="flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100"
                            // onClick={() => {
                            //     dispatch(setSelectedProjectFromList(index))
                            // }}
                        >
                            <div className="text-left">
                                <div className="font-bold mb-1">{element?.name}</div>
                                <div className="flex text-xs text-gray-600 items-center">{element?.type?.name}</div>
                            </div>
                            <div className={"flex gap-1"}>
                                <div onClick={() => handleDeleteClick(element)} className={"cursor-pointer"}>
                                    <TrashIcon className={"w-4 h-4 text-pink-700"}/>
                                </div>
                                <ChevronRightIcon className={"w-4 h-4 text-black"}/>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedRelease(null);
                }}
                onConfirm={handleConfirmDelete}
                message={selectedRelease ? `To delete release - ${selectedRelease.name} ?` : ''}
            />
        </div>
    );
};

export default ReleaseListPage;