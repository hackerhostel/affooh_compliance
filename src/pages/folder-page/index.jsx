import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import FolderListPage from "./FolderListPage.jsx";
import FolderContentPage from "./FolderContentPage.jsx";
import {useMemo, useState} from "react";

const FolderLayout = () => {
  // Temporary local data source; replace with API/Redux as needed
  const [folders] = useState([
    { id: "1", name: "Policies", description: "Organization policies and SOPs", owner: "Admin", updatedAt: "2025-09-18" },
    { id: "2", name: "Audit Docs", description: "Audit evidence and reports", owner: "QA Lead", updatedAt: "2025-09-12" },
    { id: "3", name: "Vendor Contracts", description: "MSAs, DPAs, SLAs", owner: "Legal", updatedAt: "2025-08-03" },
  ]);

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const selectedFolder = useMemo(() => folders.find(f => f.id === selectedFolderId) || null, [folders, selectedFolderId]);

  const onAddNew = () => {
    // Hook up to real create modal later
    // eslint-disable-next-line no-alert
    alert("Add New Folder - not yet implemented");
  };

  return (
    <>
    <MainPageLayout
     title="Folders"
      leftColumn={<FolderListPage folders={folders} selectedFolderId={selectedFolderId} onSelect={setSelectedFolderId} />}
      rightColumn={<FolderContentPage folder={selectedFolder} />}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    </>
  );
}

export default FolderLayout;