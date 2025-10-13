import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ExternalProvidersListPage from "./ExternalProvidersListPage.jsx";
import ExternalProviders from "../project-page/ExternalProvidersContent.jsx";
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
      leftColumn={<ExternalProvidersListPage />}
      rightColumn={<ExternalProviders />}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    <CreateNewProjectPopup onClose={handleClose} isOpen={isOpen}/>
    </>
    
    
  );
}

export default ProjectLayout;