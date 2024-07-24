import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ProjectListPage from "./ProjectListPage.jsx";
import ProjectContentPage from "./ProjectContentPage.jsx";

const ProjectLayout = () => {
  return (
    <MainPageLayout
      title="All Projects"
      leftColumn={<ProjectListPage />}
      rightColumn={<ProjectContentPage />}
    />
  );
}

export default ProjectLayout;