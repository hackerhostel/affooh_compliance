import React, { useEffect, useState } from 'react';
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProjectFromList } from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
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
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Scrum");

  useEffect(() => {
    setFilteredUserList(userListForProject)
  }, [userListForProject]);

  const handleSearch = (term) => {
    if (term.trim() === '') {
      setFilteredUserList(userListForProject);
    } else {
      const filtered = userListForProject.filter(user =>
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUserList(filtered);
    }
  };

  const handleInvite = () => {
    if (!inviteEmail) {
      alert('Please enter an email to invite.');
      return;
    }

    console.log(`Inviting ${inviteEmail} with role ${selectedRole}`);
    setInviteEmail("");
  };

  if (userListForLoading) return <div className="p-2"><SkeletonLoader /></div>;
  if (userListError) return <ErrorAlert message="failed to fetch users at the moment" />;

  return (
    <div className="h-list-screen overflow-y-auto w-full">
      <div className="flex flex-col gap-3 p-3">

        {/* Invite Section */}
        <div className="flex items-center gap-2">

          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite"
            className="border border-gray-300 rounded-md p-2  flex-grow"
          />
        </div>

        <div className='flex gap-1'>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="Scrum">Scrum</option>
            <option value="Admin">Admin</option>
            <option value="Developer">Developer</option>
          </select>

          <button
            onClick={handleInvite}
            className="bg-user-invite-button text-white rounded-md px-4 py-2"
            style={{ width: "145px" }}
          >
            INVITE
          </button>

        </div>

        {/* Search Bar */}
        <div className="py-3">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* User List */}
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
            <div className="flex gap-1 ml-6">
                            <TrashIcon className="w-4 h-4 text-pink-700"/>
                            <ChevronRightIcon className="w-4 h-4 text-black"/>
                          </div>

          </button>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;
