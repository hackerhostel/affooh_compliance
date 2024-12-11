import { Menu, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  CogIcon,
  HomeIcon,
  RectangleStackIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import AffoohLogo from '../../assets/affooh_logo.png';
import { useSelector } from 'react-redux';
import { selectUser } from '../../state/slice/authSlice';
import { Fragment, useState } from 'react';

function Sidebar() {
  const location = useLocation();
  const userDetails = useSelector(selectUser);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ global: true });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const MenuItem = ({ link, Icon }) => (
    <Link
      to={link}
      className={`w-12 h-12 ${
        location.pathname === link
          ? 'bg-primary-pink'
          : 'bg-gray-200 hover:bg-secondary-pink'
      } rounded-full flex items-center justify-center transition-colors duration-200`}
    >
      <Icon
        className={`w-6 h-6 ${
          location.pathname === link ? 'text-white' : 'text-gray-700'
        }`}
      />
    </Link>
  );

  return (
    <div className="w-20 flex flex-col h-screen border-r border-r-gray-200 bg-white shadow-md">
      <div className="h-20 flex items-center justify-center px-2 py-4">
        <img
          src={AffoohLogo}
          alt="Affooh Logo"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="flex flex-col h-full justify-between">
        {/* Menu items section */}
        <div className="flex-grow flex flex-col items-center py-5 space-y-6">
          <MenuItem link="/dashboard" Icon={HomeIcon} />
          <MenuItem link="/sprints" Icon={ClipboardDocumentCheckIcon} />
          <MenuItem link="/test-plans" Icon={RectangleStackIcon} />
          <MenuItem link="/releases" Icon={CheckIcon} />
          <MenuItem link="/projects" Icon={ClipboardIcon} />
          <MenuItem link="/profile" Icon={UserIcon} />

        
          <div className="flex flex-col items-center ">
            {!loading ? (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink">
                  {userDetails.avatar ? (
                    <img
                      src={userDetails.avatar}
                      alt={`${userDetails.firstName} ${userDetails.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
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
                  <Menu.Items className="absolute top-0 right-[-17rem] mt-2 w-64 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {`${userDetails.firstName} ${userDetails.lastName}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {userDetails.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700'
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
              <div className="w-12 h-12 flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center py-5 space-y-6">
          <MenuItem link="/settings" Icon={CogIcon} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
