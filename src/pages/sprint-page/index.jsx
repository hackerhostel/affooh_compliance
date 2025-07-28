import React, {useState} from 'react';
import MainPageLayout from '../../layouts/MainPageLayout.jsx';
import GapAnalysisListPage from "./GapAnalysisListPage.jsx";
import GapAnalysisContent from "./GapAnalysisContent.jsx";
import CreateSprintPopup from '../../components/popupForms/createSprint.jsx';
import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";

const SprintLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedProject = useSelector(selectSelectedProject);
  
  const onAddNew = () => {
    setIsOpen(true)
  };

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
      <>
        <MainPageLayout
            title={selectedProject?.projectType === 1 ? 'Gap Analysis ' : 'Kanban'}
            onAction={onAddNew}
            subText={selectedProject?.projectType === 1 ? 'Add New' : ''}
            leftColumn={<GapAnalysisListPage/>}
            rightColumn={<GapAnalysisContent/>}
        />
        <CreateSprintPopup handleClosePopup={handleClose} isOpen={isOpen}/>
      </>
  );
};

export default SprintLayout;
