import React, {useEffect, useState} from 'react';
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedProject, setSelectedProjectFromList} from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {
  doGetProjectUsers,
  selectIsProjectUsersError,
  selectIsProjectUsersLoading,
  selectProjectUserList
} from "../../state/slice/projectUsersSlice.js";
import {sendInvitation} from "../../state/slice/registerSlice.js";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";

const UserListPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const userListError = useSelector(selectIsProjectUsersError);
  const userListForLoading = useSelector(selectIsProjectUsersLoading);
  const userListForProject = useSelector(selectProjectUserList);
  const selectedProject = useSelector(selectSelectedProject);

  const [filteredUserList, setFilteredUserList] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setFilteredUserList(userListForProject)
  }, [userListForProject]);

  useEffect(() => {
    async function fetchRoles(){
      try {
        const response = await axios.get('/organizations/form-data');
        const roles = response?.data.body;

        return Object.values(roles).map(role => role);
      } catch (error) {
        addToast(error.message || 'Failed to fetch user roles', { appearance: "error" });
      }
    }

    fetchRoles().then(r => setRoles(r));
  }, []);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      axios.delete(`/users/${selectedUser.id}`)
          .then(response => {
            const deleted = response?.data?.status

            if (deleted) {
              addToast('User Successfully Deleted', {appearance: 'success'});
              dispatch(doGetProjectUsers(selectedProject?.id));
            } else {
              addToast('Failed to delete user ', {appearance: 'error'});
            }
          }).catch(() => {
        addToast('User delete request failed ', {appearance: 'error'});
      });
    }

    setIsDialogOpen(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      alert('Please enter an email to invite.');
      return;
    }

    try {
      await dispatch(sendInvitation({
        email: inviteEmail,
        userRole: selectedRole
      }));

      // Show success message
      addToast("Invitation sent successfully!", { appearance: "success" });
    } catch (error) {
      addToast(error.message || 'Failed to send invitation', { appearance: "error" });
    }
  };

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

  if (userListForLoading) return <div className="p-2"><SkeletonLoader /></div>;
  if (userListError) return <ErrorAlert message="failed to fetch users at the moment" />;

  return (
    <div className="h-list-screen overflow-y-auto w-full pl-3">
      <div className="flex flex-col gap-3 laptopL:w-56  w-full ">

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

        <div className='flex gap-2'>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            { roles?.map((r) => (
                <option key={r.id} value={r.id}>{r.value}</option>
            ))}
          </select>

          <button
              onClick={handleInvite}
            className="bg-user-invite-button text-white rounded-md px-4 py-2"
            style={{ width: "145px" }}
          >
            INVITE
          </button>

        </div>

     
        <div className="py-3">
          <SearchBar onSearch={handleSearch} />
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
            <div className="flex gap-1 ml-6">
                            <TrashIcon onClick={() => handleDeleteClick(element)} className="w-4 h-4 text-pink-700"/>
                            <ChevronRightIcon className="w-4 h-4 text-black"/>
                          </div>

          </button>
        ))}
      </div>

      <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          onConfirm={handleConfirmDelete}
          message={selectedUser ? `To delete user - ${selectedUser.firstName} ?` : ''}
      />
    </div>
  );
};

export default UserListPage;
