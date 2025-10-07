import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import DocumentaryListPage from "./DocumentaryListPage.jsx";
import DocumentaryContentPage from "./DocumentaryContentPage.jsx";
import { PlusCircleIcon } from "@heroicons/react/24/outline/index.js";
import {useState} from "react";
import CreateDocument from "./DocumentCreate.jsx" 

const UserLayout = () => {
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
     title="Mandatory Documents"
      leftColumn={<DocumentaryListPage />}
      rightColumn={<DocumentaryContentPage />}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    <CreateDocument onClose={handleClose} isOpen={isOpen}/>
    </>
  );
}

export default UserLayout;