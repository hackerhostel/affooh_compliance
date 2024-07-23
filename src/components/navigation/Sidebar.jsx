import {Menu, Transition} from '@headlessui/react';
import {ClipboardIcon, CogIcon, HomeIcon, RectangleStackIcon, UserIcon} from '@heroicons/react/24/outline';
import {Link, useLocation} from "react-router-dom";
import AffoohLogo from '../../assets/affooh_logo.png'
import {Fragment, useState} from "react";
import {signOut} from "aws-amplify/auth";
import {useSelector} from "react-redux";
import {selectUser} from "../../state/slice/authSlice.js";
import Spinner from "../Spinner.jsx";

function Sidebar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const userDetails = useSelector(selectUser);

  const handleSignOut = async () => {
    setLoading(true)
    await signOut({global: true});
    setLoading(false)
    window.location.reload();
  }

  const MenuItem = ({link, Icon}) => (
    <Link to={link}
          className={`w-12 h-12 ${location.pathname === link ? 'bg-primary-pink' : 'bg-gray-200 hover:bg-secondary-pink'} rounded-full flex items-center justify-center transition-colors duration-200`}>
      <Icon className={`w-6 h-6 ${location.pathname === link ? 'text-white' : 'text-gray-700'}`}/>
    </Link>
  );

  return (
    <div className="w-24 flex flex-col h-screen border-r border-r-gray-200 bg-white shadow-md">
      <div className="h-20 flex items-center justify-center px-2 py-4">
        <img
          src={AffoohLogo}
          alt="Affooh Logo"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="flex-grow flex flex-col items-center py-5 space-y-6">
        <MenuItem link="/dashboard" Icon={HomeIcon}/>
        <MenuItem link="/projects" Icon={ClipboardIcon}/>
        <MenuItem link="/profile" Icon={UserIcon}/>
        <MenuItem link="/test-plans" Icon={RectangleStackIcon}/>
        <MenuItem link="/settings" Icon={CogIcon}/>
      </div>

      {!loading ? (
        <div className="pb-4">
          <Menu as="div" className="relative inline-block text-left w-full">
            <div className="flex justify-center">
              <Menu.Button
                className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink"
              >
                {userDetails.avatar ? (
                  <img
                    src={userDetails.avatar}
                    alt={`${userDetails.firstName} ${userDetails.lastName}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center text-white text-xl font-semibold">
                    {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
                  </div>
                )}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="z-20 absolute left-full bottom-0 ml-2 w-64 origin-top-left bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {`${userDetails.firstName} ${userDetails.lastName}`}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{userDetails.email}</p>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({active}) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
        </div>
      ) : (
        <div className="p-7">
          <Spinner/>
        </div>
      )}
    </div>
  );
}

export default Sidebar;