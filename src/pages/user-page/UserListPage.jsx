import React, {useEffect, useState} from 'react';
import useGraphQL from "../../hooks/useGraphQL.jsx";
import {listUsersByOrganization} from "../../graphql/userQueries/queries.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {useDispatch} from "react-redux";
import {setSelectedProjectFromList} from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SearchBar from "../../components/SearchBar.jsx";

const UserListPage = () => {
  const dispatch = useDispatch();
  const {makeRequest, loading, error} = useGraphQL();

  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = listUsersByOrganization;
      const variables = { /* your query variables */}; // not mandatory
      const data = await makeRequest(query, variables);

      const userListResponse = data.data.listUsersByOrganization;
      if (userListResponse && Array.isArray(userListResponse)) {
        setUserList(userListResponse)
        setFilteredUserList(userListResponse)
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term) => {
    if (term.trim() === '') {
      setFilteredUserList(userList);
    } else {
      const filtered = userList.filter(user =>
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUserList(filtered);
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
        {filteredUserList.map((element, index) => (
          <button
            key={index}
            className="items-center p-3 border border-gray-200 rounded-md w-full grid grid-cols-3 gap-2 hover:bg-gray-100"
            onClick={() => {
              dispatch(setSelectedProjectFromList(index))
            }}
          >
            <div className="col-span-2 text-left">
              <div className="font-bold">{`${element?.firstName} ${element?.lastName}`}</div>
              <div className="text-sm text-primary-pink">{element.email}</div>
            </div>
            <div className="text-right">{`>`}</div>
          </button>
        ))}
      </div>
    </div>
  )
    ;
};

export default UserListPage;