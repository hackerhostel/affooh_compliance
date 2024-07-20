import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import UserListPage from "./UserListPage.jsx";
import UserContentPage from "./UserContentPage.jsx";

const UserLayout = () => {
  return (
    <MainPageLayout
      title="Users"
      leftColumn={<UserListPage />}
      rightColumn={<UserContentPage />}
    />
  );
}

export default UserLayout;