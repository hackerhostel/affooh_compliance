import React, { useCallback, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import FormSelect from "../FormSelect.jsx";
import { doSwitchProject, selectProjectList, selectSelectedProject } from "../../state/slice/projectSlice.js";
import { selectUser } from "../../state/slice/authSlice.js";
import Notification from "./NotificationPopup.jsx"

const Header = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);
  const userDetails = useSelector(selectUser);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);

  const handleChange = (e, value) => {
    dispatch(doSwitchProject(Number(value)));
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ global: true });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const getProjectOptions = useCallback(() => {
    return projectList.map((project) => ({
      value: project.id,
      label: project.name,
    }));
  }, [projectList]);

  const openPopUp = () =>{
    setIsOpenPopUp((prevState) => !prevState);
  }

  const closePopUp = () => {
    setIsOpenPopUp(false);
  }


  return (
    <div className="flex justify-between h-16 w-full">
      {/* Left Section */}
      <div className="py-3 px-4 w-72">
        <FormSelect
          name="project"
          showLabel={false}
          formValues={{ project: selectedProject?.id }}
          placeholder="Select a project"
          options={getProjectOptions()}
          onChange={handleChange}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center mr-6 space-x-3">
        <div>
        <BellIcon onClick={openPopUp} className="w-7 h-7 m-3 cursor-pointer" />
        </div>

        <div className="z-50">
        <Notification
        isOpen = {isOpenPopUp}
        onClose = {closePopUp}
        />
        </div>

        
        

        {/* Divider */}
        <div className="border-l border-gray-300 h-8"></div>

        {/* User Avatar and Menu */}
        <div className="flex justify-center ">
          {!loading ? (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="">
                {userDetails.avatar ? (
                  <img
                    src={userDetails.avatar}
                    alt={`${userDetails.firstName} ${userDetails.lastName}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center text-white text-xl font-semibold">
                    {userDetails.firstName?.[0]}
                    {userDetails.lastName?.[0]}
                  </div>
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-64 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {`${userDetails.firstName} ${userDetails.lastName}`}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{userDetails.email}</p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                          } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                          onClick={handleSignOut}
                          disabled={loading}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
