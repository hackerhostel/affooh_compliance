import AssetManagementListPage from "./AssetManagementListPage.jsx";
import AssetManagementContent from "./AssetManagementContent.jsx";
import ReleaseCreate from "./ReleaseCreate.jsx";
import {useState} from "react";
import MainPageLayout from "../../layouts/MainPageLayout.jsx";


const ReleaseLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onAddNew = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
      <MainPageLayout
          title={"Asset  Management"}
          onAction={onAddNew}
          subText={"Add New"}
          leftColumn={<AssetManagementListPage/>}
          rightColumn={
            <div className={"bg-dashboard-bgc"}>
              <AssetManagementContent />
              <ReleaseCreate onClose={handleClose} isOpen={isOpen}/>
            </div>
          }
      />
  );
};

export default ReleaseLayout;
