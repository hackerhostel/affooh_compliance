import {Menu, Transition} from '@headlessui/react';
import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  CogIcon,
  HomeIcon,
  RectangleStackIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {Link, useLocation} from "react-router-dom";
import AffoohLogo from '../../assets/affooh_logo.png'





function Sidebar() {
  const location = useLocation(); 

  const MenuItem = ({link, Icon}) => (
    <Link to={link}
          className={`w-12 h-12 ${location.pathname === link ? 'bg-primary-pink' : 'bg-gray-200 hover:bg-secondary-pink'} rounded-full flex items-center justify-center transition-colors duration-200`}>
      <Icon className={`w-6 h-6 ${location.pathname === link ? 'text-white' : 'text-gray-700'}`}/>
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
  </div>
  
  {/* Settings icon section */}
  <div className="flex flex-col items-center py-5 space-y-6">
    <MenuItem link="/settings" Icon={CogIcon} />
  </div>
</div>

    </div>
  );
}

export default Sidebar;