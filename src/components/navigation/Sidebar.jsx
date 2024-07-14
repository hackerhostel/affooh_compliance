import {Menu} from '@headlessui/react';
import {HomeIcon, UserIcon, BellIcon, CogIcon} from '@heroicons/react/24/outline';
import {Link} from "react-router-dom";

const MenuItem = ({link, children}) => (
  <Menu as="div">
    <Link to={link}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center">
      {children}
    </Link>
  </Menu>
)

function Sidebar() {
  return (
    <div className="h-full w-16 bg-gray-800 text-white flex flex-col items-center py-5 space-y-3">
      {/* Home Icon */}
      <MenuItem link="/dashboard">
        <HomeIcon className="w-6 h-6"/>
      </MenuItem>

      {/* User Icon */}
      <MenuItem link="/profile">
        <UserIcon className="w-6 h-6"/>
      </MenuItem>

      {/* Notifications Icon */}
      <MenuItem link="/notifications">
        <BellIcon className="w-6 h-6"/>
      </MenuItem>

      {/* Settings Icon */}
      <MenuItem link="/settings">
        <CogIcon className="w-6 h-6"/>
      </MenuItem>
    </div>
  );
}

export default Sidebar;