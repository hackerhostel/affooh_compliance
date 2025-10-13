import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import FolderListPage from "./DocumentaryListPage.jsx";
import FolderContentPage from "./FolderContentPage.jsx";
import CreateDocument from "./CreateFolderComponent.jsx"
import {useMemo, useState} from "react";

const FolderLayout = () => {
  // Temporary local data source; replace with API/Redux as needed
  const [folders] = useState([
    { id: "1", name: "Policies", description: "Organization policies and SOPs", owner: "Admin", updatedAt: "2025-09-18" },
    { id: "2", name: "Audit Docs", description: "Audit evidence and reports", owner: "QA Lead", updatedAt: "2025-09-12" },
    { id: "3", name: "Vendor Contracts", description: "MSAs, DPAs, SLAs", owner: "Legal", updatedAt: "2025-08-03" },
  ]);

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedFolder = useMemo(() => folders.find(f => f.id === selectedFolderId) || null, [folders, selectedFolderId]);

 const onAddNew = () => {
      setIsOpen(true)
    };
  
    const handleClose = () => {
      setIsOpen(false);
    }
  return (
    <>
    <MainPageLayout
     title="Folders"
      leftColumn={<FolderListPage folders={folders} selectedFolderId={selectedFolderId} onSelect={setSelectedFolderId} />}
      rightColumn={<FolderContentPage folder={selectedFolder} />}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    <CreateDocument onClose={handleClose} isOpen={isOpen}/>
    </>
  );
}

export default FolderLayout;