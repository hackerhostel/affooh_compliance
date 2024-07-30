import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import SprintListPage from "./SprintListPage.jsx";
import SprintContentPage from "./SprintContentPage.jsx";

const SprintLayout = () => {
  return (
    <MainPageLayout
      title="Sprints"
      leftColumn={<SprintListPage />}
      rightColumn={<SprintContentPage />}
    />
  );
}

export default SprintLayout;