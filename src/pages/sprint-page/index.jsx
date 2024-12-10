import React, {useState} from 'react';
import MainPageLayout from '../../layouts/MainPageLayout.jsx';
import SprintListPage from "./SprintListPage.jsx";
import SprintContentPage from "./SprintContentPage.jsx";
import CreateSprintPopup from '../../components/popupForms/createSprint.jsx';
import {SprintSchema} from '../../state/domains/authModels.js';

const SprintLayout = () => {
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
      title={"Sprints"}
      onAction={onAddNew}
      subText={"Add New"}
      leftColumn={<SprintListPage />}
      rightColumn={ <SprintContentPage />
      }
    />
    <CreateSprintPopup handleClosePopup = {handleClose} isOpen = {isOpen}/>
    </>
    
  );
};

export default SprintLayout;
