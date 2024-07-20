import { Menu } from '@headlessui/react';
import { HomeIcon, UserIcon, BellIcon, CogIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from "react-router-dom";
import AffoohLogo from '../../assets/affooh_logo.png'

function Sidebar() {
  const location = useLocation();

  const MenuItem = ({ link, Icon }) => (
    <Menu as="div">
      <Link to={link}
            className={`w-12 h-12 ${location.pathname === link ? 'bg-primary-pink' : 'bg-gray-200 hover:bg-secondary-pink'} rounded-full flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${location.pathname === link ? 'text-white' : 'text-gray-700'}`} />
      </Link>
    </Menu>
  );

  return (
    <div  className="flex flex-col h-screen border-r border-r-gray-200">
      <div className="w-20 h-20 items-center justify-center text-center px-2 py-4">
        <img
          src={AffoohLogo}
          alt="Affooh Logo"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="w-20 text-white flex flex-col items-center py-5 space-y-6">
        <MenuItem link="/dashboard" Icon={HomeIcon}/>
        <MenuItem link="/projects" Icon={ClipboardIcon}/>
        <MenuItem link="/profile" Icon={UserIcon}/>
        <MenuItem link="/notifications" Icon={BellIcon}/>
        <MenuItem link="/settings" Icon={CogIcon}/>
      </div>
    </div>

  );
}

export default Sidebar;
