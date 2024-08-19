import React, {useEffect, useState} from 'react';
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedProjectFromList} from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import {
  selectIsProjectUsersError,
  selectIsProjectUsersLoading,
  selectProjectUserList
} from "../../state/slice/projectUsersSlice.js";

const UserListPage = () => {
  const dispatch = useDispatch();
  const userListError = useSelector(selectIsProjectUsersError);
  const userListForLoading = useSelector(selectIsProjectUsersLoading);
  const userListForProject = useSelector(selectProjectUserList);

  const [filteredUserList, setFilteredUserList] = useState([]);

  useEffect(() => {
    setFilteredUserList(userListForProject)
  }, [userListForProject]);

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

  if (userListForLoading) return <div className="p-2"><SkeletonLoader/></div>;
  if (userListError) return <ErrorAlert message="failed to fetch users at the moment"/>;

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