import React, { useState } from 'react';
import MainPageLayout from '../../layouts/MainPageLayout.jsx';
import ReleaseListPage from "./ReleaseListPage.jsx";
import ReleaseContentPage from "./ReleaseContentPage.jsx";
import CreateNewProject from '../../components/popupForms/createNewProject.jsx';
import { PlusCircleIcon } from "@heroicons/react/24/outline/index.js";

const ReleaseLayout = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleAddNewClick = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <MainPageLayout
      title={
        <div style={{ display: 'flex', gap: '96px', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Release</span>
          <div className={"flex gap-1 items-center mr-3 cursor-pointer"}>
            <PlusCircleIcon onClick={handleAddNewClick} className={"w-6 h-6 text-pink-500"} />
            <button className="font-thin text-xs text-gray-600">Add New</button>
          </div>
        </div>
      }
      leftColumn={<ReleaseListPage />}
      rightColumn={
        <div className={"bg-dashboard-bgc"}>
          <ReleaseContentPage />
          {isPopupVisible && (
            <CreateNewProject
              handleClosePopup={handleClosePopup} // Pass function to close the popup
            />
          )}
        </div>
      }
    />
  );
};

export default ReleaseLayout;
