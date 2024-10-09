import ReleaseListPage from "./ReleaseListPage.jsx";
import ReleaseContentPage from "./ReleaseContentPage.jsx";
import ReleaseCreate from "./ReleaseCreate.jsx";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
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
      title={
        <div className="flex justify-between items-center">
          <div>Releases</div>
          <div>
            <div
              onClick={onAddNew}
              className={"flex items-center cursor-pointer"}
            >
              <PlusCircleIcon className={"w-6 h-6 text-pink-500"} />
              <button className="font-thin text-xs text-gray-600">
                Add New
              </button>
            </div>
          </div>
        </div>
      }
      leftColumn={<ReleaseListPage />}
      rightColumn={
        <div className={"bg-dashboard-bgc"}>
          <ReleaseContentPage />

          <ReleaseCreate onClose={handleClose} isOpen={isOpen} />
        </div>
      }
    />
  );
};

export default ReleaseLayout;
