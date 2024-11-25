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
    selectReleaseListForProject, selectSelectedRelease,
    setSelectedRelease
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
    const selectedRelease = useSelector(selectSelectedRelease)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [filteredReleases, setFilteredReleases] = useState([]);
    const [toDeleteRelease, setToDeleteRelease] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({
      unreleased: true,
      released: false,
    });

    const [filterCounts, setFilterCounts] = useState({
      unreleased: 0,
      released: 0,
    });

    const filteredReleaseList = filteredReleases.filter((release) => {
        // If both filters are unchecked, show nothing
        if (!selectedFilters.unreleased && !selectedFilters.released) {
            return false;
        }

        // Return true if the release status matches selected filters
        if (selectedFilters.unreleased && release.status === "UNRELEASED")
            return true;
        if (selectedFilters.released && release.status === "RELEASED")
            return true;

        return false;
    });

    const handleFilterChange = (filterName) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    useEffect(() => {
        if (selectedProject?.id) {
            dispatch(doGetReleases(selectedProject?.id));
        }
    }, [selectedProject]);

    useEffect(() => {
      if (releases.length) {
        setFilteredReleases(releases);

        const unreleasedCount = filteredReleases.filter(
          (release) => release.status === "UNRELEASED",
        ).length;
        const releasedCount = filteredReleases.filter(
          (release) => release.status === "RELEASED",
        ).length;

        setFilterCounts({
          unreleased: unreleasedCount,
          released: releasedCount,
        });
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
        setToDeleteRelease(release)
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (toDeleteRelease) {
            axios.delete(`/releases/${toDeleteRelease.id}`)
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
    };

    if (releaseLoading) return <div className="p-2"><SkeletonLoader/></div>;
    if (releaseError) return <ErrorAlert message="Cannot get release list"/>;

    return (
      <div className="h-list-screen overflow-y-auto w-full">
        {releaseLoading ? (
          <div className="p-2">
            <SkeletonLoader />
          </div>
        ) : (
          <div className="flex flex-col gap-3 ">
            <div className="py-3">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex flex-col gap-4 w-full pl-3">
              <div className="flex justify-between w-full">
                <button
                  className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.unreleased ? "bg-black text-white" : "bg-gray-200"}`}
                  onClick={() => handleFilterChange("unreleased")}
                >
                  UNRELEASED ({filterCounts.unreleased})
                </button>
                <button
                  className={`px-2 py-1 rounded-xl text-xs ${selectedFilters.released ? "bg-black text-white" : "bg-gray-200"}`}
                  onClick={() => handleFilterChange("released")}
                >
                  RELEASED ({filterCounts.released})
                </button>
              </div>
            </div>
            {filteredReleaseList.map((element, index) => (
              <button
                key={index}
                className={`flex justify-between items-center p-3 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100 ${
                    selectedRelease?.id === element.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                  dispatch(setSelectedRelease(element));
                }}
              >
                <div className="text-left">
                  <div className="font-bold mb-1">{element?.name}</div>
                  <div className="flex text-xs text-gray-600 items-center">
                    {element?.type?.name}
                  </div>
                </div>
                <div className={"flex gap-1"}>
                  <div
                    onClick={() => handleDeleteClick(element)}
                    className={"cursor-pointer"}
                  >
                    <TrashIcon className={"w-4 h-4 text-pink-700"} />
                  </div>
                  <ChevronRightIcon className={"w-4 h-4 text-black"} />
                </div>
              </button>
            ))}
          </div>
        )}

        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          onConfirm={handleConfirmDelete}
          message={
            toDeleteRelease
              ? `To delete release - ${toDeleteRelease.name} ?`
              : ""
          }
        />
      </div>
    );
};

export default ReleaseListPage;