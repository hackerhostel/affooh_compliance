import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ProjectListPage from "./ProjectListPage.jsx";
import ProjectContentPage from "./ProjectContentPage.jsx";
import ExternalProviders from "../project-page/ExternalProviders.jsx";
import CreateNewProjectPopup from '../../components/popupForms/createNewProject.jsx';
import {useState} from "react";
const ProjectLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onAddNew = () => {
    setIsOpen(true)
  };

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <>
    <MainPageLayout
      title="External Providers"
      leftColumn={<ProjectListPage />}
      rightColumn={<ExternalProviders />}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    <CreateNewProjectPopup onClose={handleClose} isOpen={isOpen}/>
    </>
    
    
  );
}

export default ProjectLayout;