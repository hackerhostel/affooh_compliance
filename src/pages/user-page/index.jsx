import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import UserListPage from "./UserListPage.jsx";
import UserContentPage from "./UserContentPage.jsx";
import { PlusCircleIcon } from "@heroicons/react/24/outline/index.js";

const UserLayout = () => {
  return (
    <MainPageLayout
      title={
        <div style={{ display: 'flex', gap: '96px', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Users</span>
        <div className={"flex gap-1 items-right justify-end mr-5"}>
          <PlusCircleIcon  className={"w-6 h-6 text-pink-500 cursor-pointer"} />
          <button className="font-thin text-xs text-gray-600 cursor-pointer">Add New</button>
        </div>
      </div>
      }
      leftColumn={<UserListPage />}
      rightColumn={<UserContentPage />}
    />
  );
}

export default UserLayout;