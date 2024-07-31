import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectProjectList, selectSelectedProject, setSelectedProjectFromList} from "../../state/slice/projectSlice.js";
import SearchBar from "../../components/SearchBar.jsx";
import useGraphQL from "../../hooks/useGraphQL.jsx";
import {listUsersByOrganization} from "../../graphql/userQueries/queries.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {fetchSprintDetails, listSprintsByProject} from "../../graphql/sprintQueries/queries.js";

const SprintListPage = () => {
  const dispatch = useDispatch();
  const {makeRequest, loading, error} = useGraphQL();
  const selectedProject = useSelector(selectSelectedProject);

  const [sprintList, setSprintList] = useState([]);
  const [filteredSprintList, setFilteredSprintList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = listSprintsByProject;
      const variables = { 'projectID': selectedProject?.id };
      const data = await makeRequest(query, variables);

      const userListResponse = data.data.listSprintsByProject;
      if (userListResponse && Array.isArray(userListResponse)) {
        setSprintList(userListResponse)
        setFilteredSprintList(userListResponse)
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term) => {
    if (term.trim() === '') {
      setFilteredSprintList(sprintList);
    } else {
      const filtered = sprintList.filter(user =>
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSprintList(filtered);
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
        {filteredSprintList.map((element, index) => (
          <button
            key={index}
            className="items-center p-3 border border-gray-200 rounded-md w-full grid grid-cols-3 gap-2 hover:bg-gray-100"
            onClick={() => {
              dispatch(setSelectedProjectFromList(index))
            }}
          >
            <div className="col-span-2 text-left">
              <div className="font-bold">{element?.name}</div>
              <div className="text-sm text-gray-600">Website<span className="mx-1">&#8226;</span>Development</div>
            </div>
            <div className="text-right">{`>`}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SprintListPage;